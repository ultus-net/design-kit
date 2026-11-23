<script lang="ts">
  interface Props {
    page: number;
    pageCount: number;
    hrefFor?: (page: number) => string;
    onPageChange?: (page: number) => void;
    label?: string;
    siblingCount?: number;
  }

  let { page, pageCount, hrefFor, onPageChange, label, siblingCount = 1 }: Props = $props();

  type Item = number | 'gap';

  const total = $derived(Math.max(1, Math.floor(pageCount)));
  const current = $derived(Math.min(Math.max(1, Math.floor(page)), total));

  const items = $derived.by((): Item[] => {
    const siblings = Math.max(0, Math.floor(siblingCount));
    const start = Math.max(2, current - siblings);
    const end = Math.min(total - 1, current + siblings);

    const numbers = new Set<number>([1, total]);
    for (let n = start; n <= end; n += 1) numbers.add(n);

    const result: Item[] = [];
    let previous = 0;
    for (const n of [...numbers].sort((a, b) => a - b)) {
      if (previous > 0) {
        const gap = n - previous;
        if (gap === 2) result.push(previous + 1);
        else if (gap > 2) result.push('gap');
      }
      result.push(n);
      previous = n;
    }
    return result;
  });

  const canPrevious = $derived(current > 1);
  const canNext = $derived(current < total);
</script>

<nav class="fw-pagination" aria-label={label ?? 'Pagination'}>
  <ul class="fw-pagination__list">
    <li>
      {#if canPrevious && hrefFor}
        <a
          class="fw-pagination__step"
          href={hrefFor(current - 1)}
          aria-label="Previous page"
        >
          Previous
        </a>
      {:else if canPrevious}
        <button
          class="fw-pagination__step"
          type="button"
          aria-label="Previous page"
          onclick={() => onPageChange?.(current - 1)}
        >
          Previous
        </button>
      {:else}
        <span class="fw-pagination__step" aria-disabled="true">Previous</span>
      {/if}
    </li>

    {#each items as item}
      {#if item === 'gap'}
        <li class="fw-pagination__gap" aria-hidden="true">…</li>
      {:else if hrefFor}
        <li>
          <a
            class="fw-pagination__page"
            href={hrefFor(item)}
            aria-current={item === current ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </a>
        </li>
      {:else}
        <li>
          <button
            class="fw-pagination__page"
            type="button"
            aria-current={item === current ? 'page' : undefined}
            aria-label={`Page ${item}`}
            onclick={() => onPageChange?.(item)}
          >
            {item}
          </button>
        </li>
      {/if}
    {/each}

    <li>
      {#if canNext && hrefFor}
        <a class="fw-pagination__step" href={hrefFor(current + 1)} aria-label="Next page">Next</a>
      {:else if canNext}
        <button
          class="fw-pagination__step"
          type="button"
          aria-label="Next page"
          onclick={() => onPageChange?.(current + 1)}
        >
          Next
        </button>
      {:else}
        <span class="fw-pagination__step" aria-disabled="true">Next</span>
      {/if}
    </li>
  </ul>
</nav>

<style>
  .fw-pagination__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fw-pagination__page,
  .fw-pagination__step {
    min-width: 32px;
    min-height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 var(--fw-space-2);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-mono);
    font-size: var(--fw-font-size-body-xs);
    font-variant-numeric: tabular-nums;
    text-decoration: none;
  }

  .fw-pagination__page[aria-current='page'] {
    border-color: var(--fw-accent);
    background: var(--fw-accent);
    color: var(--fw-on-accent);
  }

  .fw-pagination__step[aria-disabled='true'] {
    color: var(--fw-text-muted);
    border-color: var(--fw-border);
    background: var(--fw-sunken);
  }

  .fw-pagination__page:not([aria-current='page']):hover,
  .fw-pagination__step:not([aria-disabled='true']):hover {
    background: var(--fw-sunken);
  }

  .fw-pagination__page:focus-visible,
  .fw-pagination__step:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }
</style>
