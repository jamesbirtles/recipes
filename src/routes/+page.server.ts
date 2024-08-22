export const load = async ({ locals: { supabase } }) => {
	const result = await supabase.from('recipes').select();
	return { recipes: result.data ?? [] };
};

export const actions = {
	logout: async ({ locals: { supabase } }) => {
		console.log(await supabase.auth.signOut());
	},
};
