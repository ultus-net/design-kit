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

<div class="jcs-alert jcs-alert--{variant}" role={variant === 'danger' ? 'alert' : 'status'}>
  <div class="jcs-alert__body">
    {#if title}<p class="jcs-alert__title">{title}</p>{/if}
    <div class="jcs-alert__content">{@render children()}</div>
  </div>
</div>

<style>
  .jcs-alert {
    padding: var(--fw-space-4);
    border: 1px solid var(--fw-border);
    border-left: 3px solid currentColor;
    border-radius: var(--fw-radius-md);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
  }

  .jcs-alert--success {
    background: var(--fw-success-tint);
    color: var(--fw-success);
  }

  .jcs-alert--warning {
    background: var(--fw-warning-tint);
    color: var(--fw-warning);
  }

  .jcs-alert--danger {
    background: var(--fw-danger-tint);
    color: var(--fw-danger);
  }

  .jcs-alert--info {
    background: var(--fw-info-tint);
    color: var(--fw-info);
  }

  .jcs-alert__title {
    margin: 0 0 var(--fw-space-1);
    color: var(--fw-text);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-5);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-display-5);
  }

  .jcs-alert__content :global(p) {
    margin: 0;
  }
</style>
