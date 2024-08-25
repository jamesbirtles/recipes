import { decodeRecipe } from '$lib/Recipe.js';

export const load = ({ data }) => {
	const recipe = decodeRecipe(data.recipe);
	return { recipe };
};
