<script lang="ts">
	import { store, type StaffAccount } from '$lib/store.svelte';
	import {
		ProvisionAccountFormSchema,
		type Instrument,
		type Role
	} from '$lib/schemas';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { Search, UserPlus } from '@lucide/svelte';

	const ALL_INSTRUMENTS: Instrument[] = ['Piano', 'Drums', 'Violin', 'Trumpet'];

	let search = $state('');
	let roleFilter = $state<'ALL' | Role>('ALL');

	let filteredAccounts = $derived(
		store.accounts.filter((a) => {
			if (roleFilter !== 'ALL' && a.role !== roleFilter) return false;
			if (search.trim()) {
				const q = search.toLowerCase();
				return (
					a.fullName.toLowerCase().includes(q) ||
					a.staffId.toLowerCase().includes(q) ||
					a.email.toLowerCase().includes(q)
				);
			}
			return true;
		})
	);

	// Provision Account Modal
	let provisionOpen = $state(false);
	let formStaffId = $state('T-11');
	let formName = $state('');
	let formEmail = $state('');
	let formContact = $state('+65 8220 4100');
	let formRole = $state<Role>('Teacher');
	let formInstruments = $state<Instrument[]>(['Piano']);
	let formHomeStudio = $state('S-01');
	let formError = $state<string | null>(null);

	// Logical Deactivation Confirmation Modal (NFR-REL-02)
	let confirmDeactivateTarget = $state<StaffAccount | null>(null);
	let affectedLessonCount = $derived(
		confirmDeactivateTarget
			? store.lessons.filter((l) => l.teacherId === confirmDeactivateTarget!.staffId).length
			: 0
	);

	function toggleFormInstrument(inst: Instrument) {
		formInstruments = formInstruments.includes(inst)
			? formInstruments.filter((i) => i !== inst)
			: [...formInstruments, inst];
	}

	function submitProvision() {
		formError = null;
		const parsed = ProvisionAccountFormSchema.safeParse({
			staffId: formStaffId,
			fullName: formName,
			email: formEmail,
			contact: formContact,
			role: formRole,
			instruments: formInstruments,
			homeStudio: formHomeStudio
		});
		if (!parsed.success) {
			formError = parsed.error.issues[0]?.message ?? 'Check account fields';
			return;
		}
		const res = store.provisionAccount(parsed.data);
		if (!res.ok) {
			formError = res.error ?? 'Duplicate account';
			return;
		}
		provisionOpen = false;
		formName = '';
		formEmail = '';
	}

	function confirmDeactivate() {
		if (!confirmDeactivateTarget) return;
		store.toggleAccountStatus(confirmDeactivateTarget.staffId);
		confirmDeactivateTarget = null;
	}
</script>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div class="flex items-center gap-2.5">
		<h1 class="text-lg font-semibold tracking-tight">User Accounts</h1>
		<span
			class="rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)] tabular-nums"
		>
			{store.accounts.filter((a) => a.active).length} active / {store.accounts.length} total
		</span>
	</div>

	<button
		type="button"
		onclick={() => {
			formError = null;
			provisionOpen = true;
		}}
		class="inline-flex items-center gap-1.5 rounded-md bg-[#1f2328] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#32383f]"
	>
		<UserPlus class="h-3.5 w-3.5" />
		<span>New Account</span>
	</button>
</div>

<!-- Filter Bar -->
<div
	class="mb-4 flex flex-wrap items-center justify-between gap-2.5 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3"
