<script lang="ts">
	import type { WorkloadTier } from '$lib/utils';
	import { getWorkloadTier } from '$lib/utils';

	interface Props {
		hours?: number;
		tier?: WorkloadTier;
		compact?: boolean;
	}

	let { hours, tier, compact = false }: Props = $props();

	let resolved = $derived<WorkloadTier>(tier ?? getWorkloadTier(hours ?? 0));

	const config: Record<WorkloadTier, { label: string; cls: string; dot: string }> = {
		OK: {
			label: 'OK',
			cls: 'bg-[var(--color-tier-ok-bg)] text-[var(--color-tier-ok-fg)] border-[var(--color-tier-ok-border)]',
			dot: 'bg-[var(--color-tier-ok-fg)]'
		},
		WARNING: {
			label: 'Warning',
			cls: 'bg-[var(--color-tier-warn-bg)] text-[var(--color-tier-warn-fg)] border-[var(--color-tier-warn-border)]',
			dot: 'bg-[var(--color-tier-warn-fg)]'
		},
		OVERWORKED: {
			label: 'Overworked',
			cls: 'bg-[var(--color-tier-over-bg)] text-[var(--color-tier-over-fg)] border-[var(--color-tier-over-border)]',
			dot: 'bg-[var(--color-tier-over-fg)]'
		}
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border font-medium leading-none select-none {compact
		? 'px-2 py-0.5 text-[11px]'
		: 'px-2.5 py-1 text-xs'} {config[resolved].cls}"
>
	<span class="h-1.5 w-1.5 rounded-full {config[resolved].dot}"></span>
	<span>{config[resolved].label}</span>
</span>
