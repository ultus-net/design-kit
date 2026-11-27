<script lang="ts">
  import Menu from '$lib/components/Menu.svelte';

  interface Item {
    id: string;
    label: string;
  }

  const actionsItems: Item[] = [
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    { id: 'cut', label: 'Cut' }
  ];

  const sortItems: Item[] = [
    { id: 'name_asc', label: 'Name, A-Z' },
    { id: 'name_desc', label: 'Name, Z-A' },
    { id: 'date', label: 'Date, oldest first' }
  ];

  let selection = $state('');
</script>

<div class="demo-stack">
  <div class="menu-container">
    <div class="row">
      <Menu label="Actions" items={actionsItems} onSelect={(id) => (selection = `Actions: ${id}`)} />
      <Menu label="Sort" items={sortItems} onSelect={(id) => (selection = `Sort: ${id}`)} />
    </div>
    {#if selection}
      <span class="selection">{selection}</span>
    {/if}
  </div>
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .menu-container {
    display: grid;
    gap: var(--fw-space-3);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-space-3);
  }

  .selection {
    font-size: var(--fw-font-size-body-xs);
    color: var(--fw-text-muted);
  }
</style>
