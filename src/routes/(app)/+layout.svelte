<script lang="ts">
	import Navigation from './Navigation.svelte';
</script>

<div class="grid h-full grid-rows-[1fr,auto]">
	<div class="mx-auto w-full max-w-screen-xl p-4 sm:p-6">
		<slot />
	</div>
	<Navigation />
</div>
