<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';

	export let next: string;
	export let nextLabel = 'Next Step';
	export let prev: string;
	export let prevLabel = 'Previous Step';
</script>

<div class="mt-auto grid grid-cols-2 gap-8">
	<Button size="huge" variant="outline" href={prev}>
		<ArrowLeftIcon class="mr-6 h-8 w-8" />
		{prevLabel}
	</Button>
	<Button size="huge" href={next}>
		{nextLabel}
		<ArrowRightIcon class="ml-6 h-8 w-8" />
	</Button>
</div>
