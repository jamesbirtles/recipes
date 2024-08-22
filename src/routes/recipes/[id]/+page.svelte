<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Option } from 'effect';
	import RecipeSectionView from './RecipeSectionView.svelte';
	import ExternalLinkIcon from 'lucide-svelte/icons/external-link';
	import IngredientsList from './IngredientsList.svelte';
	import ImportIcon from 'lucide-svelte/icons/refresh-cw';
	import ChefHatIcon from 'lucide-svelte/icons/chef-hat';
	import type { ActionResult } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { twMerge } from 'tailwind-merge';
	import BackButton from '$lib/components/BackButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ recipe, supabase } = data);

	let reimporting = false;

	const friendlyURL = (urlString: string) => {
		const url = new URL(urlString);
		return url.host + url.pathname;
	};

	const onResult = (result: ActionResult) => {
		if (result.type === 'failure') {
			toast.error((result.data?.message as string | undefined) ?? 'Something went wrong');
		} else if (result.type === 'success') {
			console.log(result.data);
			toast.success('Recipe successfully updated!');
		}
	};
</script>

<svelte:head>
	<title>{recipe.title}</title>
</svelte:head>

<div class="mx-auto max-w-screen-xl p-6">
	<BackButton href="/" />

	<div class="grid gap-8 sm:grid-cols-[16rem,1fr] md:grid-cols-[20rem,1fr]">
		{#if Option.isSome(recipe.image)}
			<img
				src={supabase.storage.from('recipe-images').getPublicUrl(recipe.image.value).data.publicUrl}
				width={320}
				height={320}
				alt=""
				class="aspect-video w-full rounded-lg object-cover shadow sm:aspect-square"
				style:view-transition-name="recipe-image-{recipe.id}"
			/>
		{/if}

		<div class="flex flex-col gap-2">
			<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
				{recipe.title}
			</h3>
			<div class="flex items-center gap-2">
				<ExternalLinkIcon class="h-3.5 w-3.5 shrink-0" />
				<a
					href={recipe.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-primary underline"
				>
					{friendlyURL(recipe.url)}
				</a>
			</div>
			<div class="mt-6 space-x-1">
				<form
					method="post"
					class="contents"
					action="?/reimport"
					use:enhance={() => {
						reimporting = true;
						return ({ result, update }) => {
							update().then(() => {
								reimporting = false;
								onResult(result);
							});
						};
					}}
				>
					<Button type="submit" variant="outline">
						<ImportIcon class={twMerge('mr-4 h-4 w-4', reimporting && 'animate-spin')} /> Sync Latest
					</Button>
				</form>
				<Button href="/recipes/{recipe.id}/follow">
					<ChefHatIcon class="mr-4 h-4 w-4" /> Follow Method
				</Button>
			</div>
		</div>

		<div>
			<IngredientsList ingredients={recipe.ingredients} />
		</div>
		<div>
			{#if Option.isSome(recipe.instructions)}
				{#each recipe.instructions.value as section}
					<RecipeSectionView {section} />
				{/each}
			{:else}
				<p class="italic">
					We couldn't find any method for this recipe. You might be able to view them manually on
					the <a
						class="text-primary underline"
						target="_blank"
						rel="noopener noreferrer"
						href={recipe.url}>original URL</a
					>.
				</p>
			{/if}
		</div>
	</div>

	<!-- <pre class="mt-16">{JSON.stringify(recipe, null, 2)}</pre> -->
</div>
