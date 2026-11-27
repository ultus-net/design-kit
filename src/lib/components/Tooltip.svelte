<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    text: string;
    children: Snippet;
    onclick?: (event: MouseEvent) => void;
  }

  let {
    text,
    children,
    onclick
  }: Props = $props();

  let open = $state(false);
  const uid = $props.id();
  const tooltipId = `${uid}-tooltip`;

  function handlePointerEnter() {
    open = true;
  }

  function handlePointerLeave() {
    open = false;
  }

  function handleFocus() {
    open = true;
  }

  function handleBlur() {
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  $effect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<span class="fw-tooltip">
  <button
    class="fw-tooltip__trigger"
    type="button"
    {onclick}
    aria-describedby={open ? tooltipId : undefined}
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
    onfocus={handleFocus}
    onblur={handleBlur}
  >
    {@render children()}
  </button>
  {#if open} <span class="fw-tooltip__content" role="tooltip" id={tooltipId}>{text}</span> {/if}
</span>

<style>
  .fw-tooltip {
    display: inline-block;
    position: relative;
  }

  .fw-tooltip__trigger {
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    color: var(--fw-text);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--fw-radius-sm);
    cursor: pointer;
    padding: 0 var(--fw-space-1);
  }

  .fw-tooltip__trigger:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-tooltip__content {
    position: absolute;
    top: calc(100% + var(--fw-space-1));
    left: 0;
    z-index: 10;
    background: var(--fw-raised);
    color: var(--fw-text);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    padding: var(--fw-space-2) var(--fw-space-3);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
    white-space: nowrap;
    pointer-events: none;
  }
</style>