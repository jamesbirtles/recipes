<script lang="ts">
	import StepButtons from './StepButtons.svelte';

	export let data;
</script>

<h1 class="mr-12 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	Gather Your Ingredients
</h1>

<ul class="mt-24 grid gap-4 md:grid-cols-2">
	{#each data.recipe.ingredients as ingredient}
		<li class="text-xl">{ingredient}</li>
	{/each}
</ul>

<StepButtons
	prev="/recipes/{data.recipe.id}"
	next="/recipes/{data.recipe.id}/follow/section/1/step/1"
/>
