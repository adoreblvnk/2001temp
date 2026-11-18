<script lang="ts">
	import { store } from '$lib/store.svelte';
	import { Download } from '@lucide/svelte';

	let periodBasis = $state<'weekly' | 'mtd'>('weekly');
	let multiplier = $derived(periodBasis === 'weekly' ? 1 : 2.5);

	let studioRows = $derived(
		store.studios.map((s) => {
			const w = store.getStudioWeeklyStats(s.studioId, 'W46');
			return {
				studio: s,
				booked: w.bookedHours * multiplier,
				maint: w.maintHours * multiplier,
				avail: w.availableHours * multiplier,
				pct: w.pct
			};
		})
	);

	let totals = $derived.by(() => {
		const booked = studioRows.reduce((a, r) => a + r.booked, 0);
		const maint = studioRows.reduce((a, r) => a + r.maint, 0);
		const avail = studioRows.reduce((a, r) => a + r.avail, 0);
		const pct = avail > 0 ? (booked / avail) * 100 : 0;
		return { booked, maint, avail, pct };
	});

	function exportPdf() {
		store.notifyToast(`Exported elapsed studio utilisation PDF report`);
		window.print();
	}
</script>

<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
	<h1 class="text-xl font-semibold tracking-tight">Studio Utilisation</h1>

	<div class="flex items-center gap-2.5">
		<div
			class="inline-flex rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-0.5"
		>
			<button
				type="button"
				onclick={() => (periodBasis = 'weekly')}
				class="rounded px-3 py-1 text-sm font-medium {periodBasis === 'weekly'
					? 'bg-white border border-[var(--color-border-default)]'
					: 'text-[var(--color-fg-muted)]'}"
			>
				Week 46 · 09–15 Nov
			</button>
			<button
				type="button"
				onclick={() => (periodBasis = 'mtd')}
				class="rounded px-3 py-1 text-sm font-medium {periodBasis === 'mtd'
					? 'bg-white border border-[var(--color-border-default)]'
					: 'text-[var(--color-fg-muted)]'}"
			>
				Month-to-Date · Elapsed
			</button>
		</div>

		<button
			type="button"
			onclick={exportPdf}
			class="inline-flex items-center gap-1.5 rounded border border-[var(--color-border-default)] bg-white px-3.5 py-1.5 text-sm font-medium hover:bg-[var(--color-canvas-subtle)]"
		>
			<Download class="h-4 w-4" />
			<span>Export PDF</span>
		</button>
	</div>
</div>

<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
	>
		<h2 class="text-sm font-semibold">Elapsed Confirmed vs Net Available Operating Hours</h2>
		<span class="font-mono text-sm font-semibold tabular-nums">
			Total: {totals.booked.toFixed(1)} / {totals.avail.toFixed(1)} h · {totals.pct.toFixed(1)}%
		</span>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-sm">
			<thead>
				<tr
					class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]"
				>
					<th class="px-4 py-2.5 font-medium">Studio</th>
					<th class="px-4 py-2.5 font-medium">Equipped Instruments</th>
					<th class="px-4 py-2.5 font-medium">Confirmed Elapsed</th>
					<th class="px-4 py-2.5 font-medium">Maintenance</th>
					<th class="px-4 py-2.5 font-medium">Net Available</th>
					<th class="px-4 py-2.5 font-medium">Occupancy</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each studioRows as row (row.studio.studioId)}
					<tr>
						<td class="px-4 py-3 font-medium">
							<span class="font-mono text-[var(--color-fg-muted)]">{row.studio.studioId}</span> ·
							{row.studio.name}
						</td>
						<td class="px-4 py-3 text-[var(--color-fg-muted)]">
							{row.studio.equippedInstruments.join(', ')}
						</td>
						<td class="px-4 py-3 font-mono tabular-nums">{row.booked.toFixed(1)} h</td>
						<td class="px-4 py-3 font-mono tabular-nums text-[var(--color-fg-muted)]">
							{row.maint > 0 ? `${row.maint.toFixed(1)} h` : '—'}
						</td>
						<td class="px-4 py-3 font-mono tabular-nums">{row.avail.toFixed(1)} h</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-3">
								<div class="h-2.5 w-32 overflow-hidden rounded-xs bg-[#eaeef2]">
									<div class="h-full bg-[#1f2328]" style="width: {row.pct}%"></div>
								</div>
								<span class="font-mono font-medium tabular-nums">{row.pct.toFixed(1)}%</span>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
