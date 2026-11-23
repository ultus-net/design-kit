<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    actions?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { title, actions, footer, children }: Props = $props();
</script>

<section class="jcs-card">
  {#if title || actions}
    <header class="jcs-card__header">
      {#if title}<h2 class="jcs-card__title">{title}</h2>{/if}
      {#if actions}<div class="jcs-card__actions">{@render actions()}</div>{/if}
    </header>
  {/if}
  <div class="jcs-card__body">{@render children()}</div>
  {#if footer}<footer class="jcs-card__footer">{@render footer()}</footer>{/if}
</section>

<style>
  .jcs-card {
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-lg);
    background: var(--fw-raised);
    color: var(--fw-text);
    box-shadow: var(--fw-shadow-sm);
    font-family: var(--fw-font-body);
  }

  .jcs-card__header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--fw-space-3);
    padding: var(--fw-space-4) var(--fw-space-5) 0;
  }

  .jcs-card__title {
    margin: 0;
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-4);
    font-weight: var(--fw-weight-regular);
    line-height: var(--fw-line-height-display-4);
  }

  .jcs-card__body {
    padding: var(--fw-space-4) var(--fw-space-5);
  }

  .jcs-card__footer {
    padding: var(--fw-space-3) var(--fw-space-5);
    border-top: 1px solid var(--fw-border);
  }
</style>
