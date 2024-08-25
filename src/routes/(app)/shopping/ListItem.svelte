<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { cn } from '$lib/utils';

	export let name: string;
	export let checked: boolean;
	export let onCheckedChange: (checked: boolean) => void;
	export let onNameChange: (name: string) => void;

	// TODO: throttle name change
</script>

<div class="flex items-center gap-2">
	<Checkbox
		bind:checked
		onCheckedChange={(change) => {
			if (change !== 'indeterminate') {
				onCheckedChange(change);
			}
		}}
	/>
	<input
		type="text"
		bind:value={name}
		class={cn(
			'w-full border-b-2 border-transparent bg-transparent px-2 py-1 text-lg focus:border-primary focus:outline-none',
			checked && 'text-muted-foreground line-through',
		)}
		on:input={() => onNameChange(name)}
	/>
</div>
