<script lang="ts">
	import {
		store,
		DAYS,
		ALL_SLOTS,
		isOperatingSlot,
		endTimeOf,
		type LessonSlot
	} from '$lib/store.svelte';
	import { RejectionRequestSchema, type RejectionReason } from '$lib/schemas';
	import type { DayCode } from '$lib/schemas';
	import TierBadge from '$lib/components/ui/TierBadge.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { ChevronLeft, ChevronRight, AlertTriangle } from '@lucide/svelte';

	let startFilter = $state('08:00');
	let endFilter = $state('18:00');

	let visibleSlots = $derived(
		ALL_SLOTS.filter((s) => s >= startFilter && s < endFilter)
	);

	let teacher = $derived(store.currentActor);
	let weeklyHours = $derived(store.getTeacherWeeklyHours(teacher.staffId));
	let monthlyHours = $derived(store.getTeacherMonthlyHours(teacher.staffId));

	let lessonMap = $derived.by(() => {
		const map = new Map<string, LessonSlot>();
		for (const l of store.lessons) {
			if (l.weekId === store.selectedWeekId && l.teacherId === teacher.staffId) {
				map.set(`${l.day}@${l.slot}`, l);
			}
		}
		return map;
	});

	// Detect mandatory 1.0h rest break slots immediately following a 4.0h (8-slot) continuous block
	function isMandatoryRestSlot(day: DayCode, slotIdx: number): boolean {
		const checkRunEndingAt = (endIdx: number) => {
			if (endIdx < 7) return false;
			for (let k = endIdx - 7; k <= endIdx; k++) {
				if (!lessonMap.has(`${day}@${ALL_SLOTS[k]}`)) return false;
			}
			return true;
		};
		return checkRunEndingAt(slotIdx - 1) || checkRunEndingAt(slotIdx - 2);
	}

	let activeSlotModal = $state<LessonSlot | null>(null);
	let acknowledgedWarning = $state(false);
	let rejectionReason = $state<RejectionReason>('Medical / Personal');
	let rejectionNote = $state('');
	let rejectionError = $state<string | null>(null);

	function openLessonModal(lesson: LessonSlot) {
		activeSlotModal = lesson;
		acknowledgedWarning = false;
		rejectionReason = lesson.rejectionReason ?? 'Medical / Personal';
		rejectionNote = lesson.rejectionNote ?? '';
		rejectionError = null;
	}

	function submitRejection() {
		if (!activeSlotModal) return;
		const parsed = RejectionRequestSchema.safeParse({
			acknowledgedWarning,
			reason: rejectionReason,
			note: rejectionNote
		});
		if (!parsed.success) {
			rejectionError = parsed.error.issues[0]?.message ?? 'Complete all fields';
			return;
		}
		store.submitJobRejection(activeSlotModal.lessonId, parsed.data.reason, parsed.data.note);
		activeSlotModal = null;
	}

	function stepWeek(delta: number) {
		const idx = store.weeks.findIndex((w) => w.id === store.selectedWeekId);
		const next = store.weeks[idx + delta];
		if (next) store.selectedWeekId = next.id;
	}
</script>

<!-- Intranet-Inspired Top Week Switcher Bar -->
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div class="flex flex-wrap items-center gap-2.5">
		<h1 class="text-lg font-semibold tracking-tight">Weekly Schedule</h1>
		<TierBadge hours={weeklyHours} compact />
		<span class="font-mono text-xs text-[var(--color-fg-muted)] tabular-nums">
			{weeklyHours.toFixed(1)} h wk · {monthlyHours.toFixed(1)} h mo · Studio {teacher.homeStudio}
		</span>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<button
			type="button"
			onclick={() => stepWeek(-1)}
			disabled={store.selectedWeekId === store.weeks[0].id}
			class="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-1 text-xs font-medium hover:bg-[#eaeef2] disabled:opacity-40"
		>
			<ChevronLeft class="h-3.5 w-3.5" />
			<span>Previous Week</span>
		</button>
		<div
			class="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3.5 py-1 font-mono text-xs font-semibold tabular-nums"
		>
			Week of {store.currentWeek.rangeText}
		</div>
		<button
			type="button"
			onclick={() => stepWeek(1)}
			disabled={store.selectedWeekId === store.weeks[store.weeks.length - 1].id}
			class="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-1 text-xs font-medium hover:bg-[#eaeef2] disabled:opacity-40"
		>
			<span>Next Week</span>
			<ChevronRight class="h-3.5 w-3.5" />
		</button>
	</div>
