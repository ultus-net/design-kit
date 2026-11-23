<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'review';

  interface Props {
    variant?: Variant;
    children: Snippet;
  }

  let { variant = 'neutral', children }: Props = $props();
</script>

<span class="jcs-badge jcs-badge--{variant}">{@render children()}</span>

<style>
  .jcs-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--fw-space-1);
    padding: 2px var(--fw-space-3);
    border: 1px solid transparent;
    border-radius: var(--fw-radius-pill);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xxs);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-body-xxs);
    white-space: nowrap;
  }

  .jcs-badge--neutral {
    background: var(--fw-sunken);
    border-color: var(--fw-border);
    color: var(--fw-text);
  }

  .jcs-badge--success {
    background: var(--fw-success-tint);
    color: var(--fw-success);
  }

  .jcs-badge--warning {
    background: var(--fw-warning-tint);
    color: var(--fw-warning);
  }

  .jcs-badge--danger {
    background: var(--fw-danger-tint);
    color: var(--fw-danger);
  }

  .jcs-badge--info {
    background: var(--fw-info-tint);
    color: var(--fw-info);
  }

  .jcs-badge--review {
    background: var(--fw-review-tint);
    color: var(--fw-review);
  }
</style>
