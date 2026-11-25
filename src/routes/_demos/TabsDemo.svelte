<script lang="ts">
  import Tabs from '$lib/components/Tabs.svelte';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rows', label: 'Rows' },
    { id: 'history', label: 'History' }
  ];
</script>

<div class="demo-stack">
  <Tabs {tabs} label="Order sections">
    {#snippet children({ id })}
      {#if id === 'overview'}
        <p class="demo-copy">A short summary of the order and its current state.</p>
      {:else if id === 'rows'}
        <p class="demo-copy">Line items with quantities and totals.</p>
      {:else}
        <p class="demo-copy">Every status change, newest first.</p>
      {/if}
    {/snippet}
  </Tabs>
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .demo-copy {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-s);
  }
</style>
