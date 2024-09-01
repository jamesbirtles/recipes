<script lang="ts">
	import { cn } from '$lib/utils';

	export let href = '/';
	export let active = false;
</script>

<a
	{href}
	class={cn(
		'flex flex-col items-center gap-1 rounded-sm border border-transparent p-2 text-xs font-semibold tracking-tight transition sm:gap-2 sm:rounded-lg sm:p-4 sm:text-lg',
		active ? 'bg-primary text-primary-foreground' : 'hover:border-gray-200 hover:bg-muted',
	)}
>
	<slot />
</a>
