import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals: { supabase } }) => {
	const query = url.searchParams.get('query')?.trim();
	let dbQuery = supabase.from('recipes').select().order('created_at');
	if (query) {
		dbQuery = dbQuery.textSearch('title', query, { type: 'websearch' });
	}
	const result = await dbQuery;
	return { recipes: result.data ?? [], query };
};

export const actions = {
	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(307, '/');
	},
};
