import { importRecipe } from '$lib/Recipe.js';
import { supabase } from '$lib/supbaseClient.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	async default(event) {
		const formData = await event.request.formData();
		const recipeURL = formData.get('url');
		if (recipeURL == null || typeof recipeURL !== 'string' || recipeURL.trim().length === 0) {
			return fail(400, { status: 'error', message: 'Recipe URL missing or invalid' });
		}

		console.log('go import the recipe', recipeURL);

		const recipe = await importRecipe(recipeURL);
		if (recipe == null) {
			return fail(400, { status: 'error', message: 'Recipe not found in page' });
		}

		const { error } = await supabase.from('recipes').insert({
			title: recipe.title,
			url: recipe.url,
			// TODO: download image to storage
			image: recipe.image
		});
		if (error) {
			console.error('Failed to insert recipe', error);
			return fail(500, {
				status: 'error',
				message: 'Something went wrong trying to save the recipe. Please try again later.'
			});
		}

		redirect(307, '/');
	}
};
