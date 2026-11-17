<script lang="ts">
	import { store, DAYS, ALL_SLOTS } from '$lib/store.svelte';
	import { AvailabilitySubmissionSchema, type DayCode } from '$lib/schemas';
	import { Save, Check } from '@lucide/svelte';

	let teacher = $derived(store.currentActor);

	let preferredDays = $state<DayCode[]>(['Mon', 'Tue', 'Thu', 'Sat']);
	let preferredStudio = $state<string>('S-01');
	let validationError = $state<string | null>(null);

	$effect(() => {
		preferredDays = [...teacher.preferredDays];
		preferredStudio = teacher.preferredStudio;
	});

	interface MonthDayEntry {
		dayOfMonth: number;
		dayCode: DayCode;
		start: string;
		end: string;
		available: boolean;
		note?: string;
	}

	function initialDecDays(): MonthDayEntry[] {
		const rules: Record<number, { start: string; end: string; available: boolean; note?: string }> = {
			1: { start: '09:00', end: '17:00', available: true },
			2: { start: '13:00', end: '19:00', available: true },
			3: { start: '09:00', end: '17:00', available: true },
			4: { start: '10:00', end: '16:00', available: true },
			5: { start: '08:30', end: '17:00', available: true },
			6: { start: '09:00', end: '17:00', available: false },
			7: { start: '09:00', end: '17:00', available: true },
			8: { start: '09:00', end: '17:00', available: true },
			9: { start: '13:00', end: '19:00', available: true },
			10: { start: '09:00', end: '17:00', available: true },
			11: { start: '10:00', end: '16:00', available: true },
			12: { start: '08:30', end: '17:00', available: true },
			13: { start: '09:00', end: '17:00', available: false },
			14: { start: '09:00', end: '17:00', available: true },
			15: { start: '09:00', end: '17:00', available: true },
			16: { start: '13:00', end: '19:00', available: false, note: 'Personal' },
			17: { start: '09:00', end: '17:00', available: true },
			18: { start: '10:00', end: '16:00', available: true },
			19: { start: '08:30', end: '17:00', available: true },
			20: { start: '09:00', end: '17:00', available: false },
			21: { start: '09:00', end: '17:00', available: true },
			22: { start: '09:00', end: '17:00', available: true },
			23: { start: '13:00', end: '19:00', available: true },
			24: { start: '09:00', end: '13:00', available: true },
			25: { start: '10:00', end: '16:00', available: false, note: 'Public Holiday' },
			26: { start: '09:00', end: '16:30', available: true },
			27: { start: '09:00', end: '17:00', available: false },
			28: { start: '10:00', end: '16:00', available: true },
			29: { start: '09:00', end: '14:00', available: true },
			30: { start: '13:00', end: '17:00', available: true },
			31: { start: '09:00', end: '17:00', available: false }
		};
		// Dec 1, 2026 is Tuesday (index 1 in DAYS Mon..Sun)
		return Array.from({ length: 31 }, (_, idx) => {
			const dayOfMonth = idx + 1;
			const dayCode = DAYS[(idx + 1) % 7];
			const r = rules[dayOfMonth];
			return { dayOfMonth, dayCode, ...r };
		});
	}

	let monthDays = $state<MonthDayEntry[]>(initialDecDays());
	let selectedDayNum = $state<number>(2);

	function hoursOf(entry: MonthDayEntry): number {
		if (!entry.available || entry.end <= entry.start) return 0;
		const [sh, sm] = entry.start.split(':').map(Number);
		const [eh, em] = entry.end.split(':').map(Number);
		return (eh * 60 + em - (sh * 60 + sm)) / 60;
	}

	let declaredMonthlyHours = $derived(
		monthDays.reduce((acc, d) => acc + hoursOf(d), 0)
	);
	let meetsFloor = $derived(declaredMonthlyHours >= 60.0);
	let activeDay = $derived(monthDays.find((d) => d.dayOfMonth === selectedDayNum) ?? monthDays[0]);

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

	const endOptions = [...ALL_SLOTS.slice(1), '21:00'];
</script>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div>
		<h1 class="text-xl font-semibold tracking-tight">December 2026 Monthly Availability</h1>
		<p class="mt-0.5 text-sm text-[var(--color-fg-muted)]">
			Declare open 30-minute availability windows across all 31 calendar days
		</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<span class="font-mono text-sm text-[var(--color-fg-muted)] tabular-nums">
			Cutoff: <strong class="text-[var(--color-fg-default)]">19 Nov 23:59</strong>
		</span>
		<span
			class="rounded border px-3 py-1 font-mono text-sm font-semibold tabular-nums {meetsFloor
				? 'border-[var(--color-tier-ok-border)] bg-[var(--color-tier-ok-bg)] text-[var(--color-tier-ok-fg)]'
				: 'border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)] text-[var(--color-tier-over-fg)]'}"
		>
			{declaredMonthlyHours.toFixed(1)} / 60.0 h monthly min
		</span>

		<button
			type="button"
			onclick={handleSave}
			class="inline-flex items-center gap-2 rounded bg-[#1f2328] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#32383f]"
		>
			<Save class="h-4 w-4" />
			<span>Save Declaration</span>
		</button>
	</div>
</div>

