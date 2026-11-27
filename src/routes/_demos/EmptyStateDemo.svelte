<script lang="ts">
  import EmptyState from '$lib/components/EmptyState.svelte';
</script>

{#snippet mark()}<span class="mark-icon" aria-hidden="true">◇</span>{/snippet}
{#snippet action()}<button type="button">Add item</button>{/snippet}

<div class="demo-stack">
  <EmptyState title="No items" description="You haven't added any items yet." mark={mark} action={action} />
  <EmptyState title="No filters" />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .mark-icon {
    font-size: var(--fw-font-size-display-2);
    line-height: var(--fw-line-height-display-2);
    color: var(--fw-text-muted);
  }
</style>
