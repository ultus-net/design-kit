<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'review';

  interface Props {
    variant?: Variant;
    children: Snippet;
  }

  let { variant = 'neutral', children }: Props = $props();
</script>

<span class="fw-badge fw-badge--{variant}">{@render children()}</span>

<style>
  .fw-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--fw-space-1);
    padding: 2px var(--fw-space-3);
    border: 1px solid transparent;
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xxs);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-body-xxs);
    white-space: nowrap;
  }

  .fw-badge--neutral {
    background: var(--fw-sunken);
    border-color: var(--fw-border);
    color: var(--fw-text);
  }

  .fw-badge--success {
    background: var(--fw-success-tint);
    color: var(--fw-success);
  }

  .fw-badge--warning {
    background: var(--fw-warning-tint);
    color: var(--fw-warning);
  }

  .fw-badge--danger {
    background: var(--fw-danger-tint);
    color: var(--fw-danger);
  }

  .fw-badge--info {
    background: var(--fw-info-tint);
    color: var(--fw-info);
  }

  .fw-badge--review {
    background: var(--fw-review-tint);
    color: var(--fw-review);
  }
</style>
