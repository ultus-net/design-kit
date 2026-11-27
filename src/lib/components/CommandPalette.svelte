<script module lang="ts">
  export interface PaletteItem {
    value: string;
    label: string;
    group?: string;
  }
</script>

<script lang="ts">
  import { filterOptions, stepIndex } from './combobox-model';
  import { syncDialogModal } from './dialog-modal';

  interface Props {
    id: string;
    open?: boolean;
    title: string;
    label: string;
    items: PaletteItem[];
    onselect?: (item: PaletteItem) => void;
    onclose?: () => void;
  }

  let { id, open = $bindable(false), title, label, items, onselect, onclose }: Props = $props();

  let element = $state<HTMLDialogElement>();
  let inputElement = $state<HTMLInputElement>();
  let query = $state('');
  let active = $state(0);

  const filtered = $derived(filterOptions(items, query));
  // Each entry keeps its index in the flat filtered list, so the option id and
  // aria-activedescendant agree even when two entries share a group.
  const groups = $derived.by(() => {
    const out: { name: string | undefined; entries: { item: PaletteItem; index: number }[] }[] = [];

    filtered.forEach((item, index) => {
      const name = item.group;
      const bucket = out.find((entry) => entry.name === name);

      if (bucket) {
        bucket.entries.push({ item, index });
      } else {
        out.push({ name, entries: [{ item, index }] });
      }
    });

    return out;
  });

  $effect(() => {
    syncDialogModal(element, open);
  });

  $effect(() => {
    if (open && inputElement?.isConnected && typeof inputElement?.focus === 'function') {
      inputElement.focus();
    }
  });

  // The palette is a launcher, so the active option is always the first match:
  // it resets when the dialog opens and on every query change. One writer only.
  $effect(() => {
    if (open) active = filtered.length ? 0 : -1;
  });

  function optionId(index: number) {
    return `${id}-option-${index}`;
  }

  function handleClose() {
    open = false;
    onclose?.();
  }

  function select(index: number) {
    const item = filtered[index];
    if (!item) return;

    onselect?.(item);
    open = false;
    query = '';
  }

  function handleInput(event: Event) {
    query = (event.currentTarget as HTMLInputElement).value;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filtered.length) active = stepIndex(active, filtered.length, 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filtered.length) active = stepIndex(active, filtered.length, -1);
      return;
    }

    if (event.key === 'Enter') {
      if (!filtered.length) return;

      event.preventDefault();
      select(active);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      open = false;
      query = '';
    }
  }

  function handleOptionMousedown(event: MouseEvent, index: number) {
    event.preventDefault();
    select(index);
  }
</script>

<dialog class="fw-palette" bind:this={element} aria-labelledby={`${id}-title`} onclose={handleClose}>
  <h2 id={`${id}-title`} class="fw-palette__title">{title}</h2>
  <div class="fw-palette__search">
    <input
      bind:this={inputElement}
      id={`${id}-input`}
      class="fw-palette__input"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={`${id}-list`}
      aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
      aria-label={label}
      autocomplete="off"
      bind:value={query}
      oninput={handleInput}
      onkeydown={handleKeydown}
    />
  </div>
  {#if open && filtered.length > 0}
    <ul id={`${id}-list`} class="fw-palette__list" role="listbox" aria-label={title}>
      {#each groups as group (group.name ?? '')}
        {#if group.name}
          <li role="group" aria-label={group.name} class="fw-palette__group">
            <span class="fw-palette__group-label" aria-hidden="true">{group.name}</span>
            <ul role="presentation">
              {#each group.entries as entry (entry.index)}
                <li
                  id={optionId(entry.index)}
                  class="fw-palette__option"
                  class:fw-palette__option--active={entry.index === active}
                  role="option"
                  aria-selected={entry.index === active}
                  onmousedown={(event) => handleOptionMousedown(event, entry.index)}
                >
                  {entry.item.label}
                </li>
              {/each}
            </ul>
          </li>
        {:else}
          {#each group.entries as entry (entry.index)}
            <li
              id={optionId(entry.index)}
              class="fw-palette__option"
              class:fw-palette__option--active={entry.index === active}
              role="option"
              aria-selected={entry.index === active}
              onmousedown={(event) => handleOptionMousedown(event, entry.index)}
            >
              {entry.item.label}
            </li>
          {/each}
        {/if}
      {/each}
    </ul>
  {/if}
</dialog>

<style>
  .fw-palette {
    position: fixed;
    inset-block-start: 10vh;
    inset-block-end: auto;
    inset-inline: 0;
    margin-inline: auto;
    padding: 0;
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    color: var(--fw-text);
    inline-size: min(100% - 2 * var(--fw-space-5), 560px);
    max-block-size: 70vh;
    border-radius: var(--fw-radius-md);
  }

  .fw-palette::backdrop {
    background: var(--fw-chrome);
    opacity: 0.6;
  }

  .fw-palette__title {
    padding: var(--fw-space-4) var(--fw-space-5) 0;
    margin: 0;
    font-size: var(--fw-font-size-display-4);
    line-height: var(--fw-line-height-display-4);
  }

  .fw-palette__search {
    padding: var(--fw-space-3) var(--fw-space-5);
  }

  .fw-palette__input {
    width: 100%;
    padding: var(--fw-space-2) var(--fw-space-3);
    border: 1px solid var(--fw-border-strong);
    border-radius: var(--fw-radius-sm);
    background: var(--fw-sunken);
    color: var(--fw-text);
    font: inherit;
  }

  .fw-palette__list {
    margin: 0;
    padding: 0 0 var(--fw-space-3);
    list-style: none;
    overflow-y: auto;
    max-block-size: 50vh;
  }

  .fw-palette__group-label {
    display: block;
    padding: var(--fw-space-2) var(--fw-space-5) 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .fw-palette__option {
    padding: var(--fw-space-2) var(--fw-space-5);
    cursor: pointer;
  }

  .fw-palette__option--active {
    background: var(--fw-sunken);
  }
</style>
