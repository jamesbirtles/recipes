<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';

	export let data;
</script>

<div class="mx-auto max-w-screen-2xl p-6">
	<h2
		class="mb-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Saved Recipes
	</h2>

	<div class="grid grid-cols-5 gap-4">
		{#each data.recipes as recipe}
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
			<RecipeCard {recipe} />
		{/each}
	</div>

	<pre>{JSON.stringify(data, null, 2)}</pre>
</div>
