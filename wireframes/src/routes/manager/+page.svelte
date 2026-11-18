<script lang="ts">
	import { goto } from '$app/navigation';
	import { store } from '$lib/store.svelte';
	import { getWorkloadTier } from '$lib/utils';
	import TierBadge from '$lib/components/ui/TierBadge.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { Bell, ChevronLeft, ChevronRight, ArrowRight, Eye } from '@lucide/svelte';

	let inspectTeacherId = $state<string | null>(null);

	let inspectedTeacher = $derived(
		inspectTeacherId ? store.accounts.find((a) => a.staffId === inspectTeacherId) ?? null : null
	);

	let inspectedLessons = $derived(
		inspectTeacherId
			? store.lessons.filter(
					(l) => l.weekId === store.selectedWeekId && l.teacherId === inspectTeacherId
				)
			: []
	);

	let unassignedCount = $derived(
		store.lessons.filter((l) => l.weekId === store.selectedWeekId && l.status === 'Unassigned')
			.length
	);

	let rejectionCount = $derived(
		store.lessons.filter(
			(l) => l.weekId === store.selectedWeekId && l.status === 'RejectionPending'
		).length
	);

	let studioAggregate = $derived.by(() => {
		const stats = store.studios.map((s) => store.getStudioWeeklyStats(s.studioId));
		const booked = stats.reduce((acc, s) => acc + s.bookedHours, 0);
		const avail = stats.reduce((acc, s) => acc + s.availableHours, 0);
		return { booked, avail, pct: avail > 0 ? (booked / avail) * 100 : 0 };
	});

	let sortedFaculty = $derived(
		[...store.activeTeachers]
			.map((t) => {
				const weekly = store.getTeacherWeeklyHours(t.staffId);
				const monthly = store.getTeacherMonthlyHours(t.staffId);
				return {
					teacher: t,
					weekly,
					monthly,
					tier: getWorkloadTier(weekly),
					studioToday: store.getTeacherAssignedStudio(t.staffId)
				};
			})
			.sort((a, b) => b.weekly - a.weekly)
	);

	function stepWeek(delta: number) {
		const idx = store.weeks.findIndex((w) => w.id === store.selectedWeekId);
		const next = store.weeks[idx + delta];
		if (next) store.selectedWeekId = next.id;
	}
</script>

