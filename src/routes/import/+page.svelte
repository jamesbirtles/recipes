<script>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import CookingPotIcon from 'lucide-svelte/icons/cooking-pot';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Import Recipe</title>
</svelte:head>

<div class="mx-auto flex max-w-xl flex-col items-center">
	<Button variant="link" href="/" class="mb-6 self-start">
		<ArrowLeftIcon class="mr-2 h-4 w-4" />
		Back
	</Button>

	<CookingPotIcon class="mb-4 h-16 w-16" />

	<h1 class="mb-10 scroll-m-20 text-2xl font-semibold tracking-tight">Import Recipe</h1>

	<form method="post" class="contents" use:enhance>
		<div class="flex w-full flex-col gap-1.5">
			<!-- <Label for="email-2">Email</Label> -->
			<Input type="url" id="url" placeholder="Recipe URL" />
			<p class="ml-3.5 text-xs text-muted-foreground">
				Enter the URL of the recipe you would like to import.
			</p>
		</div>

		<Button class="mt-12 w-full">Import</Button>
	</form>
</div>
