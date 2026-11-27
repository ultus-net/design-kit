<script lang="ts">
  import type { Snippet } from 'svelte';
  import { syncDialogModal } from './dialog-modal';

  interface Props {
    id: string;
    open?: boolean;
    title: string;
    description?: string;
    children: Snippet;
    actions?: Snippet;
    onclose?: () => void;
  }

  let {
    id,
    open = $bindable(false),
    title,
    description,
    children,
    actions,
    onclose
  }: Props = $props();

  let element = $state<HTMLDialogElement>();

  $effect(() => {
    syncDialogModal(element, open);
  });

  function handleClose() {
    open = false;
    onclose?.();
  }
</script>

<dialog
  class="fw-dialog"
  bind:this={element}
  aria-labelledby={`${id}-title`}
  aria-describedby={description ? `${id}-description` : undefined}
  onclose={handleClose}
>
  <div class="fw-dialog__body">
    <h2 id={`${id}-title`} class="fw-dialog__title">{title}</h2>
    {#if description}
      <p id={`${id}-description`} class="fw-dialog__description">{description}</p>
    {/if}
    {@render children()}
  </div>
  {#if actions}
    <div class="fw-dialog__actions">{@render actions()}</div>
  {/if}
</dialog>

<style>
  .fw-dialog {
    padding: 0;
    border: 1px solid var(--fw-border-strong);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
    color: var(--fw-text);
    max-width: min(100% - 2 * var(--fw-space-5), 480px);
    width: 100%;
  }

  .fw-dialog::backdrop {
    background: var(--fw-chrome);
    opacity: 0.6;
  }

  .fw-dialog__body {
    padding: var(--fw-space-5);
    display: grid;
    gap: var(--fw-space-3);
  }

  .fw-dialog__title {
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
  }

  .fw-dialog__description {
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }

  .fw-dialog__actions {
    display: flex;
    justify-content: end;
    gap: var(--fw-space-2);
    padding: var(--fw-space-3) var(--fw-space-5);
    border-top: 1px solid var(--fw-border);
  }
</style>
