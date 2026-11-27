<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import CommandPalette, { type PaletteItem } from '$lib/components/CommandPalette.svelte';

  const items: PaletteItem[] = [
    { value: 'button', label: 'Button', group: 'Components' },
    { value: 'dialog', label: 'Dialog', group: 'Components' },
    { value: 'combobox', label: 'Combobox', group: 'Components' },
    { value: 'home', label: 'Home', group: 'Pages' },
    { value: 'guidelines', label: 'Guidelines', group: 'Pages' },
    { value: 'changelog', label: 'Changelog', group: 'Pages' }
  ];

  let open = $state(false);
  let chosen = $state('');

  function handleSelect(item: PaletteItem) {
    chosen = item.label;
    open = false;
  }
</script>

<div class="demo-stack">
  <div class="demo-trigger">
    <Button onclick={() => (open = true)}>Jump to</Button>
  </div>

  {#if chosen}<p class="demo-selected">Selected: {chosen}</p>{/if}

  <CommandPalette
    id="jump-demo"
    bind:open
    title="Jump to"
    label="Search components"
    {items}
    onselect={handleSelect}
    onclose={() => (open = false)}
  />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .demo-trigger {
    justify-self: start;
  }

  .demo-selected {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }
</style>
