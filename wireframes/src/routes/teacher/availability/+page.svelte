<script lang="ts">
	import { store, DAYS, ALL_SLOTS, isOperatingSlot } from '$lib/store.svelte';
	import { AvailabilitySubmissionSchema, type DayCode } from '$lib/schemas';
	import { Save, Clock } from '@lucide/svelte';

	let teacher = $derived(store.currentActor);

	let preferredDays = $state<DayCode[]>(['Mon', 'Tue', 'Thu', 'Sat']);
	let preferredStudio = $state<string>('S-01');
	let validationError = $state<string | null>(null);

	$effect(() => {
		preferredDays = [...teacher.preferredDays];
		preferredStudio = teacher.preferredStudio;
	});

	let weeklySelectedSlots = $derived(
		Object.entries(store.teacherDecGrid).filter(([key, on]) => {
			if (!on) return false;
			const [d, s] = key.split('@') as [DayCode, string];
			return isOperatingSlot(d, s);
		}).length
	);

	// 4 weeks in target calendar month (30-min slots = 0.5h each)
	let declaredMonthlyHours = $derived(weeklySelectedSlots * 0.5 * 4);
	let meetsFloor = $derived(declaredMonthlyHours >= 60.0);

	function toggleCell(day: DayCode, slot: string) {
		if (!isOperatingSlot(day, slot)) return;
		const key = `${day}@${slot}`;
		store.teacherDecGrid[key] = !store.teacherDecGrid[key];
	}

	function toggleDayColumn(day: DayCode) {
		const opSlots = ALL_SLOTS.filter((s) => isOperatingSlot(day, s));
		const allOn = opSlots.every((s) => store.teacherDecGrid[`${day}@${s}`]);
		for (const s of opSlots) {
			store.teacherDecGrid[`${day}@${s}`] = !allOn;
		}
	}

	function togglePreferredDay(day: DayCode) {
		preferredDays = preferredDays.includes(day)
			? preferredDays.filter((d) => d !== day)
			: [...preferredDays, day];
	}

	function handleSave() {
		validationError = null;
		const parsed = AvailabilitySubmissionSchema.safeParse({
			declaredHours: declaredMonthlyHours,
			preferredDays,
			preferredStudio
		});
		if (!parsed.success) {
			validationError = parsed.error.issues[0]?.message ?? 'Invalid submission';
			return;
		}
		store.saveTeacherAvailability(
			teacher.staffId,
			parsed.data.declaredHours,
			parsed.data.preferredDays,
			parsed.data.preferredStudio
		);
	}
</script>

<!-- Header -->
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div class="flex flex-wrap items-center gap-2.5">
		<h1 class="text-lg font-semibold tracking-tight">December 2026 Availability &amp; Preferences</h1>
		<span
			class="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)]"
		>
			<Clock class="h-3 w-3" />
			<span>Cutoff: 19 Nov 23:59</span>
		</span>
	</div>

	<div class="flex items-center gap-2.5">
		<span
			class="rounded-full border px-2.5 py-1 font-mono text-xs font-medium tabular-nums {meetsFloor
				? 'border-[var(--color-tier-ok-border)] bg-[var(--color-tier-ok-bg)] text-[var(--color-tier-ok-fg)]'
				: 'border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)] text-[var(--color-tier-over-fg)]'}"
		>
			{declaredMonthlyHours.toFixed(1)} / 60.0 h min
		</span>

		<button
			type="button"
			onclick={handleSave}
			class="inline-flex items-center gap-1.5 rounded-md bg-[#1f2328] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#32383f]"
		>
			<Save class="h-3.5 w-3.5" />
			<span>Save Declaration</span>
		</button>
	</div>
</div>

{#if validationError}
	<div
		class="mb-4 rounded-md border border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)] px-3.5 py-2 text-xs text-[var(--color-tier-over-fg)]"
	>
		{validationError}
	</div>
{/if}

<!-- FR-07: Weekly Preferences Bar -->
<section
	class="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3 text-xs"
>
	<div class="flex flex-wrap items-center gap-2">
		<span class="font-semibold">Preferred Days:</span>
		<div class="inline-flex flex-wrap gap-1">
			{#each DAYS as d (d)}
				{@const on = preferredDays.includes(d)}
				<button
					type="button"
					onclick={() => togglePreferredDay(d)}
					class="rounded border px-2.5 py-1 text-xs font-medium transition-colors {on
						? 'border-[#1f2328] bg-[#1f2328] text-white'
						: 'border-[var(--color-border-default)] bg-white text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'}"
				>
					{d}
				</button>
			{/each}
		</div>
	</div>

	<label class="inline-flex items-center gap-2 font-semibold">
		<span>Preferred Studio:</span>
		<select
			bind:value={preferredStudio}
			class="rounded-md border border-[var(--color-border-default)] bg-white px-2.5 py-1 font-mono text-xs font-medium"
		>
			{#each store.studios as st (st.studioId)}
				<option value={st.studioId}>{st.studioId} · {st.name}</option>
			{/each}
		</select>
	</label>
</section>

<!-- FR-06: Recurring 30-Minute Availability Grid (08:00–21:00) -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2 text-xs"
	>
		<span class="font-semibold">Recurring Weekly 30-Minute Availability Grid</span>
		<span class="text-[var(--color-fg-muted)]">Click any slot or day header to toggle</span>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full min-w-[680px] table-fixed border-collapse text-xs select-none">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
					<th class="w-20 border-r border-[var(--color-border-default)] px-2.5 py-2 text-left font-medium text-[var(--color-fg-muted)]">
						Slot
					</th>
					{#each DAYS as d (d)}
						<th class="border-r border-[var(--color-border-default)] last:border-r-0 px-2 py-1.5 text-center">
							<button
								type="button"
								onclick={() => toggleDayColumn(d)}
								class="w-full rounded px-1.5 py-0.5 font-semibold hover:bg-[#eaeef2]"
							>
								{d}
								{#if preferredDays.includes(d)}
									<span class="font-mono text-[10px] text-[var(--color-fg-muted)]">★</span>
								{/if}
							</button>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each ALL_SLOTS as slot (slot)}
					<tr class="border-b border-[var(--color-border-muted)] last:border-b-0">
						<td class="border-r border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]/50 px-2.5 py-1 font-mono text-[11px] text-[var(--color-fg-muted)] tabular-nums">
							{slot}
						</td>
						{#each DAYS as d (d)}
							{@const open = isOperatingSlot(d, slot)}
							{@const active = open && Boolean(store.teacherDecGrid[`${d}@${slot}`])}
							<td
								class="border-r border-[var(--color-border-muted)] last:border-r-0 p-0.5 {!open
									? 'hatch-closed'
									: ''}"
							>
								{#if open}
									<button
										type="button"
										aria-label="{d} {slot} {active ? 'Available' : 'Unavailable'}"
										onclick={() => toggleCell(d, slot)}
										class="block h-5 w-full rounded-xs transition-colors {active
											? 'bg-[#1f2328] text-white'
											: 'bg-white hover:bg-[var(--color-canvas-subtle)]'}"
									></button>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
