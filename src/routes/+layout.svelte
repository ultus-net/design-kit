<script lang="ts">
  import '$lib/tokens/tokens.css';
  import '$lib/tokens/fonts.css';
  import '../app.css';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { setChrome, defaultProfile, defaultCorners, isMode, isProfile, isCornerPreset, modes, profiles, cornerPresets } from './_chrome.svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const chrome = setChrome();

  let ready = $state(false);

  onMount(() => {
    const storedMode = localStorage.getItem('fw-mode');
    if (isMode(storedMode)) chrome.mode = storedMode;

    const storedProfile = localStorage.getItem('fw-profile');
    if (isProfile(storedProfile)) chrome.profile = storedProfile;

    const storedCorners = localStorage.getItem('fw-corners');
    if (isCornerPreset(storedCorners)) chrome.corners = storedCorners;

    ready = true;
  });

  $effect(() => {
    if (!browser) return;
    document.documentElement.dataset.mode = chrome.mode;
    if (chrome.profile === defaultProfile) delete document.documentElement.dataset.profile;
    else document.documentElement.dataset.profile = chrome.profile;
    if (chrome.corners === defaultCorners) delete document.documentElement.dataset.corners;
    else document.documentElement.dataset.corners = chrome.corners;
    if (ready) {
      localStorage.setItem('fw-mode', chrome.mode);
      localStorage.setItem('fw-profile', chrome.profile);
      localStorage.setItem('fw-corners', chrome.corners);
    }
  });

  const nav = [
    { href: '/', label: 'Overview' },
    { href: '/colours', label: 'Colours' },
    { href: '/profiles', label: 'Profiles' },
    { href: '/corners', label: 'Corners' },
    { href: '/typography', label: 'Typography' },
    { href: '/spacing', label: 'Spacing' },
    { href: '/components', label: 'Components' },
    { href: '/assets', label: 'Assets' },
    { href: '/guidelines', label: 'Guidelines' },
    { href: '/cheatsheet', label: 'Cheatsheet' }
  ];
</script>

<div class="docs">
  <aside class="docs__side">
    <a class="docs__home" href="/">Design Kit</a>

    <div class="docs__controls">
      <div class="docs__group" role="group" aria-label="Profile">
        {#each profiles as entry (entry.id)}
          <button
            type="button"
            aria-pressed={chrome.profile === entry.id}
            onclick={() => (chrome.profile = entry.id)}
          >
            {entry.label}
          </button>
        {/each}
      </div>
      <div class="docs__group" role="group" aria-label="Colour mode">
        {#each modes as entry (entry.id)}
          <button
            type="button"
            aria-pressed={chrome.mode === entry.id}
            onclick={() => (chrome.mode = entry.id)}
          >
            {entry.label}
          </button>
        {/each}
      </div>
      <div class="docs__group" role="group" aria-label="Corners">
        {#each cornerPresets as entry (entry.id)}
          <button
            type="button"
            aria-pressed={chrome.corners === entry.id}
            onclick={() => (chrome.corners = entry.id)}
          >
            {entry.label}
          </button>
        {/each}
      </div>
    </div>

    <nav class="docs__nav" aria-label="Documentation">
      {#each nav as item (item.href)}
        <a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : undefined}>
          {item.label}
        </a>
      {/each}
    </nav>
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
    position: sticky;
    top: 0;
    align-self: start;
    height: 100vh;
    overflow-y: auto;
  }

  .docs__home {
    display: inline-flex;
    align-items: center;
    align-self: start;
    min-height: 32px;
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-4);
    line-height: 1.1;
    letter-spacing: -0.02em;
    text-decoration: none;
    color: var(--fw-text);
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
    border-left: 3px solid var(--fw-accent);
    font-weight: var(--fw-weight-semibold);
  }

  .docs__controls {
    display: grid;
    gap: var(--fw-space-3);
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
      position: static;
      height: auto;
      overflow: visible;
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
