<script lang="ts">
	import { Option } from 'effect';
	import StepButtons from '../../../../StepButtons.svelte';
	import ParsedIngredientsList from '../../../../../ParsedIngredientsList.svelte';
	import SparklesIcon from 'lucide-svelte/icons/sparkles';

	export let data;
	$: ({ recipe, section, step, stepNumber, nextStepHref, prevStepHref, relatedIngredients } = data);
</script>

<h1 class="mb-16 mr-12 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	{section.title} — Step {stepNumber}
</h1>

{#if Option.isSome(step.title)}
	<h2 class="mb-12 scroll-m-20 text-2xl font-semibold tracking-tight">{step.title.value}</h2>
{/if}

<div class="grid grid-cols-[1fr,auto] gap-12">
	<p class="max-w-prose text-2xl">{step.text}</p>

	{#await relatedIngredients then ingredients}
		<div>
			<h3
				class="mb-2 flex scroll-m-20 items-center gap-2 text-xl font-semibold tracking-tight"
				title="AI Suggestion"
			>
				<SparklesIcon class="text-purple-500" />
				Related Ingredients
			</h3>
			<ParsedIngredientsList {ingredients} />
		</div>
	{/await}
</div>

<StepButtons
	prev={prevStepHref}
	next={nextStepHref}
	nextLabel={nextStepHref === `/recipes/${recipe.id}` ? 'Done' : 'Next Step'}
/>
