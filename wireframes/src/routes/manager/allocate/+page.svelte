<script lang="ts">
	import { page } from '$app/stores';
	import { store, DAYS, endTimeOf } from '$lib/store.svelte';
	import { OvertimeConfirmSchema } from '$lib/schemas';
	import TierBadge from '$lib/components/ui/TierBadge.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { Check, AlertTriangle, Ban, Clock } from '@lucide/svelte';

	let queueFilter = $state<'all' | 'unassigned' | 'rejected'>(
		$page.url.searchParams.get('filter') === 'rejected' ? 'rejected' : 'all'
	);

	let queueLessons = $derived(
		store.lessons.filter((l) => {
			if (l.weekId !== store.selectedWeekId) return false;
			if (queueFilter === 'unassigned') return l.status === 'Unassigned';
			if (queueFilter === 'rejected') return l.status === 'RejectionPending';
			return l.status === 'Unassigned' || l.status === 'RejectionPending';
		})
	);

	let selectedLessonId = $state<string>('L-409');
	let selectedStudioId = $state<string>('S-01');
	let selectedTeacherId = $state<string | null>(null);

	let activeLesson = $derived(
		queueLessons.find((l) => l.lessonId === selectedLessonId) ?? queueLessons[0] ?? null
	);

	$effect(() => {
		if (!activeLesson) return;
		const validStudio = store.studios.find(
			(s) =>
				s.equippedInstruments.includes(activeLesson.instrument) &&
				!store.isStudioUnderMaintenance(
					s.studioId,
					activeLesson.weekId,
					activeLesson.day,
					activeLesson.slot
				) &&
				!store.isStudioOccupied(
					s.studioId,
					activeLesson.weekId,
					activeLesson.day,
					activeLesson.slot,
					activeLesson.lessonId
				)
		);
		if (validStudio) selectedStudioId = validStudio.studioId;
	});

	let evaluation = $derived(
		activeLesson
			? store.evaluateCandidatesForLesson(activeLesson, selectedStudioId)
			: { eligible: [], excluded: [] }
	);

	let topThreeCandidates = $derived(evaluation.eligible.slice(0, 3));

	$effect(() => {
		if (topThreeCandidates.length > 0) {
			if (!topThreeCandidates.some((c) => c.teacher.staffId === selectedTeacherId)) {
				selectedTeacherId = topThreeCandidates[0].teacher.staffId;
			}
		} else {
			selectedTeacherId = null;
		}
	});

	let chosenCandidate = $derived(
		topThreeCandidates.find((c) => c.teacher.staffId === selectedTeacherId) ?? null
	);

	let overtimeModalOpen = $state(false);
	let overtimeJustification = $state('Covering mid-week demand; teacher confirmed availability');
	let overtimeError = $state<string | null>(null);
	let inlineError = $state<string | null>(null);

	function handleCommitClick() {
		inlineError = null;
		if (!activeLesson || !chosenCandidate) return;

		if (chosenCandidate.ruleCode === 'R6') {
			overtimeError = null;
			overtimeModalOpen = true;
			return;
		}
		const res = store.allocateLesson(
			activeLesson.lessonId,
			chosenCandidate.teacher.staffId,
			selectedStudioId
		);
		if (!res.ok) inlineError = res.error ?? 'Allocation failed';
	}

	function confirmOvertimeAllocation() {
		if (!activeLesson || !chosenCandidate) return;
		const parsed = OvertimeConfirmSchema.safeParse({ justification: overtimeJustification });
		if (!parsed.success) {
			overtimeError = parsed.error.issues[0]?.message ?? 'Invalid justification';
			return;
		}
		const res = store.allocateLesson(
			activeLesson.lessonId,
			chosenCandidate.teacher.staffId,
			selectedStudioId,
			parsed.data.justification
		);
		if (!res.ok) {
			overtimeError = res.error ?? 'Allocation failed';
			return;
		}
		overtimeModalOpen = false;
	}
</script>

