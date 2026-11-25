<script lang="ts">
  import { filterOptions, stepIndex, type ComboboxOption } from './combobox-model';

  interface Props {
    id?: string;
    label: string;
    options: ComboboxOption[];
    value?: string;
    onselect?: (option: ComboboxOption) => void;
    hint?: string;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    [key: string]: unknown;
  }

  let {
    id,
    label,
    options,
    value = $bindable(''),
    onselect,
    hint,
    error,
    disabled = false,
    placeholder,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? `${uid}-input`);
  const listId = `${uid}-listbox`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const describedBy = $derived(
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  );
  const required = $derived(Boolean(rest.required));

  let open = $state(false);
  let active = $state(-1);
  let queryAtOpen = '';
  // The query as of the last committed keystroke, so the keystroke that opens
  // the listbox can capture the text from before it. Sync it whenever the value
  // changes from outside while the listbox is closed.
  let lastQuery = value;
  let shell: HTMLDivElement;

  $effect(() => {
    if (!open) lastQuery = value;
  });

  function optionId(index: number) {
    return `${uid}-option-${index}`;
  }

  const filtered = $derived(filterOptions(options, value));

  function openList(query: string) {
    queryAtOpen = query;
    open = true;
    active = filtered.length ? 0 : -1;
  }

  function close() {
    open = false;
    active = -1;
  }

  function select(index: number) {
    const option = filtered[index];
    if (!option) return;

    value = option.label;
    lastQuery = option.label;
    onselect?.(option);
    close();
  }

  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const query = target.value;

    if (!open) openList(lastQuery);

    value = query;
    lastQuery = query;
    active = filterOptions(options, query).length ? 0 : -1;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!open) {
        openList(value);
        return;
      }

      if (filtered.length) active = stepIndex(active, filtered.length, 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open || !filtered.length) return;

      active = stepIndex(active, filtered.length, -1);
      return;
    }

    if (event.key === 'Enter') {
      if (!open) return;

      event.preventDefault();
      select(active);
      return;
    }

    if (event.key === 'Escape') {
      if (!open) return;

      event.preventDefault();
      event.stopPropagation();
      value = queryAtOpen;
      lastQuery = queryAtOpen;
      close();
    }
  }

  function handleFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;

    if (next && shell?.contains(next)) return;

    close();
  }

  function handleOptionMousedown(event: MouseEvent, index: number) {
    event.preventDefault();
    select(index);
  }
</script>

<div class="fw-field fw-combobox" class:fw-field--error={Boolean(error)}>
  {#if label}
    <label class="fw-field__label" for={inputId}>
      {label}
      {#if required}<span class="fw-field__required" aria-hidden="true">*</span>{/if}
    </label>
  {/if}
  <div
    class="fw-combobox__shell"
    bind:this={shell}
    onfocusout={handleFocusOut}
  >
    <input
      id={inputId}
      class="fw-combobox__input"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={listId}
      aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
      autocomplete="off"
      {placeholder}
      {disabled}
      bind:value
      oninput={handleInput}
      onkeydown={handleKeydown}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...rest}
    />
    {#if open && filtered.length > 0}
      <ul id={listId} class="fw-combobox__list" role="listbox">
        {#each filtered as option, index (option.value)}
          <li
            id={optionId(index)}
            class="fw-combobox__option"
            class:fw-combobox__option--active={index === active}
            role="option"
            aria-selected={index === active}
            onmousedown={(event) => handleOptionMousedown(event, index)}
          >
            {option.label}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  {#if hint}<p class="fw-field__hint" id={hintId}>{hint}</p>{/if}
  {#if error}<p class="fw-field__error" id={errorId}>{error}</p>{/if}
</div>

<style>
  .fw-field {
    display: grid;
    gap: var(--fw-space-2);
    font-family: var(--fw-font-body);
  }

  .fw-field__label {
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-field__required {
    color: var(--fw-danger);
  }

  .fw-combobox__shell {
    position: relative;
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    border-radius: var(--fw-radius-sm);
    transition: border-color var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-combobox__shell:focus-within {
    border-color: var(--fw-accent);
  }

  .fw-combobox__input {
    width: 100%;
    padding: var(--fw-space-3);
    border: none;
    background: transparent;
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-input);
    line-height: var(--fw-line-height-input);
    border-radius: var(--fw-radius-sm);
  }

  .fw-combobox__input::placeholder {
    color: var(--fw-text-muted);
  }

  .fw-combobox__input:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-combobox__input:disabled {
    background: var(--fw-sunken);
    color: var(--fw-text-muted);
    cursor: default;
  }

  .fw-field--error .fw-combobox__shell {
    border-color: var(--fw-danger);
  }

  .fw-combobox__list {
    position: absolute;
    top: calc(100% + var(--fw-space-1));
    right: 0;
    left: 0;
    max-height: calc(var(--fw-space-12) * 2);
    margin: 0;
    padding: var(--fw-space-1) 0;
    overflow-y: auto;
    list-style: none;
    border: 1px solid var(--fw-border);
    background: var(--fw-raised);
    border-radius: var(--fw-radius-sm);
  }

  .fw-combobox__option {
    padding: var(--fw-space-2) var(--fw-space-3);
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
    cursor: pointer;
  }

  .fw-combobox__option--active {
    color: var(--fw-accent);
    background: var(--fw-accent-tint);
  }

  .fw-field__hint,
  .fw-field__error {
    margin: 0;
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }

  .fw-field__hint {
    color: var(--fw-text-muted);
  }

  .fw-field__error {
    color: var(--fw-danger);
  }
</style>
