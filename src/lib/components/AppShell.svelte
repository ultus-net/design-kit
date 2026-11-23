<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    brand: Snippet;
    children: Snippet;
    nav?: Snippet;
    actions?: Snippet;
    height?: 'viewport' | 'content';
  }

  let { brand, children, nav, actions, height = 'viewport' }: Props = $props();
</script>

<div class="fw-shell" class:fw-shell--content={height === 'content'}>
  <a class="fw-shell__skip" href="#fw-main">Skip to content</a>
  <header class="fw-shell__chrome">
    <div class="fw-shell__bar">
      <div class="fw-shell__brand">{@render brand()}</div>
      {#if nav}<nav class="fw-shell__nav" aria-label="Primary">{@render nav()}</nav>{/if}
      {#if actions}<div class="fw-shell__actions">{@render actions()}</div>{/if}
    </div>
  </header>
  <main class="fw-shell__main" id="fw-main">
    {@render children()}
  </main>
</div>

<style>
  .fw-shell {
    min-height: 100vh;
    background: var(--fw-page);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
  }

  .fw-shell--content {
    min-height: 0;
  }

  .fw-shell__skip {
    position: absolute;
    top: var(--fw-space-2);
    left: var(--fw-space-2);
    z-index: 10;
    padding: var(--fw-space-2) var(--fw-space-3);
    border-radius: var(--fw-radius-sm);
    background: var(--fw-raised);
    color: var(--fw-text);
    transform: translateY(-200%);
  }

  .fw-shell__skip:focus-visible {
    outline: 2px solid var(--fw-focus);
    transform: translateY(0);
  }

  .fw-shell__chrome {
    background: var(--fw-chrome);
    color: var(--fw-chrome-text);
  }

  .fw-shell__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-3) var(--fw-space-5);
    width: min(100%, var(--fw-breakpoint-max));
    margin: 0 auto;
    padding: var(--fw-space-3) var(--fw-space-4);
  }

  .fw-shell__brand {
    display: flex;
    align-items: center;
    gap: var(--fw-space-2);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-4);
    line-height: var(--fw-line-height-display-4);
  }

  .fw-shell__brand :global(a) {
    color: inherit;
    text-decoration: none;
  }

  .fw-shell__nav {
    flex: 1 1 auto;
    min-width: 0;
  }

  .fw-shell__nav :global(a) {
    color: inherit;
  }

  .fw-shell__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-2);
  }

  .fw-shell__main {
    width: min(100%, var(--fw-breakpoint-max));
    margin: 0 auto;
    padding: var(--fw-space-6) var(--fw-space-4);
  }

  @media (max-width: 767px) {
    .fw-shell__bar {
      padding: var(--fw-space-2) var(--fw-space-3);
    }

    .fw-shell__main {
      padding: var(--fw-space-5) var(--fw-space-3);
    }
  }
</style>
