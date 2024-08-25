<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import type { Ingredient } from '$lib/Recipe';
	import { Option } from 'effect';
	import { twMerge } from 'tailwind-merge';

	export let ingredients: readonly (typeof Ingredient.Type)[];
	export let originalIngredients: readonly string[];
	export let listClass: string | undefined = undefined;
	export let hintClass: string | undefined = undefined;
</script>

<Tabs value="parsed" class="mt-4 w-full">
	<TabsList class="mb-4 grid w-full grid-cols-2">
		<TabsTrigger value="parsed">Normalised</TabsTrigger>
		<TabsTrigger value="original">Original</TabsTrigger>
	</TabsList>
	<TabsContent value="parsed">
		<ul class={twMerge('ml-6 list-disc space-y-1 text-gray-700', listClass)}>
			{#each ingredients as ingredient}
				<li>
					{#if Option.isSome(ingredient.quantity)}
						<span>{ingredient.quantity.value}</span>
					{/if}
					{#if Option.isSome(ingredient.unit)}
						<span>{ingredient.unit.value}</span>
					{/if}
					<span>
						{ingredient.name}{ingredient.preparation.pipe(
							Option.map(() => ','),
							Option.getOrElse(() => ''),
						)}
					</span>
					{#if Option.isSome(ingredient.preparation)}
						<span>{ingredient.preparation.value}</span>
					{/if}
					{#if Option.isSome(ingredient.hint)}
						<span class={twMerge('mt-0.5 block text-sm text-muted-foreground', hintClass)}
							>{ingredient.hint.value}</span
						>
					{/if}
				</li>
			{/each}
		</ul>
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