<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
	<h1 class="text-xl font-semibold tracking-tight">Staff Workload</h1>

	<div class="flex flex-wrap items-center gap-2.5">
		<div
			class="inline-flex max-w-full items-center rounded border border-[var(--color-border-default)] bg-white"
		>
			<button
				type="button"
				onclick={() => stepWeek(-1)}
				disabled={store.selectedWeekId === store.weeks[0].id}
				aria-label="Previous week"
				class="px-2.5 py-1.5 text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] disabled:opacity-40"
			>
				<ChevronLeft class="h-4 w-4" />
			</button>
			<select
				aria-label="Target calendar week"
				bind:value={store.selectedWeekId}
				class="min-w-0 max-w-[230px] sm:max-w-none border-x border-[var(--color-border-default)] bg-white px-3 py-1.5 text-sm font-medium tabular-nums focus:outline-none"
			>
				{#each store.weeks as wk (wk.id)}
					<option value={wk.id}>{wk.label} · {wk.rangeText}</option>
				{/each}
			</select>
			<button
				type="button"
				onclick={() => stepWeek(1)}
				disabled={store.selectedWeekId === store.weeks[store.weeks.length - 1].id}
				aria-label="Next week"
				class="px-2.5 py-1.5 text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] disabled:opacity-40"
			>
				<ChevronRight class="h-4 w-4" />
			</button>
		</div>

		<button
			type="button"
			onclick={() => store.confirmWeekAndNotify()}
			class="inline-flex items-center gap-2 rounded bg-[#1f2328] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#32383f]"
		>
			<Bell class="h-4 w-4" />
			<span>Confirm &amp; Notify Teachers</span>
		</button>
	</div>
</div>

<!-- KPI Strip -->
<div
	class="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-border-default)] sm:grid-cols-4"
>
	<div class="bg-white px-4 py-3.5">
		<div class="text-sm text-[var(--color-fg-muted)]">Active Teachers</div>
		<div class="mt-1 font-mono text-2xl font-semibold tabular-nums">
			{store.activeTeachers.length}
		</div>
	</div>
	<button
		type="button"
		onclick={() => goto('/manager/allocate')}
		class="bg-white px-4 py-3.5 text-left hover:bg-[var(--color-canvas-subtle)]"
	>
		<div class="flex items-center justify-between text-sm text-[var(--color-fg-muted)]">
			<span>Unassigned Slots</span>
			<ArrowRight class="h-4 w-4" />
		</div>
		<div class="mt-1 font-mono text-2xl font-semibold tabular-nums">{unassignedCount}</div>
	</button>
	<button
		type="button"
		onclick={() => goto('/manager/allocate?filter=rejected')}
		class="bg-white px-4 py-3.5 text-left hover:bg-[var(--color-canvas-subtle)]"
	>
		<div class="flex items-center justify-between text-sm text-[var(--color-fg-muted)]">
			<span>Pending Rejections</span>
			<ArrowRight class="h-4 w-4" />
		</div>
		<div class="mt-1 font-mono text-2xl font-semibold tabular-nums">{rejectionCount}</div>
	</button>
	<button
		type="button"
		onclick={() => goto('/manager/utilisation')}
		class="bg-white px-4 py-3.5 text-left hover:bg-[var(--color-canvas-subtle)]"
	>
		<div class="flex items-center justify-between text-sm text-[var(--color-fg-muted)]">
			<span>Studio Utilisation</span>
			<ArrowRight class="h-4 w-4" />
		</div>
		<div class="mt-1 font-mono text-2xl font-semibold tabular-nums">
			{studioAggregate.pct.toFixed(1)}%
		</div>
	</button>
</div>

<!-- FR-02: Top 3 Lowest Allocated Weekly Hours -->
<section class="mb-5 rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
	>
		<h2 class="text-sm font-semibold text-[var(--color-fg-default)]">
			Lowest Allocated Weekly Hours (Top 3)
		</h2>
		<a
			href="/manager/allocate"
			class="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-fg-default)] hover:underline"
		>
			<span>Open Allocation Matrix</span>
			<ArrowRight class="h-3.5 w-3.5" />
		</a>
	</div>
	<div
		class="grid grid-cols-1 divide-y divide-[var(--color-border-default)] md:grid-cols-3 md:divide-x md:divide-y-0"
	>
		{#each store.lowestThreeTeachers as item, i (item.teacher.staffId)}
			<div class="flex items-center justify-between gap-3 px-4 py-3.5">
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<span
							class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] font-mono text-xs font-semibold"
						>
							{i + 1}
						</span>
						<span class="truncate text-base font-semibold">{item.teacher.fullName}</span>
					</div>
					<div class="mt-1 font-mono text-sm text-[var(--color-fg-muted)] tabular-nums">
						{item.teacher.staffId} · {item.weeklyHours.toFixed(1)} h / wk
					</div>
				</div>
				<button
					type="button"
					onclick={() => goto(`/manager/allocate?teacher=${item.teacher.staffId}`)}
					class="shrink-0 rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 text-sm font-medium hover:bg-[#eaeef2]"
				>
					Assign
				</button>
			</div>
		{/each}
	</div>
</section>

<!-- FR-01 & FR-16: Faculty Allocation Ledger -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
	>
		<h2 class="text-sm font-semibold">Faculty Allocation Ledger</h2>
		<span class="font-mono text-xs text-[var(--color-fg-muted)]">
			&lt;40.0h OK · 40.0–44.0h Warning · &gt;44.0h Overworked
		</span>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-sm">
			<thead>
				<tr
					class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]"
				>
					<th class="px-4 py-2.5 font-medium">Teacher</th>
					<th class="px-4 py-2.5 font-medium">Instruments</th>
					<th class="px-4 py-2.5 font-medium">Studio</th>
					<th class="px-4 py-2.5 font-medium">Weekly Hours</th>
					<th class="px-4 py-2.5 font-medium">Monthly</th>
					<th class="px-4 py-2.5 font-medium">Status</th>
					<th class="px-4 py-2.5 text-right font-medium">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each sortedFaculty as row (row.teacher.staffId)}
					{@const barPct = Math.min(100, (row.weekly / 44) * 100)}
					<tr class="hover:bg-[var(--color-canvas-subtle)]/60">
						<td class="px-4 py-3">
							<span class="font-semibold text-[var(--color-fg-default)]"
								>{row.teacher.fullName}</span
							>
							<span class="ml-1 font-mono text-xs text-[var(--color-fg-muted)]">
								({row.teacher.staffId})
							</span>
						</td>
						<td class="px-4 py-3 text-[var(--color-fg-muted)]">
							{row.teacher.instruments.join(', ')}
						</td>
						<td class="px-4 py-3">
							<span
								class="rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2 py-0.5 font-mono text-xs font-medium"
							>
								{row.studioToday}
							</span>
						</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-3">
								<div class="h-2 w-24 overflow-hidden rounded-xs bg-[#eaeef2]">
									<div
										class="h-full {row.tier === 'OVERWORKED'
											? 'bg-[var(--color-tier-over-fg)]'
											: row.tier === 'WARNING'
												? 'bg-[var(--color-tier-warn-fg)]'
												: 'bg-[var(--color-tier-ok-fg)]'}"
										style="width: {barPct}%"
									></div>
								</div>
								<span class="font-mono font-medium tabular-nums">
									{row.weekly.toFixed(1)} / 44.0 h
								</span>
							</div>
						</td>
						<td class="px-4 py-3 font-mono tabular-nums text-[var(--color-fg-default)]">
							{row.monthly.toFixed(1)} h
						</td>
						<td class="px-4 py-3">
							<TierBadge hours={row.weekly} />
						</td>
						<td class="px-4 py-3 text-right">
							<div class="inline-flex items-center gap-1.5">
								{#if row.tier === 'OVERWORKED'}
									<button
										type="button"
										onclick={() => store.unassignLessonForReallocation('L-601')}
										class="rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1 text-xs font-medium hover:bg-[var(--color-canvas-subtle)]"
									>
										Release 0.5h Slot
									</button>
								{/if}
								<button
									type="button"
									onclick={() => (inspectTeacherId = row.teacher.staffId)}
									class="inline-flex items-center gap-1 rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
								>
									<Eye class="h-3.5 w-3.5" />
									<span>View</span>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<Dialog
	open={inspectedTeacher !== null}
	title={inspectedTeacher ? `${inspectedTeacher.fullName} (${inspectedTeacher.staffId})` : ''}
	onClose={() => (inspectTeacherId = null)}
>
	{#if inspectedTeacher}
		<div class="space-y-3">
			<div
				class="grid grid-cols-3 gap-2 rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3 text-sm"
			>
				<div>
					<div class="text-xs text-[var(--color-fg-muted)]">Weekly</div>
					<div class="mt-0.5 font-mono font-semibold tabular-nums">
						{store.getTeacherWeeklyHours(inspectedTeacher.staffId).toFixed(1)} h
					</div>
				</div>
				<div>
					<div class="text-xs text-[var(--color-fg-muted)]">Monthly</div>
					<div class="mt-0.5 font-mono font-semibold tabular-nums">
						{store.getTeacherMonthlyHours(inspectedTeacher.staffId).toFixed(1)} h
					</div>
				</div>
				<div>
					<div class="text-xs text-[var(--color-fg-muted)]">Preferences</div>
					<div class="mt-0.5 font-medium">
						{inspectedTeacher.preferredDays.join(', ')} · {inspectedTeacher.preferredStudio}
					</div>
				</div>
			</div>

			{#if inspectedLessons.length > 0}
				<div
					class="max-h-56 overflow-y-auto rounded border border-[var(--color-border-default)] divide-y divide-[var(--color-border-muted)] text-sm"
				>
					{#each inspectedLessons as sl (sl.lessonId)}
						<div class="flex items-center justify-between px-3 py-2">
							<span>
								<strong class="font-mono">{sl.day} {sl.slot}</strong> · {sl.studentName} ({sl.instrument})
							</span>
							<span class="font-mono text-xs text-[var(--color-fg-muted)]">{sl.studioId}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</Dialog>
