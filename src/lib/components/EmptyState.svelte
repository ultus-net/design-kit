<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description?: string;
    mark?: Snippet;
    action?: Snippet;
  }

  let {
    title,
    description,
    mark,
    action
  }: Props = $props();
</script>

<div class="fw-empty">
  {#if mark}
    <div class="fw-empty__mark" aria-hidden="true">{@render mark()}</div>
  {/if}
  <p class="fw-empty__title">{title}</p>
  {#if description}
    <p class="fw-empty__description">{description}</p>
  {/if}
  {#if action}
    <div class="fw-empty__action">{@render action()}</div>
  {/if}
</div>

<style>
  .fw-empty {
    display: grid;
    justify-items: center;
    gap: var(--fw-space-3);
    padding: var(--fw-space-7) var(--fw-space-5);
    border: 1px dashed var(--fw-border);
    background: var(--fw-raised);
    text-align: center;
  }

  .fw-empty__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fw-text-muted);
  }

  .fw-empty__title {
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
    color: var(--fw-text);
    margin: 0;
    max-width: 30ch;
  }

  .fw-empty__description {
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    line-height: var(--fw-line-height-body-xs);
    color: var(--fw-text-muted);
    margin: 0;
    max-width: 50ch;
  }

  .fw-empty__action {
    margin-top: var(--fw-space-2);
  }
</style>
