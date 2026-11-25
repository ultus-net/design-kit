<script lang="ts">
  interface RadioOption {
    value: string;
    label: string;
    hint?: string;
    disabled?: boolean;
  }

  interface Props {
    legend: string;
    name: string;
    options: RadioOption[];
    value?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    legend,
    name,
    options,
    value = $bindable(''),
    hint,
    error,
    required = false,
    onchange,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const describedBy = $derived(
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  );

  let fieldset: HTMLFieldSetElement | undefined;

  function handleKeydown(event: KeyboardEvent) {
    const isNext = event.key === 'ArrowDown' || event.key === 'ArrowRight';
    const isPrevious = event.key === 'ArrowUp' || event.key === 'ArrowLeft';

    if (!isNext && !isPrevious) return;

    const radios = Array.from(
      fieldset?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []
    ).filter((radio) => !radio.disabled);

    if (!radios.length) return;

    const currentIndex = radios.findIndex((radio) => radio.value === value);
    const step = isNext ? 1 : -1;
    const start = currentIndex === -1 ? (isNext ? -1 : 0) : currentIndex;
    const next = radios[(start + step + radios.length) % radios.length];

    event.preventDefault();
    value = next.value;
    next.focus();
  }
</script>

<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
<fieldset
  class="fw-radio-group"
  class:fw-radio-group--error={Boolean(error)}
  aria-invalid={error ? true : undefined}
  aria-describedby={describedBy}
  onkeydown={handleKeydown}
  bind:this={fieldset}
  {...rest}
>
  <legend class="fw-radio-group__legend">
    {legend}
    {#if required}<span class="fw-radio-group__required" aria-hidden="true">*</span>{/if}
  </legend>
  {#each options as option (option.value)}
    <label class="fw-radio-group__option">
      <input
        class="fw-radio-group__control"
        type="radio"
        {name}
        value={option.value}
        bind:group={value}
        {required}
        disabled={option.disabled}
        aria-describedby={option.hint ? `${uid}-${option.value}-hint` : undefined}
        {onchange}
      />
      <span class="fw-radio-group__dot" aria-hidden="true"></span>
      <span class="fw-radio-group__label">{option.label}</span>
    </label>
    {#if option.hint}
      <p class="fw-radio-group__option-hint" id={`${uid}-${option.value}-hint`}>{option.hint}</p>
    {/if}
  {/each}
  {#if hint}<p class="fw-radio-group__hint" id={hintId}>{hint}</p>{/if}
  {#if error}<p class="fw-radio-group__error" id={errorId}>{error}</p>{/if}
</fieldset>

<style>
  .fw-radio-group {
    display: grid;
    gap: var(--fw-space-2);
    margin: 0;
    padding: 0;
    border: 0;
    font-family: var(--fw-font-body);
  }

  .fw-radio-group__legend {
    padding: 0;
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    font-weight: var(--fw-weight-semibold);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-radio-group__required {
    color: var(--fw-danger);
  }

  .fw-radio-group__option {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--fw-space-2);
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-radio-group__control {
    position: absolute;
    left: 0;
    top: 50%;
    z-index: 1;
    width: var(--fw-space-6);
    height: var(--fw-space-6);
    margin: 0;
    opacity: 0;
    appearance: none;
    border-radius: var(--fw-radius-full);
    transform: translateY(-50%);
    cursor: pointer;
  }

  .fw-radio-group__control:disabled {
    cursor: default;
  }

  .fw-radio-group__dot {
    box-sizing: border-box;
    display: inline-grid;
    place-content: center;
    flex: none;
    width: var(--fw-space-6);
    height: var(--fw-space-6);
    border: 1px solid var(--fw-border-strong);
    border-radius: var(--fw-radius-full);
    background: var(--fw-raised);
  }

  .fw-radio-group__dot::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: inherit;
    background: var(--fw-accent);
    transform: scale(0);
    transition: transform var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-radio-group__control:checked + .fw-radio-group__dot {
    border-color: var(--fw-accent);
  }

  .fw-radio-group__control:checked + .fw-radio-group__dot::after {
    transform: scale(1);
  }

  .fw-radio-group__control:focus-visible + .fw-radio-group__dot {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-radio-group__control:disabled + .fw-radio-group__dot {
    border-color: var(--fw-border);
    background: var(--fw-sunken);
  }

  .fw-radio-group__control:disabled ~ .fw-radio-group__label {
    color: var(--fw-text-muted);
  }

  .fw-radio-group__option-hint,
  .fw-radio-group__hint,
  .fw-radio-group__error {
    margin: 0;
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }

  .fw-radio-group__option-hint {
    margin-left: var(--fw-space-6);
    color: var(--fw-text-muted);
  }

  .fw-radio-group__hint {
    color: var(--fw-text-muted);
  }

  .fw-radio-group__error {
    color: var(--fw-danger);
  }

  .fw-radio-group--error .fw-radio-group__legend {
    color: var(--fw-danger);
  }
</style>
