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
		<CardTitle class="text-2xl">Login</CardTitle>
		<CardDescription>Enter your email below to login to your account</CardDescription>
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
					<!-- <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a> -->
				</div>
				<Input id="password" name="password" type="password" required />
			</div>
			<Button type="submit" class="w-full">Login</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/auth/register" class="underline">Sign up</a>
		</div>
	</CardContent>
</Card>
