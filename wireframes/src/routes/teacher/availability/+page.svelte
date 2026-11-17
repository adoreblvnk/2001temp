<script lang="ts">
	import { store, DAYS, ALL_SLOTS, isOperatingSlot } from '$lib/store.svelte';
	import { AvailabilitySubmissionSchema, type DayCode } from '$lib/schemas';
	import { Save } from '@lucide/svelte';

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

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div>
		<h1 class="text-xl font-semibold tracking-tight">December 2026 Availability</h1>
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
			{declaredMonthlyHours.toFixed(1)} / 60.0 h min
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

<section
	class="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3 text-sm"
>
	<div class="flex flex-wrap items-center gap-2.5">
		<span class="font-semibold">Preferred Days:</span>
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
</section>

<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div class="overflow-x-auto">
		<table class="w-full min-w-[700px] table-fixed border-collapse text-sm select-none">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
					<th
						class="w-20 border-r border-[var(--color-border-default)] px-3 py-2 text-left font-medium text-[var(--color-fg-muted)]"
					>
						Slot
					</th>
					{#each DAYS as d (d)}
						<th
							class="border-r border-[var(--color-border-default)] last:border-r-0 px-2 py-2 text-center"
						>
							<button
								type="button"
								onclick={() => toggleDayColumn(d)}
								class="w-full rounded px-1.5 py-0.5 font-semibold hover:bg-[#eaeef2]"
							>
								{d}
							</button>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each ALL_SLOTS as slot (slot)}
					<tr class="border-b border-[var(--color-border-muted)] last:border-b-0">
						<td
							class="border-r border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]/50 px-3 py-1 font-mono text-xs font-medium text-[var(--color-fg-muted)] tabular-nums"
						>
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
