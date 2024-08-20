<script lang="ts">
	import type { Recipe } from '$lib/Recipe';
	import { Card, CardHeader, CardTitle } from './ui/card';

	export let recipe: Recipe;
</script>

<Card class="overflow-clip">
	<img
		src={recipe.image ?? `https://loremflickr.com/400/400/meal,dish?random=${Math.random()}`}
		alt=""
		width="400"
		height="400"
		class="aspect-square object-cover"
	/>
	<CardHeader>
		<CardTitle>{recipe.title}</CardTitle>
	</CardHeader>
</Card>
