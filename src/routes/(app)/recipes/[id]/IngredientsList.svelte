<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { convertToMetric, type Ingredient } from '$lib/Recipe';
	import { twMerge } from 'tailwind-merge';
	import ParsedIngredientsList from './ParsedIngredientsList.svelte';

	export let ingredients: readonly (typeof Ingredient.Type)[];
	export let originalIngredients: readonly string[];
	export let listClass: string | undefined = undefined;
	export let hintClass: string | undefined = undefined;
</script>

<Tabs value="parsed" class="mt-4 w-full">
	<TabsList class="mb-4 grid w-full grid-cols-3">
		<TabsTrigger value="parsed">Normalised</TabsTrigger>
		<TabsTrigger value="metric">Metric</TabsTrigger>
		<TabsTrigger value="original">Original</TabsTrigger>
	</TabsList>
	<TabsContent value="parsed">
		<ParsedIngredientsList {ingredients} class={listClass} {hintClass} />
	</TabsContent>
	<TabsContent value="metric">
		<ParsedIngredientsList {ingredients} class={listClass} {hintClass} convert={convertToMetric} />
	</TabsContent>
	<TabsContent value="original">
		<ul class={twMerge('ml-6 list-disc space-y-1 text-gray-700', listClass)}>
			{#each originalIngredients as ingredient}
				<li>
					{ingredient}
				</li>
			{/each}
		</ul>
	</TabsContent>
</Tabs>
