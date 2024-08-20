import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	async default(event) {
		const formData = await event.request.formData();
		const recipeURL = formData.get('url');
		if (recipeURL == null || typeof recipeURL !== 'string' || recipeURL.trim().length === 0) {
			return fail(400, { status: 'error', message: 'Recipe URL missing or invalid' });
		}

		console.log('go import the recipe', recipeURL);
		redirect(307, '/');
	}
};
