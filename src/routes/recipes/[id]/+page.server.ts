import { decodeRecipe, encodeRecipe, importRecipe, Recipe } from '$lib/Recipe.js';
import { fail } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
	const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
	return { recipe: result.data };
};

export const actions = {
	async reimport({ params, locals: { supabase } }) {
		const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
		const existingRecipe = decodeRecipe(result.data);

		const recipe = await importRecipe(supabase, existingRecipe.url);
		if (recipe == null) {
			return fail(400, { status: 'error', message: 'Recipe not found in page' });
		}

		const { error } = await supabase
			.from('recipes')
			.update(encodeRecipe(Recipe.make({ ...recipe, id: existingRecipe.id })))
			.eq('id', existingRecipe.id);
		if (error) {
			console.error('Failed to reimport recipe', error);
			return fail(500, {
				status: 'error',
				message: 'Something went wrong trying to reimport the recipe. Please try again later.',
			});
		}
	},
};
