<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Item {
    id: string;
    title: string;
  }

  interface Props {
    items: Item[];
    label: string;
    multiple?: boolean;
    openIds?: string[];
    children: Snippet<[{ id: string }]>;
  }

  let { items, label, multiple = false, openIds = $bindable([]), children }: Props = $props();

  // The open set is the single source of truth, so a native toggle and a state
  // write cannot disagree. The click handler suppresses the browser's own
  // toggle and drives the attribute instead.
  function toggle(id: string) {
    const next = new Set(openIds);

    if (next.has(id)) {
      next.delete(id);
    } else if (multiple) {
      next.add(id);
    } else {
      next.clear();
      next.add(id);
    }

    openIds = [...next];
  }
</script>

<div class="fw-accordion" role="group" aria-label={label}>
  {#each items as item (item.id)}
    <details class="fw-accordion__item" open={openIds.includes(item.id)}>
      <summary
        class="fw-accordion__summary"
        aria-expanded={openIds.includes(item.id)}
        onclick={(event) => {
          event.preventDefault();
          toggle(item.id);
        }}
      >
        {item.title}
      </summary>
      <div class="fw-accordion__content">{@render children({ id: item.id })}</div>
    </details>
  {/each}
</div>

<style>
  .fw-accordion {
    display: flex;
    flex-direction: column;
    gap: var(--fw-space-2);
  }

  .fw-accordion__item {
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
    overflow: hidden;
  }

  .fw-accordion__summary {
    cursor: pointer;
    padding: var(--fw-space-3) var(--fw-space-4);
    font-weight: 600;
  }

  .fw-accordion__content {
    padding: 0 var(--fw-space-4) var(--fw-space-4);
  }
</style>
