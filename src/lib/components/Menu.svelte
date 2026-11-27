<script lang="ts">
  import { tick } from 'svelte';

  interface Item {
    id: string;
    label: string;
  }

  interface Props {
    label: string;
    items: Item[];
    onSelect?: (id: string) => void;
  }

  let {
    label,
    items,
    onSelect
  }: Props = $props();

  let open = $state(false);
  const uid = $props.id();
  const menuId = `${uid}-menu`;

  let wrapper = $state<HTMLSpanElement>();
  let triggerElement = $state<HTMLButtonElement>();
  let popup = $state<HTMLDivElement>();

  function toggle() {
    open = !open;
  }

  async function openAndFocus(index: number) {
    open = true;
    await tick();
    focusItem(index);
  }

  function focusItem(index: number) {
    const menuitems = popup?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    if (menuitems && menuitems[index]) {
      menuitems[index].focus();
    }
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAndFocus(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAndFocus(Math.max(0, items.length - 1));
    }
  }

  function handleMenuKeydown(event: KeyboardEvent) {
    const menuitems = popup
      ? Array.from(popup.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
      : [];
    if (menuitems.length === 0) return;

    const current = menuitems.findIndex((item) => document.activeElement === item);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (current + 1) % menuitems.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (current - 1 + menuitems.length) % menuitems.length;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = menuitems.length - 1;
        break;
      case 'Escape':
        event.preventDefault();
        closeAndFocusTrigger();
        return;
      case 'Tab':
        triggerElement?.focus();
        open = false;
        return;
      case 'Enter':
        event.preventDefault();
        if (current >= 0) select(items[current].id);
        return;
      default:
        return;
    }

    menuitems[nextIndex]?.focus();
  }

  function select(id: string) {
    onSelect?.(id);
    closeAndFocusTrigger();
  }

  async function closeAndFocusTrigger() {
    open = false;
    await tick();
    triggerElement?.focus();
  }

  $effect(() => {
    if (!open) return;
    window.addEventListener('pointerdown', handleWindowPointerDown);
    return () => window.removeEventListener('pointerdown', handleWindowPointerDown);
  });

  function handleWindowPointerDown(event: PointerEvent) {
    if (wrapper && !wrapper.contains(event.target as Node)) {
      open = false;
    }
  }
</script>

<span class="fw-menu" bind:this={wrapper}>
  <button
    type="button"
    class="fw-menu__trigger"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
    onclick={toggle}
    onkeydown={handleTriggerKeydown}
    bind:this={triggerElement}
  >
    {label}
  </button>
  {#if open}
    <div
      class="fw-menu__popup"
      role="menu"
      id={menuId}
      tabindex="-1"
      aria-label={label}
      bind:this={popup}
      onkeydown={handleMenuKeydown}
    >
      {#each items as item (item.id)}
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          class="fw-menu__item"
          onclick={() => select(item.id)}
        >
          {item.label}
        </button>
      {/each}
    </div>
  {/if}
</span>

<style>
  .fw-menu {
    display: inline-block;
    position: relative;
  }

  .fw-menu__trigger {
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    padding: var(--fw-space-2) var(--fw-space-3);
    text-align: left;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--fw-radius-sm);
    cursor: pointer;
    width: 100%;
    color: var(--fw-text);
  }

  .fw-menu__trigger:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-menu__popup {
    position: absolute;
    top: calc(100% + var(--fw-space-1));
    left: 0;
    min-width: 160px;
    z-index: 10;
    background: var(--fw-raised);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    padding: var(--fw-space-1);
    display: grid;
    gap: var(--fw-space-1);
  }

  .fw-menu__item {
    text-align: left;
    width: 100%;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--fw-radius-sm);
    padding: var(--fw-space-2) var(--fw-space-3);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    cursor: pointer;
  }

  .fw-menu__item:hover {
    background: var(--fw-sunken);
  }

  .fw-menu__item:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: -2px;
    background: var(--fw-sunken);
  }
</style>
