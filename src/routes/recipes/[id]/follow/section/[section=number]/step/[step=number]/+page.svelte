<script lang="ts">
	import { Option } from 'effect';
	import StepButtons from '../../../../StepButtons.svelte';

	export let data;
	$: ({ recipe, section, step, stepNumber, nextStepHref, prevStepHref } = data);
</script>

<h1 class="mb-16 mr-12 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	{section.title} — Step {stepNumber}
</h1>

{#if Option.isSome(step.title)}
	<h2 class="mb-12 scroll-m-20 text-2xl font-semibold tracking-tight">{step.title.value}</h2>
{/if}

<p class="max-w-prose text-2xl">{step.text}</p>

<StepButtons
	prev={prevStepHref}
	next={nextStepHref}
	nextLabel={nextStepHref === `/recipes/${recipe.id}` ? 'Done' : 'Next Step'}
/>
