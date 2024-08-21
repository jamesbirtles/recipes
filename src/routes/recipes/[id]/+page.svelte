<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { decodeRecipe } from '$lib/Recipe';
	import { supabase } from '$lib/supbaseClient.js';
	import { Option } from 'effect';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';

	export let data;

	$: recipe = decodeRecipe(data.recipe);
</script>

<svelte:head>
	<title>{recipe.title}</title>
</svelte:head>

<Button variant="link" href="/" class="mb-6 self-start">
	<ArrowLeftIcon class="mr-2 h-4 w-4" />
	Back
</Button>

{#if Option.isSome(recipe.image)}
	<img
		src={supabase.storage.from('recipe-images').getPublicUrl(recipe.image.value).data.publicUrl}
		width={400}
		height={400}
		alt=""
		class="mb-8 h-96 w-96 rounded-lg object-cover shadow"
		style:view-transition-name="recipe-image-{recipe.id}"
	/>
{/if}

<h1
	class="mb-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
>
	{recipe.title}
</h1>

<pre>{JSON.stringify(recipe, null, 2)}</pre>
