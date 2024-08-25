<script lang="ts">
	import { Ingredient } from '$lib/Recipe';
	import { twMerge } from 'tailwind-merge';
	import { Option } from 'effect';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let className: string | undefined = undefined;
	export { className as class };
	export let hintClass: string | undefined = undefined;

	export let ingredients: readonly (typeof Ingredient.Type)[];
</script>

<ul class={twMerge('space-y-1 text-gray-700', className)}>
	{#each ingredients as ingredient, index}
		<li class="flex">
			<Checkbox id="ingredient-{index}" class="mx-3 mt-1" />
			<label for="ingredient-{index}">
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
			</label>
		</li>
	{/each}
</ul>
