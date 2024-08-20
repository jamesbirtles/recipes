<script lang="ts">
	import { Card, CardHeader, CardTitle } from './ui/card';

	export let recipe;
</script>

<Card class="overflow-clip">
	<img
		src="https://loremflickr.com/400/260/meal,dish?random={Math.random()}"
		alt=""
		width="400"
		height="260"
	/>
	<CardHeader>
		<CardTitle>{recipe.title}</CardTitle>
	</CardHeader>
</Card>
