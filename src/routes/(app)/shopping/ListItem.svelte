<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { cn } from '$lib/utils';
	import { Option } from 'effect';

	export let name: string;
	export let quantity: Option.Option<number> = Option.none();
	export let unit: Option.Option<string> = Option.none();
	export let checked: boolean = false;
	export let onCheckedChange: ((checked: boolean) => void) | undefined = undefined;
</script>

<div class="flex gap-2">
	<Checkbox
		class="mt-2.5"
		disabled={!onCheckedChange}
		bind:checked
		onCheckedChange={(change) => {
			if (change !== 'indeterminate') {
				onCheckedChange?.(change);
			}
		}}
	/>
	<div class="flex flex-col px-2 py-1">
		<div class={cn('text-lg', checked && 'text-muted-foreground line-through')}>
			{name}
		</div>
		{#if Option.isSome(quantity) && !checked}
			<div class="text-sm text-muted-foreground">
				{quantity.value}
				{unit.pipe(Option.getOrElse(() => 'items'))}
			</div>
		{/if}
	</div>
</div>
