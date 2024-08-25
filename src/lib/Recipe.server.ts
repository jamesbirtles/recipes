import * as cheerio from 'cheerio';
import * as StructuredData from './StructuredData';
import { Array, Match, Option, Predicate } from 'effect';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createOpenAI } from '@ai-sdk/openai';
import { JSONSchema, Schema } from '@effect/schema';
import { encodeIngredient, Ingredient, NewRecipe, RecipeSection, RecipeStep } from './Recipe';
import { jsonSchema, streamObject } from 'ai';
import { Chunk, Effect, Stream } from 'effect';
import { OPEN_AI_KEY } from '$env/static/private';

// TODO: investigate security implications of just visiting and downloading any URL the user gives us.

export const importRecipe = async (url: string): Promise<typeof NewRecipe.Type | null> => {
	const result = await fetch(url, {
		headers: { accept: 'text/html' },
	});
	if (result.status != 200) {
		throw new Error('Recipe URL responded with a non 200 status code');
	}

	const contentType = result.headers.get('Content-Type');
	if (!contentType?.startsWith('text/html')) {
		throw new Error('Expected recipe to return text/html content.');
	}

	const html = await result.text();
	const select = cheerio.load(html);
	const ldjson = select('script[type=application/ld+json]').text().trim();
	if (!ldjson) {
		throw new Error('Page does not contain any metadata');
	}

	const ld = tryParse(ldjson);
	const recipe = await findRecipe(url, ld);
	return recipe;
};

const tryParse = (value: string): Record<string, unknown>[] => {
	try {
		// Kind of an ugly hack to parse back-to-back json objects. Maybe should look into
		// a better parser..
		return JSON.parse('[' + value.replace(/\}\{/g, '},{') + ']');
	} catch {
		throw new Error('Page metadata is not valid JSON');
	}
};

// I'm sort of tempted to try and bring in something like Effect-ts Schema to parse this data,
// in rust I would probably be using serde
const findRecipe = async (
	url: string,
	objects: Record<string, unknown>[],
): Promise<typeof NewRecipe.Type | null> => {
	for (const object of objects) {
		const type = object['@type'];
		if (type === 'Recipe') {
			return extractRecipe(url, object);
		}

		const graph = object['@graph'];
		if (Array.isArray(graph)) {
			const recipe = await findRecipe(url, graph as Record<string, unknown>[]);
			if (recipe != null) return recipe;
		}
	}

	return null;
};

const str = <T>(
	object: Record<string | number, unknown> | unknown[],
	key: string | number,
	fallback: T,
): string | T => {
	const value = (object as Record<string | number, unknown>)[key];
	if (typeof value === 'string') {
		return value;
	}
	return fallback;
};

const img = (object: Record<string, unknown>, key: string): string | null => {
	const get = (value: unknown) => {
		if (value == null) {
			return null;
		}
		if (typeof value === 'string') {
			return value;
		}
		if (typeof value === 'object' && '@type' in value && value['@type'] === 'ImageObject') {
			return str(value, 'url', null);
		}
		return null;
	};

	const value = object[key];
	return Array.isArray(value) ? get(value[0]) : get(value);
};

const howToStepToRecipeStep = (step: typeof StructuredData.HowToStep.Type) =>
	RecipeStep.make({
		title: step.name.pipe(
			// Some sites set these to the same, which is undesirable
			Option.filter((name) => name !== step.text),
		),
		text: step.text,
	});

const extractRecipe = async (
	sourceURL: string,
	object: Record<string, unknown>,
): Promise<typeof NewRecipe.Type> => {
	// TODO: use effect schema to extract these
	const url = str(object, 'mainEntityOfPage', str(object, '@id', sourceURL));
	const image = Option.fromNullable(img(object, 'image'));

	const recipe = StructuredData.decodeRecipe(object);
	const instructions = recipe.recipeInstructions.pipe(
		Option.andThen((items) =>
			Match.value(items).pipe(
				Match.when(Array.every(Predicate.isString), () => {
					throw new Error('String-only recipe instructions not yet supported');
				}),
				Match.when(Array.every(Predicate.isTagged('HowToSection')), (sections) =>
					sections.map((section, index) =>
						RecipeSection.make({
							title: section.name.pipe(
								Option.andThen((text) => text.replace(/\s*[:-]\s*$/, '')),
								Option.getOrElse(() => `Section ${index + 1}`),
							),
							steps: section.itemListElement.map((step) => howToStepToRecipeStep(step)),
						}),
					),
				),
				Match.when(Array.every(Predicate.isTagged('HowToStep')), (steps) => [
					RecipeSection.make({
						title: 'Method',
						steps: steps.map((step) => howToStepToRecipeStep(step)),
					}),
				]),
				Match.exhaustive,
			),
		),
	);

	const ingredients = await extractIngredients(recipe.recipeIngredient).pipe(Effect.runPromise);

	return {
		id: crypto.randomUUID(),
		title: recipe.name,
		url,
		image,
		instructions,
		ingredients,
		original_ingredients: recipe.recipeIngredient,
	};
};

export const uploadRecipeImage = async (
	supabase: SupabaseClient,
	userID: string,
	recipeID: string,
	imageURL: string,
) => {
	const imageResponse = await fetch(imageURL, { headers: { accept: 'image/*' } });
	// TODO: some amount of validation that the image response was valid
	const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg';
	const imageData = await imageResponse.arrayBuffer();

	const { data, error } = await supabase.storage
		.from('recipe-images')
		.upload(`${userID}/${recipeID}.jpg`, imageData, { contentType, upsert: true });
	if (error) {
		console.error('Failed to upload image to bucket', error);
		throw error;
	}

	return data!.path;
};

const IngredientJSONSchema = JSONSchema.make(Ingredient);
const parseIngredient = Schema.decodeUnknown(Ingredient);

const openai = createOpenAI({ apiKey: OPEN_AI_KEY });
const model = openai('gpt-4o-mini');

const extractIngredients = (ingredients: readonly string[]) =>
	Effect.tryPromise(() =>
		streamObject({
			model,
			output: 'array',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			schema: jsonSchema(IngredientJSONSchema as any),
			messages: [
				{
					role: 'system',
					content: 'Convert the list of ingredients into the given format.',
				},
				{ role: 'user', content: JSON.stringify(ingredients) },
			],
		}),
	).pipe(
		Effect.andThen(({ elementStream }) =>
			Stream.fromAsyncIterable(elementStream, (e) => e as Error).pipe(
				Stream.mapEffect(parseIngredient),
				Stream.runCollect,
			),
		),
		Effect.andThen(Chunk.toArray),
	);

export const ingredientsForStep = (
	ingredients: readonly (typeof Ingredient.Type)[],
	step: string,
) =>
	Effect.tryPromise(() =>
		streamObject({
			model,
			output: 'array',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			schema: jsonSchema(IngredientJSONSchema as any),
			messages: [
				{
					role: 'system',
					content:
						'Filter the list of ingredients provided to only those that are used in the method.',
				},
				{
					role: 'user',
					content: JSON.stringify({
						method: step,
						ingredients: ingredients.map((i) => encodeIngredient(i)),
					}),
				},
			],
		}),
	).pipe(
		Effect.andThen(({ elementStream }) =>
			Stream.fromAsyncIterable(elementStream, (e) => e as Error).pipe(
				Stream.mapEffect(parseIngredient),
				Stream.runCollect,
			),
		),
		Effect.andThen(Chunk.toArray),
	);
