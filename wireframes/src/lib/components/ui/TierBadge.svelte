<script lang="ts">
	import type { WorkloadTier } from '$lib/utils';
	import { getWorkloadTier } from '$lib/utils';

	interface Props {
		hours?: number;
		tier?: WorkloadTier;
	}

	let { hours, tier }: Props = $props();

	let resolved = $derived<WorkloadTier>(tier ?? getWorkloadTier(hours ?? 0));

	const config: Record<WorkloadTier, { label: string; cls: string }> = {
		OK: {
			label: 'OK',
			cls: 'bg-[var(--color-tier-ok-bg)] text-[var(--color-tier-ok-fg)] border-[var(--color-tier-ok-border)]'
		},
		WARNING: {
			label: 'Warning',
			cls: 'bg-[var(--color-tier-warn-bg)] text-[var(--color-tier-warn-fg)] border-[var(--color-tier-warn-border)]'
		},
		OVERWORKED: {
			label: 'Overworked',
			cls: 'bg-[var(--color-tier-over-bg)] text-[var(--color-tier-over-fg)] border-[var(--color-tier-over-border)]'
		}
	};
</script>

<span
	class="inline-flex items-center rounded border px-2.5 py-1 text-xs font-semibold leading-none select-none {config[
		resolved
	].cls}"
>
	{config[resolved].label}
</span>
