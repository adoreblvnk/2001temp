<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { store } from '$lib/store.svelte';

	onMount(() => {
		if (store.activeRole === 'Manager') goto('/manager', { replaceState: true });
		else if (store.activeRole === 'Teacher') goto('/teacher', { replaceState: true });
		else goto('/admin/accounts', { replaceState: true });
	});
</script>

<div class="py-12 text-center text-xs text-[var(--color-fg-muted)]">Loading workspace…</div>
