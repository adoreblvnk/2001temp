<script lang="ts">
	import {
		store,
		DAYS,
		ALL_SLOTS,
		isOperatingSlot,
		endTimeOf,
		type LessonSlot
	} from '$lib/store.svelte';
	import { RejectionRequestSchema, type RejectionReason, type DayCode } from '$lib/schemas';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { ChevronLeft, ChevronRight, AlertTriangle } from '@lucide/svelte';

	let startFilter = $state('08:00');
	let endFilter = $state('18:00');

	let visibleSlots = $derived(ALL_SLOTS.filter((s) => s >= startFilter && s < endFilter));

	let teacher = $derived(store.currentActor);
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

<!-- Clean De-duplicated Header (No OK pill, no redundant studio/weekly strings) -->
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<h1 class="text-xl font-semibold tracking-tight">Weekly Schedule</h1>

	<div class="font-mono text-sm font-medium tabular-nums text-[var(--color-fg-muted)]">
		Monthly Allocation: <strong class="text-[var(--color-fg-default)]">{monthlyHours.toFixed(1)} h</strong>
	</div>
</div>

<!-- Single Intranet-Style Toolbar (No Repeated Week Selector) -->
<div
	class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5 text-sm"
>
	<div class="flex flex-wrap items-center gap-2.5">
		<div
			class="inline-flex items-center rounded border border-[var(--color-border-default)] bg-white"
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
				aria-label="Select week"
				bind:value={store.selectedWeekId}
				class="border-x border-[var(--color-border-default)] bg-white px-3 py-1.5 font-mono text-sm font-medium tabular-nums focus:outline-none"
			>
				{#each store.weeks as wk (wk.id)}
					<option value={wk.id}>{wk.rangeText}</option>
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

		<label class="inline-flex items-center gap-1.5 font-medium">
			<span class="text-[var(--color-fg-muted)]">Start</span>
			<select
				bind:value={startFilter}
				class="rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 font-mono text-sm"
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
				class="rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 font-mono text-sm"
			>
				<option value="18:00">18:00</option>
				<option value="21:00">21:00</option>
			</select>
		</label>
	</div>

	<div class="flex flex-wrap items-center gap-4 text-xs text-[var(--color-fg-muted)]">
		<span class="inline-flex items-center gap-1.5">
			<span
				class="h-3 w-3 rounded-xs border border-[#8c959f] bg-[var(--color-canvas-subtle)]"
			></span>
			<span>Confirmed</span>
		</span>
		<span class="inline-flex items-center gap-1.5">
			<span class="h-3 w-3 rounded-xs border border-dashed border-[#1f2328] bg-white"></span>
			<span>Rejection Pending</span>
		</span>
		<span class="inline-flex items-center gap-1.5">
			<span
				class="h-3 w-3 rounded-xs border border-[var(--color-border-default)] hatch-closed"
			></span>
			<span>Closed / 1h Rest</span>
		</span>
	</div>
</div>

<!-- Intranet Weekly Calendar Grid -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div class="overflow-x-auto">
		<table class="w-full min-w-[860px] table-fixed border-collapse text-sm">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
					<th
						class="w-20 border-r border-[var(--color-border-default)] px-3 py-2.5 text-left font-medium text-[var(--color-fg-muted)]"
					>
						Time
					</th>
					{#each DAYS as d (d)}
						<th
							class="border-r border-[var(--color-border-default)] last:border-r-0 px-2 py-2.5 text-center font-semibold"
						>
							<div>{d}</div>
							<div class="font-mono text-xs font-normal text-[var(--color-fg-muted)]">
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
						<td
							class="border-r border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]/50 px-3 py-2 font-mono text-xs font-medium text-[var(--color-fg-muted)] tabular-nums align-top"
						>
							{slot}
						</td>
						{#each DAYS as d (d)}
							{@const open = isOperatingSlot(d, slot)}
							{@const lesson = lessonMap.get(`${d}@${slot}`)}
							{@const restBreak = open && !lesson && isMandatoryRestSlot(d, globalIdx)}
							<td
								class="h-12 border-r border-[var(--color-border-muted)] last:border-r-0 p-1 align-top {!open ||
								restBreak
									? 'hatch-closed'
									: ''}"
							>
								{#if lesson}
									<button
										type="button"
										onclick={() => openLessonModal(lesson)}
										class="w-full rounded px-2 py-1.5 text-left transition-colors {lesson.status ===
										'RejectionPending'
											? 'border border-dashed border-[#1f2328] bg-white hover:bg-[var(--color-canvas-subtle)]'
											: 'border border-[#8c959f] bg-[var(--color-canvas-subtle)] hover:border-[#1f2328] hover:bg-[#eaeef2]'}"
									>
										<div class="flex items-center justify-between gap-1">
											<span class="truncate text-xs font-semibold leading-tight">
												{lesson.studentName}
											</span>
											<span class="shrink-0 font-mono text-xs text-[var(--color-fg-muted)]">
												{lesson.studioId}
											</span>
										</div>
										<div class="mt-0.5 truncate text-xs text-[var(--color-fg-muted)] leading-tight">
											{lesson.grade}
											{#if lesson.status === 'RejectionPending'}
												· <strong class="text-[var(--color-fg-default)]">Pending</strong>
											{/if}
										</div>
									</button>
								{:else if restBreak}
									<div class="px-2 py-1.5 font-mono text-xs text-[var(--color-fg-muted)]">
										1.0h Rest
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

<!-- FR-08 & FR-09 Modal -->
<Dialog
	open={activeSlotModal !== null}
	title={activeSlotModal
		? `Lesson ${activeSlotModal.lessonId} · ${activeSlotModal.day} ${activeSlotModal.slot}–${endTimeOf(activeSlotModal.slot)}`
		: ''}
	onClose={() => (activeSlotModal = null)}
>
	{#if activeSlotModal}
		<div class="space-y-4">
			<dl
				class="grid grid-cols-2 gap-3 rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3.5 text-sm"
			>
				<div>
					<dt class="text-xs text-[var(--color-fg-muted)]">Student</dt>
					<dd class="mt-0.5 font-semibold">
						{activeSlotModal.studentName} ({activeSlotModal.grade})
					</dd>
				</div>
				<div>
					<dt class="text-xs text-[var(--color-fg-muted)]">Instrument &amp; Studio</dt>
					<dd class="mt-0.5 font-mono font-semibold">
						{activeSlotModal.instrument} · {activeSlotModal.studioId}
					</dd>
				</div>
			</dl>

			{#if activeSlotModal.status === 'RejectionPending'}
				<div class="rounded border border-dashed border-[#1f2328] p-3.5 text-sm">
					<div class="font-semibold">Flagged for Manager Discussion</div>
					<div class="mt-1 text-[var(--color-fg-muted)]">
						{activeSlotModal.rejectionReason}: “{activeSlotModal.rejectionNote}”
					</div>
				</div>
			{:else}
				<div
					class="flex items-start gap-2.5 rounded border border-[var(--color-tier-warn-border)] bg-[var(--color-tier-warn-bg)] p-3.5 text-sm text-[var(--color-tier-warn-fg)]"
				>
					<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
					<div>
						<strong>Consultation Warning:</strong> Discuss this assigned lesson with your manager before submitting a rejection request.
					</div>
				</div>

				<div class="space-y-3">
					<div>
						<label for="rej-reason" class="mb-1 block text-sm font-medium">Reason</label>
						<select
							id="rej-reason"
							bind:value={rejectionReason}
							class="w-full rounded border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm"
						>
							<option value="Medical / Personal">Medical / Personal</option>
							<option value="Schedule Conflict">Schedule Conflict</option>
							<option value="Pedagogical Grade Mismatch">Pedagogical Grade Mismatch</option>
						</select>
					</div>

					<div>
						<label for="rej-note" class="mb-1 block text-sm font-medium">Note for Manager</label>
						<input
							id="rej-note"
							type="text"
							bind:value={rejectionNote}
							placeholder="e.g. Clinic appointment; available Thu afternoon"
							class="w-full rounded border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm"
						/>
					</div>

					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							bind:checked={acknowledgedWarning}
							class="h-4 w-4 rounded border-[var(--color-border-default)] accent-[#1f2328]"
						/>
						<span>I will consult my manager regarding this rejection</span>
					</label>

					{#if rejectionError}
						<p class="text-sm text-[var(--color-tier-over-fg)]">{rejectionError}</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		<button
			type="button"
			onclick={() => (activeSlotModal = null)}
			class="rounded border border-[var(--color-border-default)] bg-white px-3.5 py-1.5 text-sm font-medium hover:bg-[#eaeef2]"
		>
			Close
		</button>
		{#if activeSlotModal && activeSlotModal.status !== 'RejectionPending'}
			<button
				type="button"
				onclick={submitRejection}
				class="rounded bg-[#1f2328] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#32383f]"
			>
				Submit Rejection Request
			</button>
		{/if}
	{/snippet}
</Dialog>