{#if validationError}
	<div
		class="mb-4 rounded border border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)] px-4 py-2.5 text-sm text-[var(--color-tier-over-fg)]"
	>
		{validationError}
	</div>
{/if}

<!-- FR-06: Monthly Calendar Grid -->
<section class="mb-4 rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5 text-xs"
	>
		<span class="font-semibold text-[var(--color-fg-default)]">
			1. Monthly Availability Calendar (December 2026)
		</span>
		<div class="flex items-center gap-4 text-[var(--color-fg-muted)]">
			<span class="inline-flex items-center gap-1.5">
				<span
					class="inline-block h-3 w-3 rounded-xs border border-[var(--color-tier-ok-border)] bg-[var(--color-tier-ok-bg)]"
				></span>
				Available
			</span>
			<span class="inline-flex items-center gap-1.5">
				<span
					class="inline-block h-3 w-3 rounded-xs border border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)]"
				></span>
				Blocked
			</span>
		</div>
	</div>

	<div class="grid grid-cols-7 border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]/60 text-center text-xs font-semibold text-[var(--color-fg-muted)]">
		{#each DAYS as d (d)}
			<div class="border-r border-[var(--color-border-muted)] last:border-r-0 py-2">{d}</div>
		{/each}
	</div>

	<div class="grid grid-cols-7">
		<!-- Nov 30 leading blank cell (Dec 1 is Tuesday) -->
		<div
			class="min-h-[76px] border-b border-r border-[var(--color-border-muted)] bg-[var(--color-canvas-subtle)]/40 p-2 text-xs text-[var(--color-fg-subtle)]"
		>
			30 Nov
		</div>

		{#each monthDays as entry (entry.dayOfMonth)}
			{@const isSelected = entry.dayOfMonth === selectedDayNum}
			{@const hrs = hoursOf(entry)}
			<button
				type="button"
				onclick={() => (selectedDayNum = entry.dayOfMonth)}
				class="min-h-[76px] border-b border-r border-[var(--color-border-muted)] p-2 text-left transition-colors {entry.available
					? 'bg-[var(--color-tier-ok-bg)]/55 hover:bg-[var(--color-tier-ok-bg)]'
					: 'bg-[var(--color-tier-over-bg)]/65 hover:bg-[var(--color-tier-over-bg)]'} {isSelected
					? 'ring-2 ring-inset ring-[#1f2328]'
					: ''}"
			>
				<div class="flex items-center justify-between">
					<span class="font-mono text-xs font-semibold text-[var(--color-fg-default)]">
						{entry.dayOfMonth}
					</span>
					{#if entry.available}
						<span
							class="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-[var(--color-tier-ok-fg)]"
						>
							<Check class="h-3 w-3" />
							{hrs.toFixed(1)}h
						</span>
					{/if}
				</div>
				<div class="mt-1.5 font-mono text-[11px] leading-tight">
					{#if entry.available}
						<div class="font-medium text-[var(--color-tier-ok-fg)]">
							{entry.start}–{entry.end}
						</div>
						<div class="text-[10px] text-[var(--color-tier-ok-fg)]/80">Available</div>
					{:else}
						<div class="font-medium text-[var(--color-tier-over-fg)]">
							{entry.note ?? 'Blocked'}
						</div>
						<div class="text-[10px] text-[var(--color-tier-over-fg)]/80">Unavailable</div>
					{/if}
				</div>
			</button>
		{/each}

		<!-- Jan 1-3 trailing blank cells (Dec 31 is Thursday -> Fri, Sat, Sun padding) -->
		{#each ['1 Jan', '2 Jan', '3 Jan'] as pad (pad)}
			<div
				class="min-h-[76px] border-b border-r border-[var(--color-border-muted)] last:border-r-0 bg-[var(--color-canvas-subtle)]/40 p-2 text-xs text-[var(--color-fg-subtle)]"
			>
				{pad}
			</div>
		{/each}
	</div>

	<!-- Inline 30-min Slot Window Editor for Selected Date -->
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5 text-sm"
	>
		<div class="flex flex-wrap items-center gap-3">
			<span class="font-semibold">
				Selected: <span class="font-mono">{activeDay.dayCode} {activeDay.dayOfMonth} Dec</span>
			</span>
			<label class="inline-flex items-center gap-1.5 text-xs">
				<input type="checkbox" bind:checked={activeDay.available} class="h-4 w-4 accent-[#1f2328]" />
				<span>Available for scheduling</span>
			</label>
		</div>

		<div class="flex flex-wrap items-center gap-2 text-xs">
			<span class="text-[var(--color-fg-muted)]">30-min Window:</span>
			<select
				bind:value={activeDay.start}
				disabled={!activeDay.available}
				class="rounded border border-[var(--color-border-default)] bg-white px-2 py-1 font-mono text-xs disabled:opacity-50"
			>
				{#each ALL_SLOTS as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
			<span>–</span>
			<select
				bind:value={activeDay.end}
				disabled={!activeDay.available}
				class="rounded border border-[var(--color-border-default)] bg-white px-2 py-1 font-mono text-xs disabled:opacity-50"
			>
				{#each endOptions as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</div>
	</div>
</section>

<!-- FR-07: Separate Teaching Preferences Panel -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div
		class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2 text-xs font-semibold text-[var(--color-fg-default)]"
	>
		2. Teaching Preferences (Ranked Within Declared Availability)
	</div>
	<div class="flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm">
		<div class="flex flex-wrap items-center gap-2.5">
			<span class="font-semibold">Preferred Teaching Days:</span>
			<div class="inline-flex flex-wrap gap-1.5">
				{#each DAYS as d (d)}
					{@const on = preferredDays.includes(d)}
					<button
						type="button"
						onclick={() => togglePreferredDay(d)}
						class="rounded border px-3 py-1 text-sm font-medium transition-colors {on
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
				class="rounded border border-[var(--color-border-default)] bg-white px-3 py-1 font-mono text-sm font-medium"
			>
				{#each store.studios as st (st.studioId)}
					<option value={st.studioId}>{st.studioId} · {st.name}</option>
				{/each}
			</select>
		</label>
	</div>
</section>
