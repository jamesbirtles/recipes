<script lang="ts">
	import { page } from '$app/stores';
	import NavItem from './NavItem.svelte';
	import BookOpenText from 'lucide-svelte/icons/book-open-text';
	import ShoppingBasket from 'lucide-svelte/icons/shopping-basket';

	$: path = $page.url.pathname;
</script>

<div class="sticky bottom-0 flex border-t bg-white shadow-lg">
	<div class="mx-auto grid auto-cols-fr grid-flow-col gap-4 p-1.5 sm:p-4">
		<NavItem href="/" active={path === '/' || path.startsWith('/recipes')}>
			<BookOpenText />
			Recipes
		</NavItem>
		<NavItem href="/shopping" active={path.startsWith('/shopping')}>
			<ShoppingBasket />
			Shopping
		</NavItem>
	</div>
</div>
