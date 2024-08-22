<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { decodeRecipe } from '$lib/Recipe.js';
	import ImportIcon from 'lucide-svelte/icons/import';
	import LogoutIcon from 'lucide-svelte/icons/log-out';

	export let data;

	$: recipes = data.recipes.map((item) => decodeRecipe(item));
</script>

<svelte:head>
	<title>Recipes</title>
</svelte:head>

<div class="mb-8 flex h-16 items-center gap-4 border-b">
	<h1 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors">Saved Recipes</h1>
	<form method="post" action="?/logout" class="ml-auto">
		{data.user?.email}
		<Button type="submit" size="sm" variant="secondary" class="ml-4">
			Logout
			<LogoutIcon class="ml-2 h-4 w-4" />
		</Button>
	</form>
</div>

<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each recipes as recipe (recipe.id)}
		<RecipeCard {recipe} />
	{/each}
</div>

<div class="mt-8 flex items-center justify-center">
	<Button href="/import" class="[view-transition-name:import-button]">
		<span class="flex items-center [view-transition-name:import-button-text]">
			<ImportIcon class="mr-4 h-4 w-4" /> Import Recipe
		</span>
	</Button>
</div>

<!-- <pre class="mt-48">{JSON.stringify(data.user, null, 2)}</pre> -->
