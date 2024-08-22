<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<Card class="mx-auto my-12 max-w-sm">
	<CardHeader>
		<CardTitle class="text-2xl">Sign Up</CardTitle>
		<CardDescription>Enter your email below to sign up for any account</CardDescription>
	</CardHeader>
	<CardContent>
		<form method="post" class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" name="email" placeholder="m@example.com" required />
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Password</Label>
				</div>
				<Input id="password" name="password" type="password" required />
			</div>
			<Button type="submit" class="w-full">Sign Up</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="/auth" class="underline">Sign in</a>
		</div>
	</CardContent>
</Card>
