import { supabase } from '$lib/supbaseClient';

export const load = async () => {
	const result = await supabase.from('recipes').select();
	console.log(result);
	return { recipes: result.data ?? [] };
};
