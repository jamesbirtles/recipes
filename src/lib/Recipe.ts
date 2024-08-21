import * as cheerio from 'cheerio';
import * as StructuredData from './StructuredData';
import { Schema } from '@effect/schema';
import { Array, Match, Option, Predicate } from 'effect';
import type { SupabaseClient } from '@supabase/supabase-js';

export const RecipeStep = Schema.TaggedStruct('RecipeStep', {
	title: Schema.String.pipe(Schema.optionalWith({ as: 'Option' })),
	text: Schema.String,
});

export const RecipeSection = Schema.TaggedStruct('RecipeSection', {
	title: Schema.String,
	steps: Schema.Array(RecipeStep),
});

export const Recipe = Schema.Struct({
	id: Schema.String,
	user_id: Schema.String,
	title: Schema.String,
	url: Schema.String,
	image: Schema.String.pipe(Schema.OptionFromNullOr),
	instructions: Schema.Array(RecipeSection).pipe(Schema.OptionFromNullOr),
	ingredients: Schema.Array(Schema.String),
});
export const NewRecipe = Recipe.pipe(Schema.omit('user_id'));
export const encodeRecipe = Schema.encodeUnknownSync(Recipe);
export const decodeRecipe = Schema.decodeUnknownSync(Recipe);

// TODO: investigate security implications of just visiting and downloading any URL the user gives us.

export const importRecipe = async (
	supabase: SupabaseClient,
	url: string,
): Promise<typeof NewRecipe.Type | null> => {
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
	const recipe = findRecipe(url, ld);
	if (!recipe) return null;

	const image = Option.isSome(recipe.image)
		? Option.some(await updateRecipeImage(supabase, recipe.id, recipe.image.value))
		: Option.none();

	return { ...recipe, image };
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
const findRecipe = (
	url: string,
	objects: Record<string, unknown>[],
): typeof NewRecipe.Type | null => {
	for (const object of objects) {
		const type = object['@type'];
		if (type === 'Recipe') {
			return extractRecipe(url, object);
		}

		const graph = object['@graph'];
		if (Array.isArray(graph)) {
			const recipe = findRecipe(url, graph as Record<string, unknown>[]);
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

const extractRecipe = (
	sourceURL: string,
	object: Record<string, unknown>,
): typeof NewRecipe.Type => {
	console.dir(object, { depth: Infinity });

	// TODO: use effect schema to extract these
	const url = str(object, 'mainEntityOfPage', str(object, '@id', sourceURL));
	const image = Option.fromNullable(img(object, 'image'));

	const recipe = StructuredData.decodeRecipe(object);
	console.dir(recipe, { depth: Infinity });
	const instructions = recipe.recipeInstructions.pipe(
		Option.andThen((items) =>
			Match.value(items).pipe(
				Match.when(Array.every(Predicate.isString), () => {
					throw new Error('String-only recipe instructions not yet supported');
				}),
				Match.when(Array.every(Predicate.isTagged('HowToSection')), () => {
					throw new Error('HowToSection recipe instructions not yet supported');
				}),
				Match.when(Array.every(Predicate.isTagged('HowToStep')), (steps) => [
					RecipeSection.make({
						title: 'Method',
						steps: steps.map((step) =>
							RecipeStep.make({
								title: Option.none(),
								text: step.text,
							}),
						),
					}),
				]),
				Match.exhaustive,
			),
		),
	);

	return {
		id: crypto.randomUUID(),
		title: recipe.name,
		url,
		image,
		instructions,
		ingredients: recipe.recipeIngredient,
	};
};

const updateRecipeImage = async (supabase: SupabaseClient, recipeID: string, imageURL: string) => {
	const imageResponse = await fetch(imageURL, { headers: { accept: 'image/*' } });
	// TODO: some amount of validation that the image response was valid
	const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg';
	const imageData = await imageResponse.arrayBuffer();

	const { data, error } = await supabase.storage
		.from('recipe-images')
		.upload(`recipes/${recipeID}/image.jpg`, imageData, { contentType });
	if (error) {
		console.error('Failed to upload image to bucket', error);
		throw error;
	}

	return data!.path;
};
