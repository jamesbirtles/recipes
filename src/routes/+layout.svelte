<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster />

<div class="mx-auto max-w-screen-2xl p-6">
	<slot></slot>
</div>
