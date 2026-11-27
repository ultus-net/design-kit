<script lang="ts">
  interface Props {
    shape?: 'line' | 'block' | 'circle';
    width?: string;
    height?: string;
  }

  let { shape = 'line', width, height }: Props = $props();
</script>

<div
  class="fw-skeleton fw-skeleton--{shape}"
  aria-hidden="true"
  style:width
  style:height
></div>

<style>
  .fw-skeleton {
    background: var(--fw-sunken);
    border: 1px solid var(--fw-border);
    box-sizing: border-box;
  }

  .fw-skeleton--line {
    height: var(--fw-space-3);
    width: 100%;
    border-radius: var(--fw-radius-sm);
  }

  .fw-skeleton--block {
    min-height: var(--fw-space-7);
    width: 100%;
    border-radius: var(--fw-radius-md);
  }

  .fw-skeleton--circle {
    width: var(--fw-space-7);
    height: var(--fw-space-7);
    border-radius: var(--fw-radius-full);
  }
</style>
