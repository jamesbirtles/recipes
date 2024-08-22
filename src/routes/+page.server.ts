import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
	const result = await supabase.from('recipes').select().order('created_at');
	return { recipes: result.data ?? [] };
};

export const actions = {
	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(307, '/');
	},
};
