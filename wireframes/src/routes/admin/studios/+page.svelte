<script lang="ts">
	import { store, DAYS, ALL_SLOTS } from '$lib/store.svelte';
	import { MaintenanceWindowFormSchema, type DayCode, type Instrument } from '$lib/schemas';
	import { Wrench, Trash2 } from '@lucide/svelte';

	const ALL_INSTRUMENTS: Instrument[] = ['Piano', 'Drums', 'Violin', 'Trumpet'];

	let mStudioId = $state('S-04');
	let mWeekId = $state('W47');
	let mDay = $state<DayCode>('Thu');
	let mStart = $state('13:00');
	let mEnd = $state('15:00');
	let mReason = $state('Seasonal piano tuning');
	let mError = $state<string | null>(null);

	let conflictingLessons = $derived(
		store.lessons.filter(
			(l) =>
				l.studioId === mStudioId &&
				l.weekId === mWeekId &&
				l.day === mDay &&
				l.slot >= mStart &&
				l.slot < mEnd &&
				l.status !== 'Unassigned'
		)
	);

	function handleScheduleMaintenance() {
		mError = null;
		const parsed = MaintenanceWindowFormSchema.safeParse({
			studioId: mStudioId,
			weekId: mWeekId,
			day: mDay,
			startSlot: mStart,
			endSlot: mEnd,
			reason: mReason
		});
		if (!parsed.success) {
			mError = parsed.error.issues[0]?.message ?? 'Invalid maintenance window';
			return;
		}
		store.scheduleMaintenance(parsed.data);
	}
</script>

<div class="mb-4 flex items-center justify-between">
	<h1 class="text-xl font-semibold tracking-tight">Studios &amp; Maintenance</h1>
</div>

<div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
	<section class="lg:col-span-7 rounded-md border border-[var(--color-border-default)] bg-white">
		<div
			class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
		>
			<h2 class="text-sm font-semibold">Studio Equipment</h2>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full border-collapse text-left text-sm">
				<thead>
					<tr
						class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]"
					>
						<th class="px-4 py-2.5 font-medium">Studio</th>
						<th class="px-4 py-2.5 font-medium">Equipped Instruments</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[var(--color-border-muted)]">
					{#each store.studios as st (st.studioId)}
						<tr>
							<td class="whitespace-nowrap px-4 py-3 font-medium">
								<span class="font-mono text-[var(--color-fg-muted)]">{st.studioId}</span> ·
								{st.name}
							</td>
							<td class="px-4 py-3">
								<div class="flex flex-wrap gap-1.5">
									{#each ALL_INSTRUMENTS as inst (inst)}
										{@const equipped = st.equippedInstruments.includes(inst)}
										<button
											type="button"
											onclick={() => store.toggleStudioInstrument(st.studioId, inst)}
											class="rounded border px-3 py-1 text-sm font-medium transition-colors {equipped
												? 'border-[#1f2328] bg-[#1f2328] text-white'
												: 'border-[var(--color-border-default)] bg-white text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)]'}"
										>
											{inst}
										</button>
									{/each}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="lg:col-span-5 rounded-md border border-[var(--color-border-default)] bg-white">
		<div
			class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
		>
			<h2 class="text-sm font-semibold">Schedule Maintenance</h2>
		</div>

		<div class="space-y-3.5 p-4 text-sm">
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="mw-st" class="mb-1 block font-medium">Studio</label>
					<select
						id="mw-st"
						bind:value={mStudioId}
						class="w-full rounded border border-[var(--color-border-default)] bg-white px-3 py-1.5 font-mono"
					>
						{#each store.studios as st (st.studioId)}
							<option value={st.studioId}>{st.studioId} · {st.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="mw-wk" class="mb-1 block font-medium">Week</label>
					<select
						id="mw-wk"
						bind:value={mWeekId}
						class="w-full rounded border border-[var(--color-border-default)] bg-white px-3 py-1.5 font-mono"
					>
						{#each store.weeks as wk (wk.id)}
							<option value={wk.id}>{wk.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-2.5">
				<div>
					<label for="mw-day" class="mb-1 block font-medium">Day</label>
					<select
						id="mw-day"
						bind:value={mDay}
						class="w-full rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1.5"
					>
						{#each DAYS as d (d)}
							<option value={d}>{d}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="mw-start" class="mb-1 block font-medium">Start</label>
					<select
						id="mw-start"
						bind:value={mStart}
						class="w-full rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 font-mono"
					>
						{#each ALL_SLOTS as s (s)}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="mw-end" class="mb-1 block font-medium">End</label>
					<select
						id="mw-end"
						bind:value={mEnd}
						class="w-full rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 font-mono"
					>
						{#each ALL_SLOTS as s (s)}
							<option value={s}>{s}</option>
						{/each}
						<option value="21:00">21:00</option>
					</select>
				</div>
			</div>

			<div>
				<label for="mw-reason" class="mb-1 block font-medium">Reason</label>
				<input
					id="mw-reason"
					type="text"
					bind:value={mReason}
					class="w-full rounded border border-[var(--color-border-default)] px-3 py-1.5"
				/>
			</div>

			{#if conflictingLessons.length > 0}
				<div
					class="rounded border border-[var(--color-tier-warn-border)] bg-[var(--color-tier-warn-bg)] px-3 py-2 text-[var(--color-tier-warn-fg)]"
				>
					{conflictingLessons.length} confirmed lesson(s) fall in this window and will return to Unassigned.
				</div>
			{/if}

			{#if mError}
				<p class="text-[var(--color-tier-over-fg)]">{mError}</p>
			{/if}

			<button
				type="button"
				onclick={handleScheduleMaintenance}
				class="inline-flex w-full items-center justify-center gap-2 rounded bg-[#1f2328] px-3.5 py-2 font-medium text-white hover:bg-[#32383f]"
			>
				<Wrench class="h-4 w-4" />
				<span>Schedule Maintenance</span>
			</button>
		</div>
	</section>
</div>

<section class="mt-5 rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
	>
		<h2 class="text-sm font-semibold">Scheduled Maintenance Windows</h2>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-sm">
			<thead>
				<tr
					class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]"
				>
					<th class="px-4 py-2.5 font-medium">ID</th>
					<th class="px-4 py-2.5 font-medium">Studio</th>
					<th class="px-4 py-2.5 font-medium">Window</th>
					<th class="px-4 py-2.5 font-medium">Reason</th>
					<th class="px-4 py-2.5 text-right font-medium">Action</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each store.maintenanceWindows as mw (mw.id)}
					<tr>
						<td class="px-4 py-3 font-mono font-semibold">{mw.id}</td>
						<td class="px-4 py-3 font-mono font-medium">{mw.studioId}</td>
						<td class="px-4 py-3 font-mono tabular-nums">
							{mw.weekId} · {mw.day} {mw.startSlot}–{mw.endSlot}
						</td>
						<td class="px-4 py-3 text-[var(--color-fg-muted)]">{mw.reason}</td>
						<td class="px-4 py-3 text-right">
							<button
								type="button"
								onclick={() => store.removeMaintenance(mw.id)}
								class="inline-flex items-center gap-1 rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1 text-xs font-medium hover:bg-[var(--color-canvas-subtle)]"
							>
								<Trash2 class="h-3.5 w-3.5" />
								<span>Clear</span>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
