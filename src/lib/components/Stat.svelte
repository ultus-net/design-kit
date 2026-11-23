<script lang="ts">
  type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'review';

  interface Props {
    label: string;
    value: string | number;
    delta?: string;
    tone?: Tone;
  }

  let { label, value, delta, tone = 'neutral' }: Props = $props();
</script>

<div class="fw-stat">
  <p class="fw-stat__label">{label}</p>
  <p class="fw-stat__value">{value}</p>
  {#if delta}<p class="fw-stat__delta fw-stat__delta--{tone}">{delta}</p>{/if}
</div>

<style>
  .fw-stat {
    display: grid;
    gap: var(--fw-space-1);
    padding: var(--fw-space-4) var(--fw-space-5);
    border: 1px solid var(--fw-border);
    background: var(--fw-raised);
    font-family: var(--fw-font-body);
  }

  .fw-stat__label {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
    font-weight: var(--fw-weight-semibold);
    letter-spacing: var(--fw-tracking-caps);
    line-height: var(--fw-line-height-body-xxs);
    text-transform: uppercase;
  }

  .fw-stat__value {
    margin: 0;
    color: var(--fw-text);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-2);
    line-height: var(--fw-line-height-display-2);
  }

  .fw-stat__delta {
    margin: 0;
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }

  .fw-stat__delta--neutral {
    color: var(--fw-text-muted);
  }

  .fw-stat__delta--success {
    color: var(--fw-success);
  }

  .fw-stat__delta--warning {
    color: var(--fw-warning);
  }

  .fw-stat__delta--danger {
    color: var(--fw-danger);
  }

  .fw-stat__delta--info {
    color: var(--fw-info);
  }

  .fw-stat__delta--review {
    color: var(--fw-review);
  }
</style>
