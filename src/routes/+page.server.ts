export const load = async ({ locals: { supabase } }) => {
	const result = await supabase.from('recipes').select();
	return { recipes: result.data ?? [] };
};
