<script lang="ts">
  import '$lib/tokens/tokens.css';
  import '$lib/tokens/fonts.css';
  import '../app.css';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'residential', label: 'Residential' }
  ] as const;

  const modes = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' }
  ] as const;

  const corners = [
    { id: 'brand', label: 'Brand' },
    { id: 'sharp', label: 'Sharp' }
  ] as const;

  type SectionId = (typeof sections)[number]['id'];
  type ModeId = (typeof modes)[number]['id'];
  type CornerId = (typeof corners)[number]['id'];

  const isSection = (value: string | null): value is SectionId =>
    sections.some((entry) => entry.id === value);
  const isMode = (value: string | null): value is ModeId => modes.some((entry) => entry.id === value);
  const isCorner = (value: string | null): value is CornerId =>
    corners.some((entry) => entry.id === value);

  let section = $state<SectionId>('about');
  let mode = $state<ModeId>('light');
  let corner = $state<CornerId>('brand');
  let ready = $state(false);

  onMount(() => {
    const storedSection = localStorage.getItem('jcs-section');
    if (isSection(storedSection)) section = storedSection;
    const storedMode = localStorage.getItem('jcs-mode');
    if (isMode(storedMode)) mode = storedMode;
    const storedCorner = localStorage.getItem('jcs-corners');
    if (isCorner(storedCorner)) corner = storedCorner;
    ready = true;
  });

  $effect(() => {
    if (!browser) return;
    const root = document.documentElement;
    root.dataset.section = section;
    root.dataset.mode = mode;
    root.dataset.corners = corner;
    if (ready) {
      localStorage.setItem('jcs-section', section);
      localStorage.setItem('jcs-mode', mode);
      localStorage.setItem('jcs-corners', corner);
    }
  });

  const nav = [
    { href: '/', label: 'Overview' },
    { href: '/colours', label: 'Colours' },
    { href: '/typography', label: 'Typography' },
    { href: '/spacing', label: 'Spacing' },
    { href: '/components', label: 'Components' },
    { href: '/assets', label: 'Assets' },
    { href: '/guidelines', label: 'Guidelines' },
    { href: '/cheatsheet', label: 'Cheatsheet' }
  ];

  const logoDark = new URL('../lib/assets/logos/jacobsen/dark.svg', import.meta.url).href;
  const logoWhite = new URL('../lib/assets/logos/jacobsen/white.svg', import.meta.url).href;
</script>

<div class="docs">
  <aside class="docs__side">
    <a class="docs__home" href="/">
      <img alt="Jacobsen" width="168" src={mode === 'light' ? logoDark : logoWhite}>
    </a>

    <nav class="docs__nav" aria-label="Brand kit sections">
      {#each nav as item (item.href)}
        <a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : undefined}>
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="docs__controls">
      <div class="docs__group" role="group" aria-label="Section theme">
        {#each sections as entry (entry.id)}
          <button
            type="button"
            aria-pressed={section === entry.id}
            onclick={() => (section = entry.id)}
          >
            {entry.label}
          </button>
        {/each}
      </div>
      <div class="docs__group" role="group" aria-label="Colour mode">
        {#each modes as entry (entry.id)}
          <button type="button" aria-pressed={mode === entry.id} onclick={() => (mode = entry.id)}>
            {entry.label}
          </button>
        {/each}
      </div>
      <div class="docs__group" role="group" aria-label="Surface corners">
        {#each corners as entry (entry.id)}
          <button
            type="button"
            aria-pressed={corner === entry.id}
            onclick={() => (corner = entry.id)}
          >
            {entry.label}
          </button>
        {/each}
      </div>
    </div>
  </aside>

  <div class="docs__content">
    {@render children()}
  </div>
</div>

<style>
  .docs {
    display: grid;
    grid-template-columns: 248px minmax(0, 1fr);
    min-height: 100vh;
    background: var(--fw-page);
    color: var(--fw-text);
  }

  .docs__side {
    display: flex;
    flex-direction: column;
    gap: var(--fw-space-7);
    padding: var(--fw-space-6) var(--fw-space-5);
    border-right: 1px solid var(--fw-border);
    background: var(--fw-sunken);
  }

  .docs__home {
    display: flex;
    align-items: center;
    gap: var(--fw-space-3);
    color: var(--fw-text);
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-4);
    line-height: 1.1;
    text-decoration: none;
  }

  .docs__nav {
    display: flex;
    flex-direction: column;
    gap: var(--fw-space-1);
  }

  .docs__nav a {
    padding: var(--fw-space-2) var(--fw-space-3);
    border-radius: var(--fw-radius-sm);
    color: var(--fw-text);
    font-size: var(--fw-font-size-body-xs);
    text-decoration: none;
  }

  .docs__nav a:hover {
    background: var(--fw-raised);
  }

  .docs__nav a[aria-current='page'] {
    background: var(--fw-raised);
    box-shadow: inset 3px 0 0 var(--fw-accent);
    font-weight: var(--fw-weight-semibold);
  }

  .docs__controls {
    display: grid;
    gap: var(--fw-space-3);
    margin-top: auto;
  }

  .docs__group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-space-1);
  }

  .docs__group button {
    flex: 1 1 auto;
    padding: var(--fw-space-2) var(--fw-space-3);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xxs);
    cursor: pointer;
  }

  .docs__group button[aria-pressed='true'] {
    border-color: var(--fw-accent);
    background: var(--fw-accent);
    color: var(--fw-on-accent);
  }

  .docs__content {
    min-width: 0;
    padding: var(--fw-space-8) var(--fw-space-7) var(--fw-space-12);
  }

  @media (max-width: 900px) {
    .docs {
      grid-template-columns: 1fr;
    }

    .docs__side {
      gap: var(--fw-space-4);
      padding: var(--fw-space-4);
      border-right: 0;
      border-bottom: 1px solid var(--fw-border);
    }

    .docs__nav {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .docs__controls {
      margin-top: 0;
    }

    .docs__content {
      padding: var(--fw-space-6) var(--fw-space-4) var(--fw-space-10);
    }
  }

  @media (max-width: 420px) {
    .docs__side {
      padding: var(--fw-space-3);
    }

    .docs__content {
      padding: var(--fw-space-5) var(--fw-space-3) var(--fw-space-9);
    }
  }
</style>
