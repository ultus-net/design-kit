<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Tab {
    id: string;
    label: string;
  }

  interface Props {
    tabs: Tab[];
    value?: string;
    label: string;
    children: Snippet<[{ id: string }]>;
  }

  let { tabs, value = $bindable(tabs[0]?.id ?? ''), label, children }: Props = $props();

  let list: HTMLDivElement;

  function select(index: number) {
    const tab = tabs[index];
    if (!tab) return;

    value = tab.id;
    list?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus();
  }

  function onKeydown(event: KeyboardEvent) {
    if (!tabs.length) return;

    const currentIndex = tabs.findIndex((tab) => tab.id === value);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    select(nextIndex);
  }
</script>

<div class="fw-tabs">
  <div
    class="fw-tabs__list"
    role="tablist"
    aria-label={label}
    tabindex="-1"
    onkeydown={onKeydown}
    bind:this={list}
  >
    {#each tabs as tab, index (tab.id)}
      <button
        type="button"
        role="tab"
        class="fw-tabs__tab"
        id={`fw-tab-${tab.id}`}
        aria-selected={tab.id === value}
        aria-controls={`fw-panel-${tab.id}`}
        tabindex={tab.id === value ? 0 : -1}
        onclick={() => select(index)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <div
    class="fw-tabs__panel"
    role="tabpanel"
    id={`fw-panel-${value}`}
    aria-labelledby={`fw-tab-${value}`}
    tabindex="0"
  >
    {#key value}
      {@render children({ id: value })}
    {/key}
  </div>
</div>

<style>
  .fw-tabs__list {
    display: flex;
    gap: var(--fw-space-1);
    border-bottom: 1px solid var(--fw-border);
  }

  .fw-tabs__tab {
    border: none;
    background: transparent;
    padding: var(--fw-space-2) var(--fw-space-3);
    font-family: inherit;
    font-size: var(--fw-font-size-body-xs);
    color: var(--fw-text-muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    cursor: pointer;
  }

  .fw-tabs__tab[aria-selected='true'] {
    color: var(--fw-text);
    border-bottom-color: var(--fw-accent-strong);
    font-weight: var(--fw-weight-semibold);
  }

  .fw-tabs__tab[aria-selected='false']:hover {
    color: var(--fw-text);
    background: var(--fw-sunken);
  }

  .fw-tabs__tab:focus-visible,
  .fw-tabs__panel:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-tabs__panel {
    padding: var(--fw-space-4) 0;
  }
</style>
