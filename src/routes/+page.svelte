<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import ImportIcon from 'lucide-svelte/icons/import';

	export let data;
</script>

<svelte:head>
	<title>Recipes</title>
</svelte:head>

<h1
	class="mb-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
>
	Saved Recipes
</h1>

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

<div class="mt-8 flex items-center justify-center">
	<Button href="/import"><ImportIcon class="mr-4 h-4 w-4" /> Import Recipe</Button>
</div>

<pre class="mt-48">{JSON.stringify(data, null, 2)}</pre>
