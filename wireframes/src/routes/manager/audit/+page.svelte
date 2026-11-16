<script lang="ts">
	import { store, type AuditAction } from '$lib/store.svelte';
	import { Download, Search } from '@lucide/svelte';

	let searchQuery = $state('');
	let selectedActor = $state('ALL');
	let selectedAction = $state<'ALL' | AuditAction>('ALL');

	let actors = $derived(
		Array.from(new Set(store.auditLogs.map((l) => `${l.actorId} · ${l.actorName}`)))
	);

	const actionTypes: AuditAction[] = [
		'ALLOCATION_CONFIRMED',
		'OVERTIME_CONFIRMED',
		'ROSTER_NOTIFIED',
		'REJECTION_REQUESTED',
		'REJECTION_RESOLVED',
		'AVAILABILITY_SAVED',
		'STUDIO_CONFIGURED',
		'MAINTENANCE_SCHEDULED',
		'ACCOUNT_PROVISIONED',
		'ACCOUNT_STATUS_CHANGED'
	];

	let filteredLogs = $derived(
		store.auditLogs.filter((entry) => {
			if (selectedActor !== 'ALL' && `${entry.actorId} · ${entry.actorName}` !== selectedActor) {
				return false;
			}
			if (selectedAction !== 'ALL' && entry.action !== selectedAction) {
				return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				return (
					entry.logId.toLowerCase().includes(q) ||
					entry.target.toLowerCase().includes(q) ||
					entry.details.toLowerCase().includes(q) ||
					entry.actorName.toLowerCase().includes(q)
				);
			}
			return true;
		})
	);

	function exportAuditCsv() {
		const header = 'Log ID,Timestamp,Actor ID,Actor Name,Role,Action,Target,Details,SHA256\n';
		const rows = filteredLogs
			.map(
				(e) =>
					`${e.logId},${e.timestamp},${e.actorId},"${e.actorName}",${e.actorRole},${e.action},"${e.target}","${e.details.replaceAll('"', '""')}",${e.hash}`
			)
			.join('\n');
		const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'harmony-audit-ledger.csv';
		a.click();
		URL.revokeObjectURL(url);
		store.notifyToast(`Exported ${filteredLogs.length} immutable audit records`);
	}
</script>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div class="flex items-center gap-2.5">
		<h1 class="text-lg font-semibold tracking-tight">Audit Log</h1>
		<span
			class="rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)]"
		>
			Append-Only · 24-Month Retention
		</span>
	</div>

	<button
		type="button"
		onclick={exportAuditCsv}
		class="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-canvas-subtle)]"
	>
		<Download class="h-3.5 w-3.5" />
		<span>Export CSV</span>
	</button>
</div>

<!-- Filter Bar -->
<div
	class="mb-4 grid grid-cols-1 gap-2.5 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3 sm:grid-cols-3"
>
	<div class="relative">
		<Search
			class="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--color-fg-muted)]"
		/>
		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Search target, ID, or justification…"
			aria-label="Search audit records"
			class="w-full rounded-md border border-[var(--color-border-default)] bg-white py-1.5 pl-8 pr-2.5 text-xs"
		/>
	</div>

	<select
		bind:value={selectedActor}
		aria-label="Filter by actor"
		class="rounded-md border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 text-xs"
	>
		<option value="ALL">All Actors</option>
		{#each actors as actor (actor)}
			<option value={actor}>{actor}</option>
		{/each}
	</select>

	<select
		bind:value={selectedAction}
		aria-label="Filter by action type"
		class="rounded-md border border-[var(--color-border-default)] bg-white px-2.5 py-1.5 text-xs"
	>
		<option value="ALL">All Action Types</option>
		{#each actionTypes as act (act)}
			<option value={act}>{act}</option>
		{/each}
	</select>
</div>

<!-- Ledger Table -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]">
					<th class="px-3.5 py-2 font-medium">ID</th>
					<th class="px-3.5 py-2 font-medium">Timestamp</th>
					<th class="px-3.5 py-2 font-medium">Actor</th>
					<th class="px-3.5 py-2 font-medium">Action</th>
					<th class="px-3.5 py-2 font-medium">Target</th>
					<th class="px-3.5 py-2 font-medium">Details</th>
					<th class="px-3.5 py-2 font-medium">Digest</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each filteredLogs as entry (entry.logId)}
					<tr class="hover:bg-[var(--color-canvas-subtle)]/60">
						<td class="whitespace-nowrap px-3.5 py-2.5 font-mono font-medium">{entry.logId}</td>
						<td class="whitespace-nowrap px-3.5 py-2.5 font-mono text-[11px] text-[var(--color-fg-muted)] tabular-nums">
							{entry.timestamp}
						</td>
						<td class="whitespace-nowrap px-3.5 py-2.5">
							<span class="font-medium">{entry.actorName}</span>
							<span class="font-mono text-[11px] text-[var(--color-fg-muted)]">
								({entry.actorId})
							</span>
						</td>
						<td class="whitespace-nowrap px-3.5 py-2.5">
							<span
								class="rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-1.5 py-0.5 font-mono text-[10px] font-medium"
							>
								{entry.action}
							</span>
						</td>
						<td class="whitespace-nowrap px-3.5 py-2.5 font-mono text-[11px]">{entry.target}</td>
						<td class="px-3.5 py-2.5 text-[var(--color-fg-muted)]">{entry.details}</td>
						<td class="whitespace-nowrap px-3.5 py-2.5 font-mono text-[11px] text-[var(--color-fg-subtle)]">
							{entry.hash}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
