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
			invalidate('supabase:shopping_list_items');
		}
	};

	let input: Input;

	$: uncheckedItems = data.items.filter((item) => !item.checked);
	$: checkedItems = data.items.filter((item) => item.checked);
	let optimisticItems: { id: string; name: string }[] = [];
</script>

<svelte:head>
	<title>Shopping List</title>
</svelte:head>

<PageHeader title="Shopping List" />

<form
	method="post"
	action="?/add"
	class="mb-6 flex w-full items-center gap-2"
	use:enhance={({ formData, formElement }) => {
		const name = formData.get('item');
		if (typeof name === 'string') {
			const id = crypto.randomUUID();
			optimisticItems.push({ id, name });
			optimisticItems = optimisticItems;
			formElement.reset();
			return ({ update }) =>
				update().finally(() => {
					input.focus();
					const index = optimisticItems.findIndex((item) => item.id === id);
					if (index !== -1) {
						optimisticItems.splice(index, 1);
						optimisticItems = optimisticItems;
					}
				});
		}
	}}
>
	<Input bind:this={input} class="w-full" name="item" placeholder="Add item to shopping list" />
	<Button type="submit" class="px-8">Add</Button>
</form>

<div class="space-y-4">
	{#if uncheckedItems.length > 0}
		<div class="rounded-lg border px-4 py-2">
			{#each uncheckedItems as item (item.id)}
				<ListItem
					bind:checked={item.checked}
					bind:name={item.name}
					onCheckedChange={(checked) => updateChecked(item.id, checked)}
					quantity={item.quantity}
					unit={item.unit}
				/>
			{/each}
			{#each optimisticItems as item (item.id)}
				<ListItem name={item.name} />
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
			<div class="px-4 pb-2">
				{#each checkedItems as item (item.id)}
					<ListItem
						bind:checked={item.checked}
						bind:name={item.name}
						onCheckedChange={(checked) => updateChecked(item.id, checked)}
						quantity={item.quantity}
						unit={item.unit}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
