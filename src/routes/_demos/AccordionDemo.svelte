<script lang="ts">
  import Accordion from '$lib/components/Accordion.svelte';

  const releaseNotes = [
    { id: 'queue', title: 'Queue changes' },
    { id: 'exports', title: 'Export changes' }
  ];

  const filters = [
    { id: 'status', title: 'Status' },
    { id: 'carrier', title: 'Carrier' }
  ];
</script>

<div class="demo-stack">
  <Accordion items={releaseNotes} label="Release notes">
    {#snippet children({ id })}
      {#if id === 'queue'}
        <p class="demo-copy">Held orders now retry automatically at the next cut-off.</p>
      {:else}
        <p class="demo-copy">Exports include the carrier reference as a separate column.</p>
      {/if}
    {/snippet}
  </Accordion>

  <Accordion items={filters} label="Filters" multiple>
    {#snippet children({ id })}
      {#if id === 'status'}
        <p class="demo-copy">Narrow the queue to matched, held or unmatched orders.</p>
      {:else}
        <p class="demo-copy">Limit the queue to one carrier, or leave every carrier in.</p>
      {/if}
    {/snippet}
  </Accordion>
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
