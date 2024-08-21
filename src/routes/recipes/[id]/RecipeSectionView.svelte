<script lang="ts">
	import type { RecipeSection } from '$lib/Recipe';
	import { Option } from 'effect';
	export let section: typeof RecipeSection.Type;
</script>

<h3 class="scroll-m-20 text-xl font-semibold tracking-tight">
	{section.title}
</h3>

{#each section.steps as step, index}
	<h4 class="mb-2 mt-6 font-semibold">
		Step {index + 1}
	</h4>

	<p class="whitespace-pre-line leading-7">
		{#if Option.isSome(step.title)}
			<span class="font-semibold">{step.title.value}:</span>
		{/if}
		{step.text}
	</p>
{/each}
