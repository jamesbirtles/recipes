<script lang="ts">
	import { cn } from '$lib/utils';

	export let href = '/';
	export let active = false;
</script>

<a
	{href}
	class={cn(
		'flex flex-col items-center gap-2 rounded-lg border border-transparent p-4 text-lg font-semibold tracking-tight transition',
		active ? 'bg-primary text-primary-foreground' : 'hover:border-gray-200 hover:bg-muted',
	)}
>
	<slot />
</a>
