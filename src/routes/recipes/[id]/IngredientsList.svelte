<script lang="ts">
	export let ingredients: readonly string[];
</script>

<h3 class="scroll-m-20 text-xl font-semibold tracking-tight">Ingredients</h3>

<ul class="ml-6 mt-6 list-disc space-y-1 text-gray-700">
	{#each ingredients as ingredient}
		<li>{ingredient}</li>
	{/each}
</ul>
