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

<div class="jcs-stat">
  <p class="jcs-stat__label">{label}</p>
  <p class="jcs-stat__value">{value}</p>
  {#if delta}<p class="jcs-stat__delta jcs-stat__delta--{tone}">{delta}</p>{/if}
</div>

<style>
  .jcs-stat {
    display: grid;
    gap: var(--fw-space-1);
    padding: var(--fw-space-4) var(--fw-space-5);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
    font-family: var(--fw-font-body);
  }

  .jcs-stat__label {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
    font-weight: var(--fw-weight-semibold);
    letter-spacing: var(--fw-tracking-caps);
    line-height: var(--fw-line-height-body-xxs);
    text-transform: uppercase;
  }

  .jcs-stat__value {
    margin: 0;
    color: var(--fw-text);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-2);
    line-height: var(--fw-line-height-display-2);
  }

  .jcs-stat__delta {
    margin: 0;
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }

  .jcs-stat__delta--neutral {
    color: var(--fw-text-muted);
  }

  .jcs-stat__delta--success {
    color: var(--fw-success);
  }

  .jcs-stat__delta--warning {
    color: var(--fw-warning);
  }

  .jcs-stat__delta--danger {
    color: var(--fw-danger);
  }

  .jcs-stat__delta--info {
    color: var(--fw-info);
  }

  .jcs-stat__delta--review {
    color: var(--fw-review);
  }
</style>
