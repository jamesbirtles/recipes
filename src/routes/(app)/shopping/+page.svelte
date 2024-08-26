<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import PageHeader from '../PageHeader.svelte';
	import ListItem from './ListItem.svelte';

	export let data;

	const updateChecked = async (id: string, checked: boolean) => {
		try {
			const result = await data.supabase
				.from('shopping_list_items')
				.update({ checked })
				.eq('id', id);
			if (result.error) {
				throw result.error;
			}
		} catch {
			toast.error('Failed to update shopping list');
		}
		invalidate('supabase:shopping_list_items');
	};
	const updateName = async (id: string, name: string) => {
		if (name.trim() !== '') {
			try {
				const result = await data.supabase
					.from('shopping_list_items')
					.update({ name })
					.eq('id', id);
				if (result.error) {
					throw result.error;
				}
			} catch {
				toast.error('Failed to update shopping list');
			}
		}
		invalidate('supabase:shopping_list_items');
	};

	$: uncheckedItems = data.items.filter((item) => !item.checked);
	$: checkedItems = data.items.filter((item) => item.checked);
</script>

<PageHeader title="Shopping List" />

<form method="post" action="?/add" class="mb-6 flex w-full items-center gap-2" use:enhance>
	<Input class="w-full" name="item" placeholder="Add item to shopping list" autofocus />
	<Button type="submit" class="px-8">Add</Button>
</form>

<div class="space-y-4">
	{#if uncheckedItems.length > 0}
		<div class="space-y-1 rounded-lg border px-4 py-2">
			{#each uncheckedItems as item (item.id)}
				<ListItem
					bind:checked={item.checked}
					bind:name={item.name}
					onCheckedChange={(checked) => updateChecked(item.id, checked)}
					onNameChange={(name) => updateName(item.id, name)}
				/>
			{/each}
		</div>
	{/if}
	{#if checkedItems.length > 0}
		<div class="rounded-lg bg-muted">
			<div class="flex items-center justify-between py-2 pl-4 pr-2">
				<h4 class="text-lg font-medium tracking-tight">Checked Items</h4>
				<form method="post" class="contents" action="?/clearChecked" use:enhance>
					<Button type="submit" variant="ghost" class="hover:bg-white">Clear</Button>
				</form>
			</div>
			<div class="space-y-1 px-4 pb-2">
				{#each checkedItems as item (item.id)}
					<ListItem
						bind:checked={item.checked}
						bind:name={item.name}
						onCheckedChange={(checked) => updateChecked(item.id, checked)}
						onNameChange={(name) => updateName(item.id, name)}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
