<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { store } from '$lib/store.svelte';
	import type { Role } from '$lib/schemas';
	import {
		Calendar,
		CheckCircle2,
		ShieldAlert,
		Sliders,
		Users,
		Building2,
		FileText,
		LayoutGrid
	} from '@lucide/svelte';

	let { children }: { children: Snippet } = $props();
	let pathname = $derived($page.url.pathname);

	let pendingSlotCount = $derived(
		store.lessons.filter(
			(l) =>
				l.weekId === store.selectedWeekId &&
				(l.status === 'Unassigned' || l.status === 'RejectionPending')
		).length
	);

	const navByRole = $derived.by(() => {
		if (store.activeRole === 'Manager') {
			return [
				{ href: '/manager', label: 'Workload', icon: LayoutGrid },
				{ href: '/manager/allocate', label: 'Allocate', icon: Sliders, count: pendingSlotCount },
				{ href: '/manager/utilisation', label: 'Studios', icon: Building2 },
				{ href: '/manager/audit', label: 'Audit Log', icon: FileText }
			];
		}
		if (store.activeRole === 'Teacher') {
			return [
				{ href: '/teacher', label: 'Schedule', icon: Calendar },
				{ href: '/teacher/availability', label: 'Availability', icon: Sliders }
			];
		}
		return [
			{ href: '/admin/accounts', label: 'Accounts', icon: Users },
			{ href: '/admin/studios', label: 'Studios & Maintenance', icon: Building2 }
		];
	});

	let isAuthorizedRoute = $derived.by(() => {
		if (pathname === '/') return true;
		if (pathname.startsWith('/manager')) return store.activeRole === 'Manager';
		if (pathname.startsWith('/teacher')) return store.activeRole === 'Teacher';
		if (pathname.startsWith('/admin')) return store.activeRole === 'IT Admin';
		return true;
	});

	function switchRole(role: Role) {
		store.activeRole = role;
		if (role === 'Manager') goto('/manager');
		else if (role === 'Teacher') goto('/teacher');
		else goto('/admin/accounts');
	}
</script>

<div class="min-h-screen flex flex-col bg-white text-[var(--color-fg-default)]">
	<header class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
		<div class="w-full px-2.5">
			<div class="flex flex-wrap items-center justify-between gap-3 py-3">
				<div class="flex items-center gap-2.5">
					<a
						href={store.activeRole === 'Manager'
							? '/manager'
							: store.activeRole === 'Teacher'
								? '/teacher'
								: '/admin/accounts'}
						class="flex items-center gap-2 font-semibold text-base tracking-tight text-[var(--color-fg-default)]"
					>
						<span
							class="inline-flex h-7 w-7 items-center justify-center rounded border border-[var(--color-border-default)] bg-white text-sm font-bold"
						>
							H
						</span>
						<span>Harmony Academy</span>
					</a>
					<span class="text-[var(--color-border-strong)]">/</span>
					<span class="text-sm font-medium text-[var(--color-fg-muted)]">
						{store.currentActor.fullName}
						<span class="font-mono text-xs">({store.currentActor.staffId})</span>
					</span>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					{#if store.activeRole === 'Teacher'}
						<label class="sr-only" for="teacher-select">Active teacher</label>
						<select
							id="teacher-select"
							bind:value={store.activeTeacherId}
							class="h-8 rounded border border-[var(--color-border-default)] bg-white px-2.5 text-sm font-medium text-[var(--color-fg-default)]"
						>
							{#each store.activeTeachers as t (t.staffId)}
								<option value={t.staffId}>{t.staffId} · {t.fullName}</option>
							{/each}
						</select>
					{/if}

					<div
						class="inline-flex rounded border border-[var(--color-border-default)] bg-white p-0.5"
						role="group"
						aria-label="Active role"
					>
						{#each ['Manager', 'Teacher', 'IT Admin'] as const as r (r)}
							<button
								type="button"
								onclick={() => switchRole(r)}
								class="rounded px-3 py-1 text-sm font-medium transition-colors {store.activeRole ===
								r
									? 'bg-[#1f2328] text-white'
									: 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'}"
							>
								{r}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<nav class="-mb-px flex gap-1.5 overflow-x-auto" aria-label="Primary">
				{#each navByRole as item (item.href)}
					{@const active =
						item.href === '/manager'
							? pathname === '/manager'
							: item.href === '/teacher'
								? pathname === '/teacher'
								: pathname.startsWith(item.href)}
					{@const Icon = item.icon}
					<a
						href={item.href}
						aria-current={active ? 'page' : undefined}
						class="inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm transition-colors {active
							? 'border-[#1f2328] font-semibold text-[var(--color-fg-default)]'
							: 'border-transparent font-normal text-[var(--color-fg-muted)] hover:border-[var(--color-border-default)] hover:text-[var(--color-fg-default)]'}"
					>
						<Icon class="h-4 w-4" />
						<span>{item.label}</span>
						{#if item.count !== undefined && item.count > 0}
							<span
								class="rounded border border-[var(--color-border-default)] bg-white px-1.5 py-0.5 font-mono text-xs font-semibold leading-none text-[var(--color-fg-default)] tabular-nums"
							>
								{item.count}
							</span>
						{/if}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	{#if store.toastMessage}
		<div class="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
			<div
				class="flex w-full items-center justify-between gap-3 px-2.5 py-2.5 text-sm"
			>
				<span class="flex items-center gap-2 font-medium text-[var(--color-fg-default)]">
					<CheckCircle2 class="h-4 w-4 shrink-0" />
					<span>{store.toastMessage}</span>
				</span>
				<button
					type="button"
					onclick={() => (store.toastMessage = null)}
					class="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
				>
					Dismiss
				</button>
			</div>
		</div>
	{/if}

	<main class="w-full flex-1 px-2.5 py-4">
		{#if isAuthorizedRoute}
			{@render children()}
		{:else}
			<div
				class="mx-auto my-12 max-w-md rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-6 text-center"
			>
				<ShieldAlert class="mx-auto mb-3 h-7 w-7 text-[var(--color-fg-muted)]" />
				<h2 class="text-base font-semibold">403 · Role Access Restricted</h2>
				<p class="mt-1.5 text-sm text-[var(--color-fg-muted)]">
					Active role ({store.activeRole}) cannot access <code class="font-mono">{pathname}</code>.
				</p>
				<button
					type="button"
					onclick={() => switchRole(store.activeRole)}
					class="mt-4 rounded bg-[#1f2328] px-4 py-2 text-sm font-medium text-white hover:bg-[#32383f]"
				>
					Return to {store.activeRole} Workspace
				</button>
			</div>
		{/if}
	</main>
</div>