>
	<div class="relative flex-1 min-w-[220px]">
		<Search
			class="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--color-fg-muted)]"
		/>
		<input
			type="search"
			bind:value={search}
			placeholder="Search name, Staff ID, or school email…"
			aria-label="Search user accounts"
			class="w-full rounded-md border border-[var(--color-border-default)] bg-white py-1.5 pl-8 pr-2.5 text-xs"
		/>
	</div>

	<div class="inline-flex rounded-md border border-[var(--color-border-default)] bg-white p-0.5 text-xs">
		{#each ['ALL', 'Teacher', 'Manager', 'IT Admin'] as const as rf (rf)}
			<button
				type="button"
				onclick={() => (roleFilter = rf)}
				class="rounded px-2.5 py-1 font-medium {roleFilter === rf
					? 'bg-[#1f2328] text-white'
					: 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'}"
			>
				{rf === 'ALL' ? 'All Roles' : rf}
			</button>
		{/each}
	</div>
</div>

<!-- Accounts Table -->
<section class="rounded-md border border-[var(--color-border-default)] bg-white">
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]">
					<th class="px-4 py-2 font-medium">Staff ID</th>
					<th class="px-4 py-2 font-medium">Name &amp; Email</th>
					<th class="px-4 py-2 font-medium">Role</th>
					<th class="px-4 py-2 font-medium">Qualifications</th>
					<th class="px-4 py-2 font-medium">Status</th>
					<th class="px-4 py-2 text-right font-medium">Action</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-border-muted)]">
				{#each filteredAccounts as acc (acc.staffId)}
					<tr class={!acc.active ? 'bg-[var(--color-canvas-subtle)]/70 text-[var(--color-fg-muted)]' : 'hover:bg-[var(--color-canvas-subtle)]/60'}>
						<td class="px-4 py-2.5 font-mono font-medium">{acc.staffId}</td>
						<td class="px-4 py-2.5">
							<div class="font-medium {!acc.active ? 'line-through' : 'text-[var(--color-fg-default)]'}">
								{acc.fullName}
							</div>
							<div class="font-mono text-[11px] text-[var(--color-fg-muted)]">{acc.email}</div>
						</td>
						<td class="px-4 py-2.5">{acc.role}</td>
						<td class="px-4 py-2.5 text-[var(--color-fg-muted)]">
							{acc.instruments.length > 0 ? acc.instruments.join(', ') : '—'}
						</td>
						<td class="px-4 py-2.5">
							{#if acc.active}
								<span
									class="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-default)] bg-white px-2 py-0.5 text-[11px] font-medium text-[var(--color-fg-default)]"
								>
									<span class="h-1.5 w-1.5 rounded-full bg-[#1f2328]"></span>
									Active
								</span>
							{:else}
								<span
									class="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--color-border-strong)] bg-[var(--color-canvas-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-fg-muted)]"
								>
									Deactivated
								</span>
							{/if}
						</td>
						<td class="px-4 py-2.5 text-right">
							{#if acc.active}
								<button
									type="button"
									disabled={acc.staffId === 'IT-01'}
									onclick={() => (confirmDeactivateTarget = acc)}
									class="rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1 text-[11px] font-medium hover:bg-[var(--color-canvas-subtle)] disabled:opacity-40"
								>
									Deactivate
								</button>
							{:else}
								<button
									type="button"
									onclick={() => store.toggleAccountStatus(acc.staffId)}
									class="rounded border border-[var(--color-border-default)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--color-fg-default)] hover:bg-[#eaeef2]"
								>
									Reactivate
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<!-- Provision New Account Modal -->
<Dialog
	open={provisionOpen}
	title="Provision User Account"
	onClose={() => (provisionOpen = false)}
>
	<div class="space-y-3 text-xs">
		<div class="grid grid-cols-2 gap-2.5">
			<div>
				<label for="p-id" class="mb-1 block font-medium">Staff ID</label>
				<input
					id="p-id"
					type="text"
					bind:value={formStaffId}
					placeholder="T-11"
					class="w-full rounded-md border border-[var(--color-border-default)] px-2.5 py-1.5 font-mono"
				/>
			</div>
			<div>
				<label for="p-role" class="mb-1 block font-medium">Role</label>
				<select
					id="p-role"
					bind:value={formRole}
					class="w-full rounded-md border border-[var(--color-border-default)] bg-white px-2.5 py-1.5"
				>
					<option value="Teacher">Teacher</option>
					<option value="Manager">Manager</option>
					<option value="IT Admin">IT Admin</option>
				</select>
			</div>
		</div>

		<div>
			<label for="p-name" class="mb-1 block font-medium">Full Name</label>
			<input
				id="p-name"
				type="text"
				bind:value={formName}
				placeholder="Rachel Lim"
				class="w-full rounded-md border border-[var(--color-border-default)] px-2.5 py-1.5"
			/>
		</div>

		<div class="grid grid-cols-2 gap-2.5">
			<div>
				<label for="p-email" class="mb-1 block font-medium">School Email</label>
				<input
					id="p-email"
					type="email"
					bind:value={formEmail}
					placeholder="rachel.lim@harmony.edu.sg"
					class="w-full rounded-md border border-[var(--color-border-default)] px-2.5 py-1.5 font-mono"
				/>
			</div>
			<div>
				<label for="p-phone" class="mb-1 block font-medium">Contact</label>
				<input
					id="p-phone"
					type="text"
					bind:value={formContact}
					class="w-full rounded-md border border-[var(--color-border-default)] px-2.5 py-1.5 font-mono"
				/>
			</div>
		</div>

		{#if formRole === 'Teacher'}
			<div>
				<span class="mb-1 block font-medium">Certified Instruments</span>
				<div class="flex flex-wrap gap-1.5">
					{#each ALL_INSTRUMENTS as inst (inst)}
						{@const active = formInstruments.includes(inst)}
						<button
							type="button"
							onclick={() => toggleFormInstrument(inst)}
							class="rounded border px-2.5 py-1 font-medium {active
								? 'border-[#1f2328] bg-[#1f2328] text-white'
								: 'border-[var(--color-border-default)] bg-white text-[var(--color-fg-muted)]'}"
						>
							{inst}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		{#if formError}
			<p class="rounded border border-[var(--color-tier-over-border)] bg-[var(--color-tier-over-bg)] px-2.5 py-1.5 text-[var(--color-tier-over-fg)]">
				{formError}
			</p>
		{/if}
	</div>

	{#snippet footer()}
		<button
			type="button"
			onclick={() => (provisionOpen = false)}
			class="rounded-md border border-[var(--color-border-default)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[#eaeef2]"
		>
			Cancel
		</button>
		<button
			type="button"
			onclick={submitProvision}
			class="rounded-md bg-[#1f2328] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#32383f]"
		>
			Create Account
		</button>
	{/snippet}
</Dialog>

<!-- Logical Deactivation Confirmation Modal -->
<Dialog
	open={confirmDeactivateTarget !== null}
	title="Confirm Logical Account Deactivation"
	onClose={() => (confirmDeactivateTarget = null)}
>
	{#if confirmDeactivateTarget}
		<div class="space-y-2.5 text-xs">
			<p>
				Deactivate <strong>{confirmDeactivateTarget.fullName}</strong>
				(<span class="font-mono">{confirmDeactivateTarget.staffId}</span>)? The account record is
				retained via logical status flag to preserve historical audit and utilisation integrity.
			</p>
			{#if confirmDeactivateTarget.role === 'Teacher'}
				<div
					class="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-2.5 font-mono text-[11px]"
				>
					{affectedLessonCount} tracked lesson slot(s) will move to the Manager Unassigned queue.
				</div>
			{/if}
		</div>
	{/if}
	{#snippet footer()}
		<button
			type="button"
			onclick={() => (confirmDeactivateTarget = null)}
			class="rounded-md border border-[var(--color-border-default)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[#eaeef2]"
		>
			Cancel
		</button>
		<button
			type="button"
			onclick={confirmDeactivate}
			class="rounded-md bg-[#1f2328] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#32383f]"
		>
			Deactivate Account
		</button>
	{/snippet}
</Dialog>
