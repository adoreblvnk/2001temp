<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		open: boolean;
		title: string;
		onClose: () => void;
		children: Snippet;
		footer?: Snippet;
		maxWidth?: string;
	}

	let { open, title, onClose, children, footer, maxWidth = 'max-w-md' }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
		role="dialog"
		aria-modal="true"
		aria-label={title}
	>
		<div
			class="w-full {maxWidth} rounded-md border border-[var(--color-border-default)] bg-white shadow-lg"
		>
			<div
				class="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3 rounded-t-md"
			>
				<h3 class="text-sm font-semibold text-[var(--color-fg-default)]">{title}</h3>
				<button
					type="button"
					onclick={onClose}
					aria-label="Close dialog"
					class="rounded p-1 text-[var(--color-fg-muted)] hover:bg-[#eaeef2] hover:text-[var(--color-fg-default)]"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
			<div class="p-4 text-sm">
				{@render children()}
			</div>
			{#if footer}
				<div
					class="flex items-center justify-end gap-2 border-t border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-2.5 rounded-b-md"
				>
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
