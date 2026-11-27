<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Drawer from '$lib/components/Drawer.svelte';

  let open = $state(false);
</script>

<div class="demo-stack">
  <div class="demo-trigger">
    <Button onclick={() => (open = true)}>Open filters</Button>
  </div>

  <Drawer id="filters-demo" title="Filters" side="end" bind:open>
    <p class="demo-copy">Narrow the queue to one carrier, status or date range.</p>

    {#snippet actions()}
      <Button variant="secondary" onclick={() => (open = false)}>Close</Button>
    {/snippet}
  </Drawer>
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .demo-trigger {
    justify-self: start;
  }

  .demo-copy {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-s);
  }
</style>
