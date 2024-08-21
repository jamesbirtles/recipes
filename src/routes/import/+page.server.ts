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

		const recipe = await importRecipe(recipeURL);
		if (recipe == null) {
			return fail(400, { status: 'error', message: 'Recipe not found in page' });
		}

		const id = crypto.randomUUID();
		const image = recipe.image ? await uploadImageToBucket(id, recipe.image) : null;

		const { error } = await supabase.from('recipes').insert({
			id,
			title: recipe.title,
			url: recipe.url,
			image,
		});
		if (error) {
			console.error('Failed to insert recipe', error);
			return fail(500, {
				status: 'error',
				message: 'Something went wrong trying to save the recipe. Please try again later.',
			});
		}

		redirect(307, '/');
	},
};

const uploadImageToBucket = async (recipeID: string, imageURL: string) => {
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
