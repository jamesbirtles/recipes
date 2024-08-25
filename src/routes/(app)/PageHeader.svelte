<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import LogoutIcon from 'lucide-svelte/icons/log-out';

	export let title: string;
</script>

<div class="mb-8 flex h-16 items-center gap-4 border-b">
	<h1 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors">{title}</h1>
	<form method="post" action="/?/logout" class="ml-auto">
		{$page.data.user?.email}
		<Button type="submit" size="sm" variant="secondary" class="ml-4">
			Logout
			<LogoutIcon class="ml-2 h-4 w-4" />
		</Button>
	</form>
</div>
