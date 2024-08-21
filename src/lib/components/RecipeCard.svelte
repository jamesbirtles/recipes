<script lang="ts">
	import type { Recipe } from '$lib/Recipe';
	import { supabase } from '$lib/supbaseClient';
	import { Option } from 'effect';
	import { Card, CardHeader, CardTitle } from './ui/card';

	export let recipe: typeof Recipe.Type;
</script>

<a class="contents" href="/recipes/{recipe.id}">
	<Card class="overflow-clip">
		{#if Option.isSome(recipe.image)}
			<img
				src={supabase.storage.from('recipe-images').getPublicUrl(recipe.image.value).data.publicUrl}
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