</div>

<!-- Toolbar Filter Strip (Modeled on SIT Intranet Schedule Header) -->
<div
	class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3.5 py-2 text-xs"
>
	<div class="flex flex-wrap items-center gap-3">
		<label class="inline-flex items-center gap-1.5 font-medium">
			<span class="text-[var(--color-fg-muted)]">Week</span>
			<select
				bind:value={store.selectedWeekId}
				class="rounded border border-[var(--color-border-default)] bg-white px-2 py-1 font-mono text-xs"
			>
				{#each store.weeks as wk (wk.id)}
					<option value={wk.id}>{wk.rangeText}</option>
				{/each}
			</select>
		</label>

		<label class="inline-flex items-center gap-1.5 font-medium">
			<span class="text-[var(--color-fg-muted)]">Start</span>
			<select
				bind:value={startFilter}
				class="rounded border border-[var(--color-border-default)] bg-white px-2 py-1 font-mono text-xs"
			>
				<option value="08:00">08:00</option>
				<option value="09:00">09:00</option>
				<option value="12:00">12:00</option>
			</select>
		</label>

		<label class="inline-flex items-center gap-1.5 font-medium">
			<span class="text-[var(--color-fg-muted)]">End</span>
			<select
				bind:value={endFilter}
				class="rounded border border-[var(--color-border-default)] bg-white px-2 py-1 font-mono text-xs"
			>
				<option value="18:00">18:00</option>
				<option value="21:00">21:00</option>
			</select>
		</label>
	</div>

	<div class="flex flex-wrap items-center gap-3 text-[11px] text-[var(--color-fg-muted)]">
		<span class="inline-flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-xs border border-[#1f2328] bg-[var(--color-canvas-subtle)]"></span>
			<span>Confirmed (click to inspect / reject)</span>
		</span>
		<span class="inline-flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-xs border border-dashed border-[#1f2328] bg-white"></span>
			<span>Rejection Pending</span>
		</span>
		<span class="inline-flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-xs border border-[var(--color-border-default)] hatch-closed"></span>
			<span>Closed / Mandatory 1h Rest</span>
		</span>
	</div>
</div>

<!-- School-Intranet Style Weekly Timetable Grid -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div class="overflow-x-auto">
		<table class="w-full min-w-[820px] table-fixed border-collapse text-xs">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
					<th class="w-20 border-r border-[var(--color-border-default)] px-2.5 py-2 text-left font-medium text-[var(--color-fg-muted)]">
						Time
					</th>
					{#each DAYS as d (d)}
						<th class="border-r border-[var(--color-border-default)] last:border-r-0 px-2 py-2 text-center font-semibold">
							<div>{d}</div>
							<div class="font-mono text-[11px] font-normal text-[var(--color-fg-muted)]">
								{store.currentWeek.dates[d]}
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each visibleSlots as slot (slot)}
					{@const globalIdx = ALL_SLOTS.indexOf(slot)}
					<tr class="border-b border-[var(--color-border-muted)] last:border-b-0">
						<td class="border-r border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]/50 px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-fg-muted)] tabular-nums align-top">
							{slot}
						</td>
						{#each DAYS as d (d)}
							{@const open = isOperatingSlot(d, slot)}
							{@const lesson = lessonMap.get(`${d}@${slot}`)}
							{@const restBreak = open && !lesson && isMandatoryRestSlot(d, globalIdx)}
							<td
								class="h-11 border-r border-[var(--color-border-muted)] last:border-r-0 p-1 align-top {!open
									? 'hatch-closed'
									: restBreak
										? 'hatch-closed'
										: ''}"
							>
								{#if lesson}
									<button
										type="button"
										onclick={() => openLessonModal(lesson)}
										class="w-full rounded px-2 py-1 text-left transition-colors {lesson.status ===
										'RejectionPending'
											? 'border border-dashed border-[#1f2328] bg-white hover:bg-[var(--color-canvas-subtle)]'
											: 'border border-[#8c959f] bg-[var(--color-canvas-subtle)] hover:border-[#1f2328] hover:bg-[#eaeef2]'}"
									>
										<div class="flex items-center justify-between gap-1">
											<span class="truncate font-semibold text-[11px] leading-tight">
												{lesson.studentName}
											</span>
											<span class="shrink-0 font-mono text-[10px] text-[var(--color-fg-muted)]">
												{lesson.studioId}
											</span>
										</div>
										<div class="truncate text-[10px] text-[var(--color-fg-muted)] leading-tight mt-0.5">
											{lesson.instrument} · {lesson.grade}
											{#if lesson.status === 'RejectionPending'}
												· <strong class="text-[var(--color-fg-default)]">Pending</strong>
											{/if}
										</div>
									</button>
								{:else if restBreak}
									<div class="px-1.5 py-1 font-mono text-[10px] text-[var(--color-fg-muted)]">
										1.0h Rest Break
									</div>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<!-- FR-08 Student Details & FR-09 Mandatory Consultation Warning Rejection Modal -->
<Dialog
	open={activeSlotModal !== null}
	title={activeSlotModal ? `Lesson ${activeSlotModal.lessonId} · ${activeSlotModal.day} ${activeSlotModal.slot}–${endTimeOf(activeSlotModal.slot)}` : ''}
	onClose={() => (activeSlotModal = null)}
>
	{#if activeSlotModal}
		<div class="space-y-3.5">
			<!-- Enrolled Student & Studio Details (FR-01, FR-08) -->
			<dl class="grid grid-cols-2 gap-2 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3 text-xs">
				<div>
					<dt class="text-[var(--color-fg-muted)]">Student</dt>
					<dd class="font-semibold">{activeSlotModal.studentName} ({activeSlotModal.grade})</dd>
				</div>
				<div>
					<dt class="text-[var(--color-fg-muted)]">Instrument &amp; Studio</dt>
					<dd class="font-mono font-semibold">{activeSlotModal.instrument} · {activeSlotModal.studioId}</dd>
				</div>
			</dl>

			{#if activeSlotModal.status === 'RejectionPending'}
				<div class="rounded-md border border-dashed border-[#1f2328] p-3 text-xs">
					<div class="font-semibold">Flagged for Manager Discussion</div>
					<div class="mt-1 text-[var(--color-fg-muted)]">
						{activeSlotModal.rejectionReason}: “{activeSlotModal.rejectionNote}”
					</div>
				</div>
			{:else}
				<!-- Mandatory Warning Prompt (Brief Requirement #10 / FR-09) -->
				<div
					class="flex items-start gap-2.5 rounded-md border border-[var(--color-tier-warn-border)] bg-[var(--color-tier-warn-bg)] p-3 text-xs text-[var(--color-tier-warn-fg)]"
				>
					<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
					<div>
						<strong>Consultation Required:</strong> Discuss this assigned job with your manager before proceeding with a rejection request. Submitted slots remain assigned until the manager reviews and reallocates them.
					</div>
				</div>

				<div class="space-y-2.5">
					<div>
						<label for="rej-reason" class="mb-1 block text-xs font-medium">Reason</label>
						<select
							id="rej-reason"
							bind:value={rejectionReason}
							class="w-full rounded-md border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 text-xs"
						>
							<option value="Medical / Personal">Medical / Personal</option>
							<option value="Schedule Conflict">Schedule Conflict</option>
							<option value="Pedagogical Grade Mismatch">Pedagogical Grade Mismatch</option>
						</select>
					</div>

					<div>
						<label for="rej-note" class="mb-1 block text-xs font-medium">Note for Manager</label>
						<input
							id="rej-note"
							type="text"
							bind:value={rejectionNote}
							placeholder="e.g. Clinic appointment; available Thu afternoon instead"
							class="w-full rounded-md border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 text-xs"
						/>
					</div>

					<label class="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							bind:checked={acknowledgedWarning}
							class="h-3.5 w-3.5 rounded border-[var(--color-border-default)] accent-[#1f2328]"
						/>
						<span>I acknowledge the warning to discuss this slot with my manager</span>
					</label>

					{#if rejectionError}
						<p class="text-xs text-[var(--color-tier-over-fg)]">{rejectionError}</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		<button
			type="button"
			onclick={() => (activeSlotModal = null)}
			class="rounded-md border border-[var(--color-border-default)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[#eaeef2]"
		>
			Close
		</button>
		{#if activeSlotModal && activeSlotModal.status !== 'RejectionPending'}
			<button
				type="button"
				onclick={submitRejection}
				class="rounded-md bg-[#1f2328] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#32383f]"
			>
				Submit Rejection Request
			</button>
		{/if}
	{/snippet}
</Dialog>
