<script lang="ts">
  type Tone = 'info' | 'success' | 'warning' | 'danger';

  interface Message {
    id: string;
    tone?: Tone;
    title: string;
    body?: string;
  }

  interface Props {
    messages: Message[];
    assertive?: boolean;
    label?: string;
    onDismiss?: (id: string) => void;
  }

  let { messages, assertive = false, label, onDismiss }: Props = $props();
</script>

<div
  class="fw-toast-stack"
  aria-label={label ?? 'Notifications'}
  aria-live={assertive ? 'assertive' : 'polite'}
  aria-relevant="additions text"
>
  {#each messages as message (message.id)}
    <div
      class={`fw-toast fw-toast--${message.tone ?? 'info'}`}
      role={message.tone === 'danger' ? 'alert' : 'status'}
    >
      <p class="fw-toast__title">{message.title}</p>
      {#if message.body}<p class="fw-toast__body">{message.body}</p>{/if}
      {#if onDismiss}
        <button
          type="button"
          class="fw-toast__dismiss"
          aria-label={`Dismiss ${message.title}`}
          onclick={() => onDismiss?.(message.id)}
        >
          Dismiss
        </button>
      {/if}
    </div>
  {/each}
</div>

<style>
  .fw-toast-stack {
    display: grid;
    gap: var(--fw-space-2);
    width: min(100%, 360px);
  }

  .fw-toast {
    display: grid;
    gap: var(--fw-space-1);
    padding: var(--fw-space-3);
    border: 1px solid var(--fw-border);
    border-left-width: 2px;
    border-radius: var(--fw-radius-sm);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
  }

  .fw-toast--info {
    background: var(--fw-info-tint);
    border-left-color: var(--fw-info);
  }

  .fw-toast--success {
    background: var(--fw-success-tint);
    border-left-color: var(--fw-success);
  }

  .fw-toast--warning {
    background: var(--fw-warning-tint);
    border-left-color: var(--fw-warning);
  }

  .fw-toast--danger {
    background: var(--fw-danger-tint);
    border-left-color: var(--fw-danger);
  }

  .fw-toast__title {
    margin: 0;
    font-weight: var(--fw-weight-semibold);
  }

  .fw-toast__body {
    margin: 0;
  }

  .fw-toast__dismiss {
    justify-self: end;
    min-width: var(--fw-space-8);
    min-height: var(--fw-space-8);
    padding: 0;
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    background: transparent;
    color: var(--fw-text);
    font-family: var(--fw-font-mono);
    font-size: var(--fw-font-size-body-xxs);
    cursor: pointer;
  }

  .fw-toast__dismiss:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }
</style>
