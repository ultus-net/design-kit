<script lang="ts">
  import type { Snippet } from 'svelte';

  interface FieldControl {
    id: string;
    required: boolean | undefined;
    invalid: boolean | undefined;
    'aria-describedby': string | undefined;
  }

  interface Props {
    id: string;
    label: string;
    hint?: string;
    error?: string | undefined;
    required?: boolean;
    children: Snippet<[FieldControl]>;
  }

  let { id, label, hint, error, required = false, children }: Props = $props();

  const describedBy = $derived(
    [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  );
</script>

<div class="fw-field" class:fw-field--invalid={Boolean(error)}>
  <span class="fw-field__labelrow">
    <label class="fw-field__label" for={id}>{label}</label>
    {#if required}<span class="fw-field__required" aria-hidden="true">*</span>{/if}
  </span>
  {#if hint}<p class="fw-field__hint" id={`${id}-hint`}>{hint}</p>{/if}
  {@render children({
    id,
    required: required || undefined,
    invalid: error ? true : undefined,
    'aria-describedby': describedBy
  })}
  {#if error}<p class="fw-field__error" id={`${id}-error`}>{error}</p>{/if}
</div>

<style>
  .fw-field {
    display: grid;
    gap: var(--fw-space-1);
    font-family: var(--fw-font-body);
  }

  .fw-field__labelrow {
    display: flex;
    align-items: baseline;
    gap: var(--fw-space-1);
  }

  .fw-field__label {
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    font-weight: var(--fw-weight-medium);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-field__required {
    color: var(--fw-danger);
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
