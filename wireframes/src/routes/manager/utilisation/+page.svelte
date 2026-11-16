<script lang="ts">
	import { store, DAYS } from '$lib/store.svelte';
	import { Download } from '@lucide/svelte';

	let periodBasis = $state<'weekly' | 'monthly'>('weekly');
	let multiplier = $derived(periodBasis === 'weekly' ? 1 : 4);

	let studioRows = $derived(
		store.studios.map((s) => {
			const w = store.getStudioWeeklyStats(s.studioId);
			return {
				studio: s,
				booked: w.bookedHours * multiplier,
				maint: w.maintHours * multiplier,
				avail: w.availableHours * multiplier,
				gross: 86.0 * multiplier,
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

	const bands = [
		{ label: '08:00–10:00', density: [0, 0, 0, 0, 0, 72, 65] },
		{ label: '10:00–12:00', density: [68, 62, 58, 64, 60, 88, 82] },
		{ label: '12:00–14:00', density: [45, 48, 52, 46, 50, 76, 70] },
		{ label: '14:00–16:00', density: [74, 78, 86, 80, 76, 92, 85] },
		{ label: '16:00–18:00', density: [85, 88, 94, 90, 86, 84, 78] },
		{ label: '18:00–21:00', density: [62, 66, 70, 68, 72, 54, 48] }
	];

	function exportCsv() {
		const header = 'Studio ID,Studio Name,Equipped Instruments,Booked Hours,Maintenance Hours,Available Hours,Utilisation %\n';
		const rows = studioRows
			.map(
				(r) =>
					`${r.studio.studioId},${r.studio.name},"${r.studio.equippedInstruments.join(' / ')}",${r.booked.toFixed(1)},${r.maint.toFixed(1)},${r.avail.toFixed(1)},${r.pct.toFixed(1)}%`
			)
			.join('\n');
		const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `studio-utilisation-${store.selectedWeekId}-${periodBasis}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		store.notifyToast(`Exported ${periodBasis} studio utilisation CSV`);
	}
</script>

<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
	<div class="flex items-center gap-2.5">
		<h1 class="text-lg font-semibold tracking-tight">Studio Utilisation</h1>
		<span class="font-mono text-xs text-[var(--color-fg-muted)]">
			86.0 h / studio / wk (Mon–Fri 09:00–21:00, Sat–Sun 08:00–21:00)
		</span>
	</div>

	<div class="flex items-center gap-2">
		<div
			class="inline-flex rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-0.5"
		>
			<button
				type="button"
				onclick={() => (periodBasis = 'weekly')}
				class="rounded px-2.5 py-1 text-xs font-medium {periodBasis === 'weekly'
					? 'bg-white border border-[var(--color-border-default)]'
					: 'text-[var(--color-fg-muted)]'}"
			>
				Weekly ({store.currentWeek.label})
			</button>
			<button
				type="button"
				onclick={() => (periodBasis = 'monthly')}
				class="rounded px-2.5 py-1 text-xs font-medium {periodBasis === 'monthly'
					? 'bg-white border border-[var(--color-border-default)]'
					: 'text-[var(--color-fg-muted)]'}"
			>
				Monthly (4 Weeks)
			</button>
		</div>

		<button
			type="button"
			onclick={exportCsv}
			class="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-canvas-subtle)]"
		>
			<Download class="h-3.5 w-3.5" />
			<span>Export CSV</span>
		</button>
	</div>
</div>

<!-- Studio Breakdown Table -->
<section class="mb-5 rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
	>
		<h2 class="text-xs font-semibold">Booked vs Available Operating Hours</h2>
		<span class="font-mono text-xs font-semibold tabular-nums">
			Total: {totals.booked.toFixed(1)} / {totals.avail.toFixed(1)} h ({totals.pct.toFixed(1)}%)
		</span>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]">
					<th class="px-4 py-2 font-medium">Studio</th>
					<th class="px-4 py-2 font-medium">Equipped Instruments</th>
					<th class="px-4 py-2 font-medium">Booked</th>
					<th class="px-4 py-2 font-medium">Maintenance</th>
					<th class="px-4 py-2 font-medium">Net Available</th>
					<th class="px-4 py-2 font-medium">Occupancy</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each studioRows as row (row.studio.studioId)}
					<tr>
						<td class="px-4 py-2.5 font-medium">
							<span class="font-mono text-[var(--color-fg-muted)]">{row.studio.studioId}</span> ·
							{row.studio.name}
						</td>
						<td class="px-4 py-2.5 text-[var(--color-fg-muted)]">
							{row.studio.equippedInstruments.join(', ')}
						</td>
						<td class="px-4 py-2.5 font-mono tabular-nums">{row.booked.toFixed(1)} h</td>
						<td class="px-4 py-2.5 font-mono tabular-nums text-[var(--color-fg-muted)]">
							{row.maint > 0 ? `${row.maint.toFixed(1)} h` : '—'}
						</td>
						<td class="px-4 py-2.5 font-mono tabular-nums">{row.avail.toFixed(1)} h</td>
						<td class="px-4 py-2.5">
							<div class="flex items-center gap-2.5">
								<div class="h-2 w-32 overflow-hidden rounded-full bg-[#eaeef2]">
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

<!-- Monochrome Time-Band Occupancy Matrix -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
	>
		<h2 class="text-xs font-semibold">Occupancy by Time Band (%)</h2>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-center text-xs">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]">
					<th class="px-3 py-2 text-left font-medium">Window</th>
					{#each DAYS as d (d)}
						<th class="px-3 py-2 font-medium">{d}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each bands as b (b.label)}
					<tr>
						<td class="px-3 py-2 text-left font-mono text-[11px] font-medium">{b.label}</td>
						{#each b.density as val, idx (idx)}
							{#if val === 0}
								<td class="hatch-closed px-3 py-2 font-mono text-[11px] text-[var(--color-fg-subtle)]">
									09:00 open
								</td>
							{:else}
								<td
									class="px-3 py-2 font-mono text-[11px] tabular-nums {val >= 85
										? 'bg-[#1f2328] text-white font-semibold'
										: val >= 70
											? 'bg-[#dde2e7] text-[var(--color-fg-default)] font-medium'
											: 'bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]'}"
								>
									{val}%
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
