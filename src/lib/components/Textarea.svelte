<script lang="ts">
  interface Props {
    id?: string;
    label: string;
    value?: string;
    hint?: string;
    error?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    oninput?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    id,
    label,
    value = $bindable(''),
    hint,
    error,
    rows = 4,
    required = false,
    disabled = false,
    name,
    placeholder,
    oninput,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const textareaId = $derived(id ?? `${uid}-textarea`);
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const describedBy = $derived(
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  );
</script>

<div class="fw-textarea" class:fw-textarea--error={Boolean(error)}>
  <label class="fw-textarea__label" for={textareaId}>
    {label}
    {#if required}<span class="fw-textarea__required" aria-hidden="true">*</span>{/if}
  </label>
  <textarea
    id={textareaId}
    class="fw-textarea__control"
    {name}
    {placeholder}
    {rows}
    {disabled}
    {required}
    bind:value
    {oninput}
    aria-invalid={error ? true : undefined}
    aria-describedby={describedBy}
    {...rest}
  ></textarea>
  {#if hint}<p class="fw-textarea__hint" id={hintId}>{hint}</p>{/if}
  {#if error}<p class="fw-textarea__error" id={errorId}>{error}</p>{/if}
</div>

<style>
  .fw-textarea {
    display: grid;
    gap: var(--fw-space-2);
    font-family: var(--fw-font-body);
  }

  .fw-textarea__label {
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-textarea__required {
    color: var(--fw-danger);
  }

  .fw-textarea__control {
    width: 100%;
    padding: var(--fw-space-3) var(--fw-space-3);
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-input);
    line-height: var(--fw-line-height-input);
    border-radius: var(--fw-radius-sm);
    resize: vertical;
    transition: border-color var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-textarea__control::placeholder {
    color: var(--fw-text-muted);
  }

  .fw-textarea__control:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
    border-color: var(--fw-accent);
  }

  .fw-textarea__control:disabled {
    background: var(--fw-sunken);
    color: var(--fw-text-muted);
    cursor: default;
  }

  .fw-textarea--error .fw-textarea__control {
    border-color: var(--fw-danger);
  }

  .fw-textarea__hint,
  .fw-textarea__error {
    margin: 0;
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }

  .fw-textarea__hint {
    color: var(--fw-text-muted);
  }

  .fw-textarea__error {
    color: var(--fw-danger);
  }
</style>
