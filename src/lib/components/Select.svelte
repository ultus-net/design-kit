<script lang="ts">
  interface Option {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    id?: string;
    label: string;
    options: Option[];
    value?: string;
    name?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    id,
    label,
    options,
    value = $bindable(''),
    name,
    hint,
    error,
    required = false,
    disabled = false,
    onchange,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const selectId = $derived(id ?? `${uid}-select`);
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const describedBy = $derived(
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  );
</script>

<div class="fw-field" class:fw-field--error={Boolean(error)}>
  <label class="fw-field__label" for={selectId}>
    {label}
    {#if required}<span class="fw-field__required" aria-hidden="true">*</span>{/if}
  </label>
  <div class="fw-select">
    <select
      id={selectId}
      class="fw-select__control"
      {name}
      {disabled}
      {required}
      bind:value
      {onchange}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...rest}
    >
      {#each options as option (option.value)}
        <option value={option.value} disabled={option.disabled}>{option.label}</option>
      {/each}
    </select>
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

  .fw-select {
    position: relative;
  }

  .fw-select::after {
    content: '';
    position: absolute;
    top: 50%;
    right: var(--fw-space-4);
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--fw-text-muted);
    border-bottom: 2px solid var(--fw-text-muted);
    transform: translateY(-70%) rotate(45deg);
    pointer-events: none;
  }

  .fw-select__control {
    width: 100%;
    padding: var(--fw-space-3) var(--fw-space-8) var(--fw-space-3) var(--fw-space-3);
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-input);
    line-height: var(--fw-line-height-input);
    border-radius: var(--fw-radius-sm);
    appearance: none;
  }

  .fw-select__control:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
    border-color: var(--fw-accent);
  }

  .fw-select__control:disabled {
    background: var(--fw-sunken);
    color: var(--fw-text-muted);
    cursor: default;
  }

  .fw-field--error .fw-select__control {
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
