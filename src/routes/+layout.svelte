<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Toaster />

<div class="mx-auto max-w-screen-xl p-6">
	<slot></slot>
</div>
