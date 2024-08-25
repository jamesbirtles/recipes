import { decodeRecipe, encodeIngredient } from '$lib/Recipe.js';
import { ingredientsForStep } from '$lib/Recipe.server';
import { error } from '@sveltejs/kit';
import { Option, Array, Effect } from 'effect';

export const load = async ({ parent, params }) => {
	const data = await parent();
	const sectionIndex = Number(params.section) - 1;
	const stepIndex = Number(params.step) - 1;
	const recipe = decodeRecipe(data.recipe);
	const section = recipe.instructions.pipe(
		Option.andThen(Array.get(sectionIndex)),
		Option.getOrElse(() => error(404, 'Recipe section not found')),
	);
	const step = Array.get(section.steps, stepIndex).pipe(
		Option.getOrElse(() => error(404, 'Recipe step not found')),
	);

	const relatedIngredients = ingredientsForStep(recipe.ingredients, step.text).pipe(
		Effect.andThen((ingredients) => ingredients.map((i) => encodeIngredient(i))),
		Effect.runPromise,
	);

	return { relatedIngredients };
};
