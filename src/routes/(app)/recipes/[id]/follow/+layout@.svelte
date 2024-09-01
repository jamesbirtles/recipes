<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import XIcon from 'lucide-svelte/icons/x';
	import { keepScreenAwake } from '$lib/keepScreenAwake.js';

	export let data;

	keepScreenAwake();
</script>

<div class="mx-auto flex h-screen max-w-screen-2xl flex-col p-8 md:p-16 lg:p-24">
	<Button
		href="/recipes/{data.recipe.id}"
		size="icon-lg"
		variant="ghost"
		class="absolute right-4 top-4 md:right-12 md:top-12"
	>
		<XIcon class="h-7 w-7" />
	</Button>

	<slot />
</div>
