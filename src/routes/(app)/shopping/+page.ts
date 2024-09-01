import { ShoppingListItem } from '$lib';

export const load = ({ data }) => {
	const items = data.items.map((item) => ShoppingListItem.decode(item));
	return { ...data, items };
};
