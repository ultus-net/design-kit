<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
  type Size = 'sm' | 'md' | 'lg';

  interface Props {
    variant?: Variant;
    size?: Size;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    href?: string;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    href,
    onclick,
    class: className = '',
    children
  }: Props = $props();

  const busy = $derived(disabled || loading);
  const classes = $derived(
    ['fw-button', `fw-button--${variant}`, `fw-button--${size}`, loading ? 'is-loading' : '', className]
      .filter(Boolean)
      .join(' ')
  );
</script>

{#if href}
  <a
    class={classes}
    {href}
    aria-disabled={busy}
    aria-busy={loading}
    tabindex={busy ? -1 : undefined}
    onclick={(event) => {
      if (busy) {
        // aria-disabled does not cancel an anchor's navigation.
        event.preventDefault();
        return;
      }
      onclick?.(event);
    }}
  >
    {#if loading}<span class="fw-button__spinner" aria-hidden="true"></span>{/if}
    {@render children()}
    {#if loading}<span class="fw-sr-only">Loading</span>{/if}
  </a>
{:else}
  <button class={classes} {type} disabled={busy} aria-busy={loading} {onclick}>
    {#if loading}<span class="fw-button__spinner" aria-hidden="true"></span>{/if}
    {@render children()}
    {#if loading}<span class="fw-sr-only">Loading</span>{/if}
  </button>
{/if}

<style>
  .fw-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--fw-space-2);
    min-width: 200px;
    border: 1px solid transparent;
    border-radius: var(--fw-radius-sm);
    font-family: var(--fw-font-display);
    font-weight: var(--fw-weight-regular);
    line-height: 1.2;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color var(--fw-motion-fast) var(--fw-motion-ease),
      border-color var(--fw-motion-fast) var(--fw-motion-ease),
      color var(--fw-motion-fast) var(--fw-motion-ease);
  }

  .fw-button:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-button--sm {
    min-width: 120px;
    padding: var(--fw-space-2) var(--fw-space-4);
    font-size: var(--fw-font-size-body-xs);
  }

  .fw-button--md {
    padding: var(--fw-space-3) var(--fw-space-5);
    font-size: var(--fw-font-size-body-s);
  }

  .fw-button--lg {
    min-width: 240px;
    padding: var(--fw-space-4) var(--fw-space-6);
    font-size: var(--fw-font-size-body-m);
  }

  .fw-button--primary {
    background: var(--fw-accent);
    border-color: var(--fw-accent);
    color: var(--fw-on-accent);
  }

  .fw-button--primary:hover:not(:disabled) {
    background: var(--fw-accent-hover);
    border-color: var(--fw-accent-hover);
  }

  .fw-button--secondary {
    background: var(--fw-raised);
    border-color: var(--fw-border-strong);
    color: var(--fw-text);
  }

  .fw-button--secondary:hover:not(:disabled) {
    background: var(--fw-sunken);
  }

  .fw-button--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--fw-text);
  }

  .fw-button--ghost:hover:not(:disabled) {
    background: var(--fw-accent-tint);
  }

  .fw-button--danger {
    background: var(--fw-danger);
    border-color: var(--fw-danger);
    color: var(--fw-on-danger);
  }

  .fw-button--danger:hover:not(:disabled) {
    background: var(--fw-danger-tint);
    border-color: var(--fw-danger);
    color: var(--fw-danger);
  }

  .fw-button:disabled,
  .fw-button[aria-disabled='true'] {
    background: var(--fw-border);
    border-color: var(--fw-border);
    color: var(--fw-text-muted);
    cursor: default;
    pointer-events: none;
  }

  .fw-button__spinner {
    width: 0.9em;
    height: 0.9em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: var(--fw-radius-full);
    animation: fw-button-spin var(--fw-motion-slow) linear infinite;
  }

  .fw-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @keyframes fw-button-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fw-button {
      transition: none;
    }

    .fw-button__spinner {
      animation-duration: 2s;
    }
  }
</style>
