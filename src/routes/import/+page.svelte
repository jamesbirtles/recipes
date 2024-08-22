<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import CookingPotIcon from 'lucide-svelte/icons/cooking-pot';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { ActionResult } from '@sveltejs/kit';
	import BackButton from '$lib/components/BackButton.svelte';

	const onResult = (result: ActionResult) => {
		if (result.type === 'failure') {
			toast.error((result.data?.message as string | undefined) ?? 'Something went wrong');
		} else if (result.type === 'success') {
			console.log(result.data);
			toast.success('Recipe successfully imported!');
		}
	};

	let importing = false;
</script>

<svelte:head>
	<title>Import Recipe</title>
</svelte:head>

<div class="mx-auto flex max-w-xl flex-col items-center p-6">
	<BackButton href="/" />

	<CookingPotIcon class="mb-4 h-16 w-16" />

	<h1 class="mb-10 scroll-m-20 text-2xl font-semibold tracking-tight">Import Recipe</h1>

	<form
		method="post"
		class="contents"
		use:enhance={() => {
			importing = true;
			return ({ result, update }) => {
				importing = false;
				onResult(result);
				update();
			};
		}}
	>
		<div class="flex w-full flex-col gap-1.5">
			<Input type="url" id="url" name="url" placeholder="Recipe URL" required />
			<p class="ml-3.5 text-xs text-muted-foreground">
				Enter the URL of the recipe you would like to import.
			</p>
		</div>

		<Button
			type="submit"
			class="relative mt-12 w-full [view-transition-name:import-button]"
			disabled={importing}
		>
			<div class="flex items-center [view-transition-name:import-button-text]">
				{#if importing}<LoaderCircle class="absolute left-4 h-4 w-4 animate-spin" />{/if}
				Import
			</div>
		</Button>
	</form>
</div>
