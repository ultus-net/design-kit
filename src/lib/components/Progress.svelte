<script lang="ts">
  interface Props {
    label: string;
    value?: number;
    max?: number;
  }

  let { label, value, max = 100 }: Props = $props();

  const safeMax = $derived(max > 0 ? max : 100);
  const clamped = $derived(Math.min(Math.max(value ?? 0, 0), safeMax));
  const percent = $derived((clamped / safeMax) * 100);
</script>

<div
  class="fw-progress"
  role="progressbar"
  aria-label={label}
  aria-valuemin={value === undefined ? undefined : 0}
  aria-valuemax={value === undefined ? undefined : safeMax}
  aria-valuenow={value === undefined ? undefined : clamped}
>
  <span
    class="fw-progress__fill"
    class:fw-progress__fill--indeterminate={value === undefined}
    style:width={value === undefined ? undefined : `${percent}%`}
  ></span>
</div>

<style>
  .fw-progress {
    height: var(--fw-space-2);
    width: 100%;
    background: var(--fw-sunken);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-pill);
    overflow: hidden;
  }

  .fw-progress__fill {
    display: block;
    height: 100%;
    background: var(--fw-text);
    border-radius: inherit;
    transition: none;
  }

  .fw-progress__fill--indeterminate {
    width: 40%;
  }
</style>
