import { encodeRecipe, importRecipe } from '$lib/Recipe.js';
import { fail, redirect, error } from '@sveltejs/kit';

export const actions = {
	async default({ request, locals: { supabase, user } }) {
		if (!user) error(401, 'Must be logged in to import recipe');
		const formData = await request.formData();
		const recipeURL = formData.get('url');
		if (recipeURL == null || typeof recipeURL !== 'string' || recipeURL.trim().length === 0) {
			return fail(400, { status: 'error', message: 'Recipe URL missing or invalid' });
		}

		const recipe = await importRecipe(supabase, recipeURL);
		if (recipe == null) {
			return fail(400, { status: 'error', message: 'Recipe not found in page' });
		}

		const result = await supabase
			.from('recipes')
			.insert(encodeRecipe({ ...recipe, user_id: user.id }));
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
