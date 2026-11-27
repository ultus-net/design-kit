<script lang="ts">
  import type { Snippet } from 'svelte';

  type Side = 'start' | 'end';

  interface Props {
    id: string;
    open?: boolean;
    title: string;
    side?: Side;
    children: Snippet;
    actions?: Snippet;
    onclose?: () => void;
  }

  let {
    id,
    open = $bindable(false),
    title,
    side = 'end',
    children,
    actions,
    onclose
  }: Props = $props();

  let element = $state<HTMLDialogElement>();

  $effect(() => {
    if (!element?.isConnected) return;

    if (open && !element.open) {
      if (typeof element.showModal === 'function') element.showModal();
    } else if (!open && element.open && typeof element.close === 'function') {
      element.close();
    }
  });

  function handleClose() {
    open = false;
    onclose?.();
  }
</script>

<dialog
  class="fw-drawer fw-drawer--{side}"
  bind:this={element}
  aria-labelledby={`${id}-title`}
  onclose={handleClose}
>
  <div class="fw-drawer__body">
    <h2 id={`${id}-title`} class="fw-drawer__title">{title}</h2>
    {@render children()}
  </div>
  {#if actions}
    <div class="fw-drawer__actions">{@render actions()}</div>
  {/if}
</dialog>

<style>
  .fw-drawer {
    position: fixed;
    margin: 0;
    padding: 0;
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    color: var(--fw-text);
    inline-size: min(100% - 2 * var(--fw-space-5), 400px);
    max-inline-size: 100%;
    block-size: 100%;
    max-block-size: 100%;
    inset-block: 0;
  }

  .fw-drawer--end {
    inset-inline-end: 0;
    inset-inline-start: auto;
    border-radius: var(--fw-radius-md) 0 0 var(--fw-radius-md);
  }

  .fw-drawer--start {
    inset-inline-start: 0;
    inset-inline-end: auto;
    border-radius: 0 var(--fw-radius-md) var(--fw-radius-md) 0;
  }

  .fw-drawer::backdrop {
    background: var(--fw-chrome);
    opacity: 0.6;
  }

  .fw-drawer__body {
    display: grid;
    gap: var(--fw-space-3);
    padding: var(--fw-space-5);
    overflow-y: auto;
  }

  .fw-drawer__title {
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
  }

  .fw-drawer__actions {
    display: flex;
    justify-content: end;
    gap: var(--fw-space-2);
    padding: var(--fw-space-3) var(--fw-space-5);
    border-top: 1px solid var(--fw-border);
  }
</style>