<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
	<h1 class="text-xl font-semibold tracking-tight">Lesson Allocation</h1>

	<div class="flex flex-wrap items-center gap-2.5">
		<span class="text-sm text-[var(--color-fg-muted)]">Strategy:</span>
		<div
			class="inline-flex rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-0.5"
			role="group"
			aria-label="Candidate ranking strategy"
		>
			<button
				type="button"
				onclick={() => {
					store.rankingStrategy = 'WorkloadDeficit';
					setTimeout(() => {
						if (topThreeCandidates[0]) selectedTeacherId = topThreeCandidates[0].teacher.staffId;
					}, 0);
				}}
				class="rounded px-3 py-1 text-sm font-medium transition-colors {store.rankingStrategy ===
				'WorkloadDeficit'
					? 'bg-white text-[var(--color-fg-default)] border border-[var(--color-border-default)]'
					: 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'}"
			>
				Workload Deficit
			</button>
			<button
				type="button"
				onclick={() => {
					store.rankingStrategy = 'PreferenceMatch';
					setTimeout(() => {
						if (topThreeCandidates[0]) selectedTeacherId = topThreeCandidates[0].teacher.staffId;
					}, 0);
				}}
				class="rounded px-3 py-1 text-sm font-medium transition-colors {store.rankingStrategy ===
				'PreferenceMatch'
					? 'bg-white text-[var(--color-fg-default)] border border-[var(--color-border-default)]'
					: 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'}"
			>
				Preference Match
			</button>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
	<!-- Queue Rail -->
	<aside class="lg:col-span-4">
		<div class="rounded-md border border-[var(--color-border-default)] bg-white">
			<div
				class="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3.5 py-2.5"
			>
				<span class="text-sm font-semibold">{store.currentWeek.label} Queue</span>
				<div class="inline-flex gap-1 text-xs">
					{#each [['all', 'All'], ['unassigned', 'Unassigned'], ['rejected', 'Rejected']] as const as [val, lbl] (val)}
						<button
							type="button"
							onclick={() => (queueFilter = val)}
							class="rounded px-2 py-1 font-medium {queueFilter === val
								? 'bg-[#1f2328] text-white'
								: 'text-[var(--color-fg-muted)] hover:bg-[#eaeef2]'}"
						>
							{lbl}
						</button>
					{/each}
				</div>
			</div>

			{#if queueLessons.length === 0}
				<div class="p-6 text-center text-sm text-[var(--color-fg-muted)]">
					All slots for {store.currentWeek.label} are confirmed.
				</div>
			{:else}
				<ul class="divide-y divide-[var(--color-border-muted)]">
					{#each queueLessons as item (item.lessonId)}
						{@const selected = activeLesson?.lessonId === item.lessonId}
						<li>
							<button
								type="button"
								onclick={() => (selectedLessonId = item.lessonId)}
								class="w-full px-4 py-3 text-left transition-colors {selected
									? 'bg-[var(--color-canvas-subtle)] border-l-2 border-l-[#1f2328]'
									: 'hover:bg-[var(--color-canvas-subtle)]/60'}"
							>
								<div class="flex items-center justify-between gap-2">
									<span class="font-mono text-sm font-semibold">
										{item.lessonId} · {item.day} {item.slot}
									</span>
									{#if item.status === 'RejectionPending'}
										<span
											class="rounded border border-dashed border-[#1f2328] px-2 py-0.5 text-xs font-medium"
										>
											Rejected
										</span>
									{:else}
										<span
											class="rounded border border-[var(--color-border-default)] bg-white px-2 py-0.5 text-xs text-[var(--color-fg-muted)]"
										>
											Unassigned
										</span>
									{/if}
								</div>
								<div
									class="mt-1 flex items-center justify-between text-sm text-[var(--color-fg-muted)]"
								>
									<span>{item.studentName} · {item.grade}</span>
									<span class="font-medium text-[var(--color-fg-default)]">{item.instrument}</span>
								</div>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>

	<!-- Matrix & Studio Panel -->
	<div class="space-y-4 lg:col-span-8">
		{#if !activeLesson}
			<div
				class="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-8 text-center text-sm text-[var(--color-fg-muted)]"
			>
				Select a lesson slot from the queue.
			</div>
		{:else}
			<div
				class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3"
			>
				<div>
					<div class="flex flex-wrap items-center gap-2 text-base font-semibold">
						<span class="font-mono">{activeLesson.lessonId}</span>
						<span>·</span>
						<span>{activeLesson.studentName} ({activeLesson.grade})</span>
						<span>·</span>
						<span>{activeLesson.instrument}</span>
						<span>·</span>
						<span class="font-mono">
							{activeLesson.day} {store.currentWeek.dates[activeLesson.day]}, {activeLesson.slot}–{endTimeOf(
								activeLesson.slot
							)}
						</span>
					</div>
					{#if activeLesson.status === 'RejectionPending'}
						<div class="mt-1 text-sm text-[var(--color-fg-muted)]">
							Current teacher <strong class="text-[var(--color-fg-default)]"
								>{activeLesson.teacherId}</strong
							>
							flagged rejection ({activeLesson.rejectionReason}: “{activeLesson.rejectionNote}”).
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-2">
					<span
						class="inline-flex items-center gap-1 rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1 font-mono text-xs text-[var(--color-fg-muted)]"
					>
						<Clock class="h-3.5 w-3.5" />
						<span>14 ms</span>
					</span>
					{#if activeLesson.status === 'RejectionPending'}
						<button
							type="button"
							onclick={() => store.retainRejectedLesson(activeLesson.lessonId)}
							class="rounded border border-[var(--color-border-default)] bg-white px-3 py-1 text-sm font-medium hover:bg-[#eaeef2]"
						>
							Retain {activeLesson.teacherId}
						</button>
					{/if}
				</div>
			</div>

			{#if inlineError}
				<div
					class="rounded-md border border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)] px-4 py-2.5 text-sm text-[var(--color-tier-over-fg)]"
				>
					{inlineError}
				</div>
			{/if}

			<!-- Candidate Comparison -->
			<section class="rounded-md border border-[var(--color-border-default)] bg-white">
				<div
					class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
				>
					<h2 class="text-sm font-semibold">Candidate Comparison</h2>
				</div>

				{#if topThreeCandidates.length === 0}
					<div class="p-6 text-center text-sm text-[var(--color-fg-muted)]">
						No qualified teachers satisfy availability, 4.0h continuous block, and 44.0h statutory limits.
					</div>
				{:else}
					<div
						class="grid grid-cols-1 divide-y divide-[var(--color-border-default)] md:grid-cols-3 md:divide-x md:divide-y-0"
					>
						{#each topThreeCandidates as cand, idx (cand.teacher.staffId)}
							{@const isPicked = selectedTeacherId === cand.teacher.staffId}
							<div
								class="flex flex-col justify-between p-4 transition-colors {isPicked
									? 'bg-[var(--color-canvas-subtle)]/80'
									: 'bg-white'}"
							>
								<div>
									<div class="flex items-start justify-between gap-2">
										<div>
											<div class="flex items-center gap-1.5">
												<span class="font-mono text-sm font-semibold">#{idx + 1}</span>
												<span class="text-base font-semibold">{cand.teacher.fullName}</span>
											</div>
											<div class="font-mono text-xs text-[var(--color-fg-muted)]">
												{cand.teacher.staffId} · {cand.teacher.instruments.join(', ')}
											</div>
										</div>
										{#if idx === 0}
											<span
												class="rounded border border-[#1f2328] bg-[#1f2328] px-2 py-0.5 text-xs font-medium text-white"
											>
												Recommended
											</span>
										{/if}
									</div>

									<dl class="mt-3.5 space-y-2 text-sm">
										<div class="flex items-center justify-between gap-1">
											<dt class="text-[var(--color-fg-muted)]">Weekly</dt>
											<dd class="flex items-center gap-1.5 font-mono font-medium tabular-nums">
												<span>{cand.currentWeekly.toFixed(1)}→{cand.projectedWeekly.toFixed(1)}h</span>
												<TierBadge hours={cand.projectedWeekly} />
											</dd>
										</div>
										<div class="flex items-center justify-between">
											<dt class="text-[var(--color-fg-muted)]">Block</dt>
											<dd class="font-mono tabular-nums">
												{cand.continuousAfter.toFixed(1)} / 4.0 h
											</dd>
										</div>
										<div class="flex items-center justify-between">
											<dt class="text-[var(--color-fg-muted)]">Prefers</dt>
											<dd class="text-right">
												<span class={cand.dayMatch ? 'font-semibold' : 'text-[var(--color-fg-muted)]'}>
													{cand.teacher.preferredDays.join(', ')}
												</span>
												·
												<span
													class="font-mono {cand.studioMatch
														? 'font-semibold'
														: 'text-[var(--color-fg-muted)]'}"
												>
													{cand.teacher.preferredStudio}
												</span>
											</dd>
										</div>
										<div class="flex items-center justify-between">
											<dt class="text-[var(--color-fg-muted)]">Studio ({activeLesson.day})</dt>
											<dd class="font-mono">{cand.locationOnDay}</dd>
										</div>
										<div class="pt-1">
											<dt class="mb-1 text-xs text-[var(--color-fg-muted)]">Week Availability</dt>
											<dd class="flex gap-1">
												{#each DAYS as d (d)}
													{@const unavail = cand.teacher.unavailableSlots.some((u) =>
														u.startsWith(d)
													)}
													<span
														class="flex-1 rounded border py-0.5 text-center font-mono text-xs {d ===
														activeLesson.day
															? 'border-[#1f2328] bg-[#1f2328] text-white font-semibold'
															: unavail
																? 'border-[var(--color-border-muted)] text-[var(--color-fg-subtle)]'
																: 'border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]'}"
													>
														{d.slice(0, 2)}
													</span>
												{/each}
											</dd>
										</div>
									</dl>
								</div>

								<div class="mt-3.5 border-t border-[var(--color-border-muted)] pt-3">
									<div class="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
										{#if cand.ruleCode === 'R6'}
											<AlertTriangle class="h-3.5 w-3.5 shrink-0 text-[var(--color-tier-warn-fg)]" />
											<span class="font-medium text-[var(--color-tier-warn-fg)]"
												>R6 · Overtime warning</span
											>
										{:else}
											<Check class="h-3.5 w-3.5 shrink-0 text-[var(--color-tier-ok-fg)]" />
											<span>R7 · Eligible</span>
										{/if}
									</div>
									<button
										type="button"
										onclick={() => (selectedTeacherId = cand.teacher.staffId)}
										class="w-full rounded border px-3 py-1.5 text-sm font-medium transition-colors {isPicked
											? 'border-[#1f2328] bg-[#1f2328] text-white'
											: 'border-[var(--color-border-default)] bg-white hover:bg-[var(--color-canvas-subtle)]'}"
									>
										{isPicked ? 'Selected' : 'Select'}
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if evaluation.excluded.length > 0}
					<details
						class="border-t border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]/50 px-4 py-2.5 text-sm"
					>
						<summary
							class="cursor-pointer font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
						>
							Ineligible Staff ({evaluation.excluded.length})
						</summary>
						<div class="mt-2 divide-y divide-[var(--color-border-muted)]">
							{#each evaluation.excluded as ex (ex.teacher.staffId)}
								<div class="flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs">
									<span class="font-medium">
										{ex.teacher.fullName}
										<span class="font-mono text-[var(--color-fg-muted)]"
											>({ex.teacher.staffId})</span
										>
									</span>
									<span class="inline-flex items-center gap-1.5 font-mono text-[var(--color-fg-muted)]">
										<Ban class="h-3.5 w-3.5" />
										<span>Rule {ex.ruleCode} · {ex.ruleReason}</span>
									</span>
								</div>
							{/each}
						</div>
					</details>
				{/if}
			</section>

			<!-- Studio Assignment -->
			<section class="rounded-md border border-[var(--color-border-default)] bg-white">
				<div
					class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5"
				>
					<h2 class="text-sm font-semibold">Studio Assignment</h2>
				</div>
				<div class="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-5">
					{#each store.studios as st (st.studioId)}
						{@const hasInst = st.equippedInstruments.includes(activeLesson.instrument)}
						{@const maint = store.isStudioUnderMaintenance(
							st.studioId,
							activeLesson.weekId,
							activeLesson.day,
							activeLesson.slot
						)}
						{@const occupied = store.isStudioOccupied(
							st.studioId,
							activeLesson.weekId,
							activeLesson.day,
							activeLesson.slot,
							activeLesson.lessonId
						)}
						{@const disabled = !hasInst || Boolean(maint) || Boolean(occupied)}
						{@const picked = selectedStudioId === st.studioId && !disabled}

						<button
							type="button"
							{disabled}
							onclick={() => (selectedStudioId = st.studioId)}
							class="flex flex-col justify-between rounded border p-3 text-left text-sm transition-colors {disabled
								? 'hatch-maint border-[var(--color-border-muted)] text-[var(--color-fg-subtle)] cursor-not-allowed opacity-80'
								: picked
									? 'border-[#1f2328] bg-[var(--color-canvas-subtle)] ring-1 ring-[#1f2328]'
									: 'border-[var(--color-border-default)] bg-white hover:bg-[var(--color-canvas-subtle)]'}"
						>
							<div>
								<div class="flex items-center justify-between font-semibold">
									<span>{st.name}</span>
									<span class="font-mono text-xs">{st.studioId}</span>
								</div>
								<div class="mt-1 text-xs text-[var(--color-fg-muted)]">
									{st.equippedInstruments.join(', ')}
								</div>
							</div>
							<div
								class="mt-2.5 border-t border-[var(--color-border-muted)] pt-1.5 font-mono text-xs"
							>
								{#if maint}
									R5 · Maint {maint.startSlot}–{maint.endSlot}
								{:else if !hasInst}
									R5 · No {activeLesson.instrument}
								{:else if occupied}
									R5 · Occupied ({occupied.teacherId})
								{:else if picked}
									Selected
								{:else}
									Available
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</section>

			<div
				class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3"
			>
				<div class="text-sm">
					{#if chosenCandidate}
						Assign <strong class="font-mono">{activeLesson.lessonId}</strong> to
						<strong>{chosenCandidate.teacher.fullName}</strong> in
						<strong class="font-mono">{selectedStudioId}</strong>
					{:else}
						Select an eligible candidate and studio.
					{/if}
				</div>
				<button
					type="button"
					disabled={!chosenCandidate}
					onclick={handleCommitClick}
					class="rounded bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#32383f] disabled:opacity-40"
				>
					{chosenCandidate?.ruleCode === 'R6'
						? 'Review Overtime & Confirm…'
						: 'Confirm Allocation'}
				</button>
			</div>
		{/if}
	</div>
</div>

<Dialog
	open={overtimeModalOpen}
	title="Overtime Confirmation Required (40.0–44.0 h)"
	onClose={() => (overtimeModalOpen = false)}
>
	{#if chosenCandidate && activeLesson}
		<div class="space-y-3.5">
			<div
				class="rounded border border-[var(--color-tier-warn-border)] bg-[var(--color-tier-warn-bg)] p-3.5 text-sm text-[var(--color-tier-warn-fg)]"
			>
				Assigning <strong>{activeLesson.lessonId}</strong> moves
				<strong>{chosenCandidate.teacher.fullName}</strong> from
				<strong class="font-mono">{chosenCandidate.currentWeekly.toFixed(1)} h</strong> to
				<strong class="font-mono">{chosenCandidate.projectedWeekly.toFixed(1)} h</strong> weekly
				(within the 44.0 h Employment Act Part IV ceiling).
			</div>

			<div>
				<label for="ot-just" class="mb-1.5 block text-sm font-medium">Manager Justification</label>
				<input
					id="ot-just"
					type="text"
					bind:value={overtimeJustification}
					class="w-full rounded border border-[var(--color-border-default)] px-3 py-2 text-sm"
				/>
				{#if overtimeError}
					<p class="mt-1.5 text-sm text-[var(--color-tier-over-fg)]">{overtimeError}</p>
				{/if}
			</div>
		</div>
	{/if}
	{#snippet footer()}
		<button
			type="button"
			onclick={() => (overtimeModalOpen = false)}
			class="rounded border border-[var(--color-border-default)] bg-white px-3.5 py-1.5 text-sm font-medium hover:bg-[#eaeef2]"
		>
			Cancel
		</button>
		<button
			type="button"
			onclick={confirmOvertimeAllocation}
			class="rounded bg-[#1f2328] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#32383f]"
		>
			Authorize Overtime &amp; Confirm
		</button>
	{/snippet}
</Dialog>
