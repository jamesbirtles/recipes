<script lang="ts">
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
	import { Button } from './ui/button';

	export let href: string;
</script>

<Button
	variant="link"
	{href}
	class="mb-6 self-start"
	on:click={(evt) => {
		evt.preventDefault();
		window.history.back();
	}}
>
	<ArrowLeftIcon class="mr-2 h-4 w-4" />
	Back
</Button>
