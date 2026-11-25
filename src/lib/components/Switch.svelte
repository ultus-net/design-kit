<script lang="ts">
  interface Props {
    label: string;
    checked?: boolean;
    hint?: string;
    disabled?: boolean;
    name?: string;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    label,
    checked = $bindable(false),
    hint,
    disabled = false,
    name,
    onchange,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;

  function toggle(event: Event) {
    if (disabled) return;

    checked = !checked;
    onchange?.(event);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== ' ') return;

    event.preventDefault();
    toggle(event);
  }
</script>

<div class="fw-switch">
  <span class="fw-switch__label" id={labelId}>{label}</span>
  <button
    type="button"
    class="fw-switch__control"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelId}
    aria-describedby={hint ? hintId : undefined}
    {name}
    {disabled}
    onclick={toggle}
    onkeydown={handleKeydown}
    {...rest}
  >
    <span class="fw-switch__track" aria-hidden="true">
      <span class="fw-switch__thumb"></span>
    </span>
  </button>
  {#if hint}<p class="fw-switch__hint" id={hintId}>{hint}</p>{/if}
</div>

<style>
  .fw-switch {
    display: grid;
    gap: var(--fw-space-1);
    font-family: var(--fw-font-body);
  }

  .fw-switch__label {
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    font-weight: var(--fw-weight-medium);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-switch__control {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    padding: var(--fw-space-1);
    border: none;
    background: transparent;
    border-radius: var(--fw-radius-full);
    cursor: pointer;
  }

  .fw-switch__control:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-switch__control:disabled {
    cursor: default;
  }

  .fw-switch__track {
    display: inline-flex;
    align-items: center;
    width: var(--fw-space-8);
    height: var(--fw-space-5);
    padding: var(--fw-space-1);
    border-radius: var(--fw-radius-full);
    background: var(--fw-border-strong);
    transition: background var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-switch__control[aria-checked='true'] .fw-switch__track {
    background: var(--fw-accent);
  }

  .fw-switch__control:disabled .fw-switch__track {
    background: var(--fw-sunken);
  }

  .fw-switch__thumb {
    width: var(--fw-space-4);
    height: var(--fw-space-4);
    border-radius: var(--fw-radius-full);
    background: var(--fw-raised);
    transition: transform var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-switch__control[aria-checked='true'] .fw-switch__thumb {
    transform: translateX(var(--fw-space-3));
  }

  .fw-switch__hint {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
    line-height: var(--fw-line-height-body-xxs);
  }
</style>
