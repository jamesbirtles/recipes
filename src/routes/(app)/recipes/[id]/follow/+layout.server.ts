export const load = async ({ params, locals: { supabase } }) => {
	const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
	return { recipe: result.data };
};
