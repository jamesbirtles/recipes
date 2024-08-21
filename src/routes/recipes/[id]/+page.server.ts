import { supabase } from '$lib/supbaseClient';

export const load = async ({ params }) => {
	const result = await supabase.from('recipes').select().eq('id', params.id).limit(1).single();
	console.log(result);
	return { recipe: result.data };
};
