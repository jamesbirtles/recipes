import { redirect } from '@sveltejs/kit';

const pageSize = 20;
export const load = async ({ url, locals: { supabase } }) => {
	const query = url.searchParams.get('query')?.trim();
	const page = Number(url.searchParams.get('page')) || 0;
	let dbQuery = supabase
		.from('recipes')
		.select('*', { count: 'exact' })
		.order('created_at')
		.range(page * pageSize, (page + 1) * pageSize - 1);
	if (query) {
		dbQuery = dbQuery.textSearch('title', query, { type: 'websearch' });
	}
	const result = await dbQuery;
	console.log(result);
	return { recipes: result.data ?? [], query, count: result.count!, pageSize, page };
};

export const actions = {
	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(307, '/');
	},
};
