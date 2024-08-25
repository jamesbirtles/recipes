<script lang="ts">
	import Navigation from './Navigation.svelte';
</script>

<div class="grid h-full grid-rows-[1fr,auto]">
	<div>
		<slot />
	</div>
	<Navigation />
</div>
