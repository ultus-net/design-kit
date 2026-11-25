<script lang="ts">
  interface Props {
    id?: string;
    label: string;
    hint?: string;
    error?: string;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    required?: boolean;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    id,
    label,
    hint,
    error,
    checked = $bindable(false),
    indeterminate = false,
    disabled = false,
    name,
    value,
    required = false,
    onchange,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? `${uid}-checkbox`);
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const describedBy = $derived(
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  );

  let input: HTMLInputElement | undefined;

  $effect(() => {
    if (input) input.indeterminate = indeterminate;
  });

  function handleClick(event: MouseEvent) {
    // jsdom still runs the activation behaviour for a synthetic click on a disabled input.
    if (disabled) event.preventDefault();
  }
</script>

<div class="fw-checkbox" class:fw-checkbox--error={Boolean(error)}>
  <label class="fw-checkbox__row" for={inputId}>
    <input
      bind:this={input}
      id={inputId}
      class="fw-checkbox__control"
      type="checkbox"
      {name}
      {value}
      {disabled}
      {required}
      bind:checked
      onclick={handleClick}
      {onchange}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...rest}
    />
    <span class="fw-checkbox__label">
      {label}
      {#if required}<span class="fw-checkbox__required" aria-hidden="true">*</span>{/if}
    </span>
  </label>
  {#if hint}<p class="fw-checkbox__hint" id={hintId}>{hint}</p>{/if}
  {#if error}<p class="fw-checkbox__error" id={errorId}>{error}</p>{/if}
</div>

<style>
  .fw-checkbox {
    display: grid;
    gap: var(--fw-space-2);
    font-family: var(--fw-font-body);
  }

  .fw-checkbox__row {
    display: flex;
    align-items: center;
    gap: var(--fw-space-2);
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-checkbox__control {
    width: var(--fw-space-4);
    height: var(--fw-space-4);
    margin: 0;
    accent-color: var(--fw-accent);
  }

  .fw-checkbox__control:disabled {
    cursor: default;
  }

  .fw-checkbox__control:disabled + .fw-checkbox__label {
    color: var(--fw-text-muted);
  }

  .fw-checkbox__required {
    color: var(--fw-danger);
  }

  .fw-checkbox--error .fw-checkbox__label {
    color: var(--fw-danger);
  }

  .fw-checkbox__control:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-checkbox__hint,
  .fw-checkbox__error {
    margin: 0;
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }

  .fw-checkbox__hint {
    color: var(--fw-text-muted);
  }

  .fw-checkbox__error {
    color: var(--fw-danger);
  }
</style>
