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

<div class="jcs-shell" class:jcs-shell--content={height === 'content'}>
  <a class="jcs-shell__skip" href="#jcs-main">Skip to content</a>
  <header class="jcs-shell__chrome">
    <div class="jcs-shell__bar">
      <div class="jcs-shell__brand">{@render brand()}</div>
      {#if nav}<nav class="jcs-shell__nav" aria-label="Primary">{@render nav()}</nav>{/if}
      {#if actions}<div class="jcs-shell__actions">{@render actions()}</div>{/if}
    </div>
  </header>
  <main class="jcs-shell__main" id="jcs-main">
    {@render children()}
  </main>
</div>

<style>
  .jcs-shell {
    min-height: 100vh;
    background: var(--fw-page);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
  }

  .jcs-shell--content {
    min-height: 0;
  }

  .jcs-shell__skip {
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

  .jcs-shell__skip:focus-visible {
    outline: 2px solid var(--fw-focus);
    transform: translateY(0);
  }

  .jcs-shell__chrome {
    background: var(--fw-chrome);
    color: var(--fw-chrome-text);
  }

  .jcs-shell__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-3) var(--fw-space-5);
    width: min(100%, var(--fw-breakpoint-max));
    margin: 0 auto;
    padding: var(--fw-space-3) var(--fw-space-4);
  }

  .jcs-shell__brand {
    display: flex;
    align-items: center;
    gap: var(--fw-space-2);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-4);
    line-height: var(--fw-line-height-display-4);
  }

  .jcs-shell__brand :global(a) {
    color: inherit;
    text-decoration: none;
  }

  .jcs-shell__nav {
    flex: 1 1 auto;
    min-width: 0;
  }

  .jcs-shell__nav :global(a) {
    color: inherit;
  }

  .jcs-shell__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-2);
  }

  .jcs-shell__main {
    width: min(100%, var(--fw-breakpoint-max));
    margin: 0 auto;
    padding: var(--fw-space-6) var(--fw-space-4);
  }

  @media (max-width: 767px) {
    .jcs-shell__bar {
      padding: var(--fw-space-2) var(--fw-space-3);
    }

    .jcs-shell__main {
      padding: var(--fw-space-5) var(--fw-space-3);
    }
  }
</style>
