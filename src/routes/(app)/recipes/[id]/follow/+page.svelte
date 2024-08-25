<script lang="ts">
	import IngredientsList from '../IngredientsList.svelte';
	import StepButtons from './StepButtons.svelte';

	export let data;
	$: ({ recipe } = data);
</script>

<h1 class="mr-12 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	Gather Your Ingredients
</h1>

<IngredientsList
	listClass="grid grid-cols-2 text-xl"
	hintClass="text-base"
	ingredients={recipe.ingredients}
	originalIngredients={recipe.original_ingredients}
/>

<StepButtons prev="/recipes/{recipe.id}" next="/recipes/{recipe.id}/follow/section/1/step/1" />
