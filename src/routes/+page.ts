import { decodeRecipe } from '$lib/Recipe';

export const load = ({ data }) => {
	const recipes = data.recipes.map((item) => decodeRecipe(item));
	return { ...data, recipes };
};
