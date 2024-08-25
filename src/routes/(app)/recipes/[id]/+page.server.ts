import { decodeRecipe, encodeRecipe } from '$lib/Recipe.js';
import { importRecipe, uploadRecipeImage } from '$lib/Recipe.server';
import { fail, redirect } from '@sveltejs/kit';
import { Option } from 'effect';

export const load = async ({ params, locals: { supabase } }) => {
	const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
	return { recipe: result.data };
};

export const actions = {
	async reimport({ params, locals: { supabase } }) {
		const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
		const existingRecipe = decodeRecipe(result.data);

		const recipe = await importRecipe(existingRecipe.url);
		if (recipe == null) {
			return fail(400, { status: 'error', message: 'Recipe not found in page' });
		}

		const image = Option.isSome(recipe.image)
			? Option.some(
					await uploadRecipeImage(
						supabase,
						existingRecipe.user_id,
						existingRecipe.id,
						recipe.image.value,
					),
				)
			: Option.none();

		const { error } = await supabase
			.from('recipes')
			.update(
				encodeRecipe({
					...recipe,
					id: existingRecipe.id,
					user_id: existingRecipe.user_id,
					image,
				}),
			)
			.eq('id', existingRecipe.id);
		if (error) {
			console.error('Failed to reimport recipe', error);
			return fail(500, {
				status: 'error',
				message: 'Something went wrong trying to reimport the recipe. Please try again later.',
			});
		}
	},
	async addToShoppingList({ params, locals: { supabase, user } }) {
		if (!user) {
			return fail(401, { message: 'Must be logged in to add item to shopping list' });
		}

		const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
		const recipe = decodeRecipe(result.data);

		const { error } = await supabase.from('shopping_list_items').insert(
			recipe.ingredients.map((ingredient) => ({
				name: ingredient.name,
				unit: ingredient.unit.pipe(Option.getOrNull),
				quantity: ingredient.quantity.pipe(Option.getOrNull),
				user_id: user.id,
			})),
		);
		if (error) {
			console.error('Failed to add items to shopping list', error);
			return fail(500, {
				status: 'error',
				message: 'Something went wrong trying to add items to shopping list',
			});
		}

		redirect(307, '/shopping');
	},
};
