<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger,
	} from '$lib/components/ui/collapsible';
	import type { RecipeSection } from '$lib/Recipe';
	import { Option } from 'effect';
	import ChevronsUpDownIcon from 'lucide-svelte/icons/chevrons-up-down';

	export let section: typeof RecipeSection.Type;
</script>

<div class="mb-12">
	<h3 class="scroll-m-20 text-xl font-semibold tracking-tight">
		{section.title}
	</h3>

	{#each section.steps as step, index}
		<Collapsible open>
			<div class="mb-2 mt-6 flex items-center gap-2">
				<CollapsibleTrigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
						<ChevronsUpDownIcon class="h-4 w-4" />
						<span class="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
				<h4 class="font-semibold">
					Step {index + 1}
				</h4>
			</div>

			<CollapsibleContent class="whitespace-pre-line leading-7">
				{#if Option.isSome(step.title)}
					<span class="font-semibold">{step.title.value}:</span>
				{/if}
				{step.text}
			</CollapsibleContent>
		</Collapsible>
	{/each}
</div>
