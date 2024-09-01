import { onMount } from 'svelte';

export const keepScreenAwake = () =>
	onMount(() => {
		let wakeLock: WakeLockSentinel | null = null;
		navigator.wakeLock.request('screen').then(
			(lock) => {
				console.info('WakeLock aquired');
				wakeLock = lock;
			},
			(err) => {
				console.warn('failed to get wakelock', err);
			},
		);
		return () => {
			wakeLock?.release().then(() => {
				console.info('WakeLock released');
			});
			wakeLock = null;
		};
	});
