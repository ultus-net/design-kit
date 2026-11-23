<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'success' | 'warning' | 'danger' | 'info';

  interface Props {
    variant?: Variant;
    title?: string;
    children: Snippet;
  }

  let { variant = 'info', title, children }: Props = $props();
</script>

<div class="fw-alert fw-alert--{variant}" role={variant === 'danger' ? 'alert' : 'status'}>
  <div class="fw-alert__body">
    {#if title}<p class="fw-alert__title">{title}</p>{/if}
    <div class="fw-alert__content">{@render children()}</div>
  </div>
</div>

<style>
  .fw-alert {
    padding: var(--fw-space-4);
    border: 1px solid var(--fw-border);
    border-left: 3px solid currentColor;
    border-radius: var(--fw-radius-md);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-alert--success {
    background: var(--fw-success-tint);
    color: var(--fw-success);
  }

  .fw-alert--warning {
    background: var(--fw-warning-tint);
    color: var(--fw-warning);
  }

  .fw-alert--danger {
    background: var(--fw-danger-tint);
    color: var(--fw-danger);
  }

  .fw-alert--info {
    background: var(--fw-info-tint);
    color: var(--fw-info);
  }

  .fw-alert__title {
    margin: 0 0 var(--fw-space-1);
    color: var(--fw-text);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-5);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-display-5);
  }

  .fw-alert__content :global(p) {
    margin: 0;
  }
</style>
