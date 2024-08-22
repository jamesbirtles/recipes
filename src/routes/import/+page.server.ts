import { encodeRecipe, importRecipe, uploadRecipeImage } from '$lib/Recipe.js';
import { fail, redirect, error } from '@sveltejs/kit';
import { Option } from 'effect';

export const actions = {
	async default({ request, locals: { supabase, user } }) {
		if (!user) error(401, 'Must be logged in to import recipe');
		const formData = await request.formData();
		const recipeURL = formData.get('url');
		if (recipeURL == null || typeof recipeURL !== 'string' || recipeURL.trim().length === 0) {
			return fail(400, { status: 'error', message: 'Recipe URL missing or invalid' });
		}

		const recipe = await importRecipe(recipeURL);
		if (recipe == null) {
			return fail(400, { status: 'error', message: 'Recipe not found in page' });
		}

		const image = Option.isSome(recipe.image)
			? Option.some(await uploadRecipeImage(supabase, user.id, recipe.id, recipe.image.value))
			: Option.none();

		const result = await supabase
			.from('recipes')
			.insert(encodeRecipe({ ...recipe, user_id: user.id, image }));
		if (result.error) {
			console.error('Failed to insert recipe', result.error);
			return fail(500, {
				status: 'error',
				message: 'Something went wrong trying to save the recipe. Please try again later.',
			});
		}

		redirect(307, `/recipes/${recipe.id}?imported`);
	},
};
