<script lang="ts">
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
	import { Button } from './ui/button';
	import { page } from '$app/stores';

	export let href: string;

	$: shouldReturn = $page.url.searchParams.has('return');
</script>

<Button
	variant="link"
	{href}
	class="mb-6 self-start p-0"
	on:click={(evt) => {
		if (shouldReturn) {
			evt.preventDefault();
			window.history.back();
		}
	}}
>
	<ArrowLeftIcon class="mr-2 h-4 w-4" />
	Back
</Button>
