<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import LogoutIcon from 'lucide-svelte/icons/log-out';

	export let title: string;
</script>

<div class="mb-8 flex flex-col items-center gap-4 border-b pb-4 sm:h-16 sm:flex-row sm:pb-0">
	<h1 class="text-3xl font-semibold tracking-tight transition-colors">{title}</h1>
	<form method="post" action="/?/logout" class="sm:ml-auto">
		{$page.data.user?.email}
		<Button type="submit" size="sm" variant="secondary" class="ml-4">
			Logout
			<LogoutIcon class="ml-2 h-4 w-4" />
		</Button>
	</form>
</div>
