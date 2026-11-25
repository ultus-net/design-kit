<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    caption?: string;
    dense?: boolean;
    stickyHead?: boolean;
    children: Snippet;
  }

  let { caption, dense = false, stickyHead = false, children }: Props = $props();
</script>

<div class="fw-table" class:fw-table--dense={dense} class:fw-table--sticky={stickyHead}>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (scroll container must take focus for keyboard scrolling) -->
  <div class="fw-table__scroll" tabindex="0" role="region" aria-label={caption ?? 'Table'}>
    <table>
      {#if caption}<caption>{caption}</caption>{/if}
      {@render children()}
    </table>
  </div>
</div>

<style>
  .fw-table {
    border: 1px solid var(--fw-border);
    background: var(--fw-raised);
    overflow: hidden;
  }

  .fw-table__scroll {
    overflow-x: auto;
  }

  .fw-table :global(th),
  .fw-table :global(td) {
    padding: var(--fw-space-2) var(--fw-space-3);
    border-bottom: 1px solid var(--fw-border);
    text-align: left;
    font-size: var(--fw-font-size-body-xs);
  }

  .fw-table--dense :global(th),
  .fw-table--dense :global(td) {
    padding: var(--fw-space-1) var(--fw-space-2);
  }

  .fw-table :global(caption) {
    padding: var(--fw-space-3);
    text-align: left;
    font-weight: var(--fw-weight-semibold);
  }

  .fw-table :global(th) {
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
    font-weight: var(--fw-weight-semibold);
    letter-spacing: var(--fw-tracking-caps);
    text-transform: uppercase;
  }

  .fw-table--sticky :global(thead th) {
    position: sticky;
    top: 0;
    background: var(--fw-raised);
  }

  .fw-table :global(tbody tr:last-child > *),
  .fw-table :global(tbody tr:last-child td) {
    border-bottom: 0;
  }

  .fw-table :global(td.is-numeric),
  .fw-table :global(th.is-numeric) {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .fw-table :global(td) {
    font-variant-numeric: tabular-nums;
  }

  .fw-table__scroll:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }
</style>
