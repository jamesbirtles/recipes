<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Pagination,
		PaginationContent,
		PaginationItem,
		PaginationPrevButton,
		PaginationEllipsis,
		PaginationLink,
		PaginationNextButton,
	} from '$lib/components/ui/pagination';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import ImportIcon from 'lucide-svelte/icons/import';
	import LogoutIcon from 'lucide-svelte/icons/log-out';

	export let data;
</script>

<svelte:head>
	<title>Recipes</title>
</svelte:head>

<div class="mx-auto max-w-screen-xl p-6">
	<div class="mb-8 flex h-16 items-center gap-4 border-b">
		<h1 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors">
			Saved Recipes
		</h1>
		<form method="post" action="?/logout" class="ml-auto">
			{data.user?.email}
			<Button type="submit" size="sm" variant="secondary" class="ml-4">
				Logout
				<LogoutIcon class="ml-2 h-4 w-4" />
			</Button>
		</form>
	</div>

	<form method="get" class="mb-6">
		<Input
			type="search"
			id="query"
			name="query"
			value={data.query}
			placeholder="Search your recipes…"
		/>
	</form>

	{#if data.query}
		<h2 class="mb-4 text-xl text-muted-foreground">Showing results for '{data.query}':</h2>
	{/if}

	<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
		{#each data.recipes as recipe (recipe.id)}
			<RecipeCard {recipe} />
		{/each}
	</div>

	{#if data.count > data.pageSize}
		<Pagination
			class="mt-8"
			count={data.count}
			perPage={data.pageSize}
			page={data.page + 1}
			onPageChange={(newPage) => {
				const url = new URL($page.url);
				url.searchParams.set('page', (newPage - 1).toString());
				goto(url, { replaceState: true });
			}}
			let:pages
			let:currentPage
		>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevButton>
						<ChevronLeft class="h-4 w-4" />
						<span class="hidden sm:block">Previous</span>
					</PaginationPrevButton>
				</PaginationItem>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					{:else}
						<PaginationItem>
							<PaginationLink {page} isActive={currentPage === page.value}>
								{page.value}
							</PaginationLink>
						</PaginationItem>
					{/if}
				{/each}
				<PaginationItem>
					<PaginationNextButton>
						<span class="hidden sm:block">Next</span>
						<ChevronRight class="h-4 w-4" />
					</PaginationNextButton>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	{/if}

	{#if !data.query}
		<div class="mt-8 flex items-center justify-center">
			<Button href="/import?return" class="[view-transition-name:import-button]">
				<span class="flex items-center [view-transition-name:import-button-text]">
					<ImportIcon class="mr-4 h-4 w-4" /> Import Recipe
				</span>
			</Button>
		</div>
	{/if}

	<!-- <pre class="mt-48">{JSON.stringify(data.user, null, 2)}</pre> -->
</div>
