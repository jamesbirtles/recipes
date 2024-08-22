<script lang="ts">
	import type { Recipe } from '$lib/Recipe';
	import { Option } from 'effect';
	import { Card, CardHeader, CardTitle } from './ui/card';
	import { page } from '$app/stores';

	export let recipe: typeof Recipe.Type;
</script>

<a class="contents" href="/recipes/{recipe.id}?return">
	<Card class="overflow-clip">
		{#if Option.isSome(recipe.image)}
			<img
				src={$page.data.supabase.storage.from('recipe-images').getPublicUrl(recipe.image.value).data
					.publicUrl}
				alt=""
				width="400"
				height="400"
				class="aspect-video w-full rounded-t-lg object-cover sm:aspect-square"
				style:view-transition-name="recipe-image-{recipe.id}"
			/>
		{/if}
		<CardHeader>
			<CardTitle>
				{recipe.title}
			</CardTitle>
		</CardHeader>
	</Card>
</a>
