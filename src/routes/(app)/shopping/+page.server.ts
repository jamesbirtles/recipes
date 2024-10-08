import { error, fail } from '@sveltejs/kit';

export const load = async ({ locals: { supabase }, depends }) => {
	depends('supabase:shopping_list_items');
	const result = await supabase.from('shopping_list_items').select('*').order('order');
	return { items: result.data ?? [] };
};

export const actions = {
	add: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			return fail(401, { message: 'Must be logged in to add item to shopping list' });
		}

		const formData = await request.formData();
		const name = formData.get('item');
		if (typeof name !== 'string' || name.trim() === '') {
			return fail(400, { message: 'Invalid item name' });
		}

		const { error } = await supabase.rpc('insertShoppingListItem', {
			name: name.trim(),
			quantity: undefined,
			unit: undefined,
			user_id: user.id,
		});
		if (error) {
			throw error;
		}
	},
	clearChecked: async ({ locals: { supabase } }) => {
		const result = await supabase.rpc('clearCheckedShoppingListItems');
		if (result.error) {
			error(500, result.error);
		}
	},
};
