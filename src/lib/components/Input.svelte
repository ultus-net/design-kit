<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props {
    id?: string;
    label: string;
    value?: string;
    name?: string;
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date';
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    oninput?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    id,
    label,
    value = $bindable(''),
    name,
    type = 'text',
    hint,
    error,
    required = false,
    disabled = false,
    placeholder,
    autocomplete,
    oninput,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? `${uid}-input`);
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const describedBy = $derived(
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  );
</script>

<div class="fw-field" class:fw-field--error={Boolean(error)}>
  {#if label}
    <label class="fw-field__label" for={inputId}>
      {label}
      {#if required}<span class="fw-field__required" aria-hidden="true">*</span>{/if}
    </label>
  {/if}
  <input
    id={inputId}
    class="fw-field__control"
    {name}
    {type}
    {placeholder}
    {autocomplete}
    {disabled}
    {required}
    bind:value
    {oninput}
    aria-invalid={error ? true : undefined}
    aria-describedby={describedBy}
    {...rest}
  />
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

  .fw-field__control {
    width: 100%;
    padding: var(--fw-space-3) var(--fw-space-3);
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-input);
    line-height: var(--fw-line-height-input);
    transition: border-color var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-field__control::placeholder {
    color: var(--fw-text-muted);
  }

  .fw-field__control:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
    border-color: var(--fw-accent);
  }

  .fw-field__control:disabled {
    background: var(--fw-sunken);
    color: var(--fw-text-muted);
    cursor: default;
  }

  .fw-field--error .fw-field__control {
    border-color: var(--fw-danger);
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
