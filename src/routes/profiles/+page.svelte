<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';
  import { contrastRatio, ratioText, themePairs, type Mode } from '../_page';
  import { chrome, profiles } from '../_chrome.svelte';

  const entries = Object.entries(tokens.profiles);
  const modes = ['light', 'dark'] as const;
  const modeLabels = { light: 'Light', dark: 'Dark' } as const;
  const anchors = ['ground', 'paper', 'signal', 'ink'] as const;
</script>

<PageHeader
  title="Profiles"
  lede="Three palette families, each with a light and a dark mode. A profile changes colour, never construction: radius stays zero, shadows stay off, and the signal stays a fill."
/>

<div class="switcher" role="group" aria-label="Profile">
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

{#each entries as [id, profile] (id)}
  <section class="block" class:active={chrome.profile === id}>
    <h2>{profile.label}</h2>
    <p>{profile.source}</p>
    <ul class="anchors">
      {#each anchors as anchor (anchor)}
        <li class="anchor">
          <span class="anchor__chip" style="background: {profile.anchors[anchor]}"></span>
          <span class="anchor__name">{anchor}</span>
          <code>{profile.anchors[anchor]}</code>
        </li>
      {/each}
    </ul>
    {#each modes as mode (mode)}
      {@const modeTokens: Mode = profile.modes[mode]}
      <h3>{modeLabels[mode]}</h3>
      <div class="table-wrap">
        <table class="stack-table">
          <thead>
            <tr><th>Pair</th><th>Ratio</th><th>Minimum</th><th>Result</th><th>Values</th></tr>
          </thead>
          <tbody>
            {#each themePairs as pair (pair.foreground + pair.background)}
              {@const foreground = modeTokens.tokens[pair.foreground]}
              {@const background = modeTokens.tokens[pair.background]}
              {#if foreground && background}
                {@const ratio = contrastRatio(foreground.value, background.value)}
                <tr>
                  <td data-label="Pair">{pair.label}</td>
                  <td data-label="Ratio">{ratioText(ratio)}</td>
                  <td data-label="Minimum">{pair.minimum}:1</td>
                  <td data-label="Result" class:fail={ratio < pair.minimum}>
                    {ratio >= pair.minimum ? 'Pass' : 'Fail'}
                  </td>
                  <td data-label="Values">
                    <code>{foreground.value}</code> on <code>{background.value}</code>
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  </section>
{/each}

<section class="block">
  <h2>How to add a profile</h2>
  <ol>
    <li>
      Add the profile to <code>tokens.json</code> with <code>id</code>, <code>label</code>,
      <code>source</code> and both modes.
    </li>
    <li>Run <code>npm run contrast</code> until it reports 0 failures.</li>
    <li>Run <code>npm run tokens</code> to emit the CSS.</li>
    <li>Add the id to the switcher and the docs.</li>
  </ol>
  <p>The gate fails a profile that is missing a token or a source, so a new palette cannot land half-filled.</p>
</section>

<style>
  .switcher {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-space-2);
    margin-bottom: var(--fw-space-8);
  }

  .switcher button {
    padding: var(--fw-space-2) var(--fw-space-4);
    border: 1px solid var(--fw-border);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    cursor: pointer;
  }

  .switcher button[aria-pressed='true'] {
    border-color: var(--fw-accent);
    background: var(--fw-accent);
    color: var(--fw-on-accent);
  }

  .block {
    display: grid;
    gap: var(--fw-space-3);
    margin-bottom: var(--fw-space-8);
  }

  .block.active {
    border-left: 2px solid var(--fw-accent);
    padding-left: var(--fw-space-4);
  }

  .block h2 {
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
  }

  .block h3 {
    font-size: var(--fw-font-size-display-4);
    line-height: var(--fw-line-height-display-4);
  }

  .block ol {
    margin: 0;
    padding-left: var(--fw-space-5);
  }

  .block li + li {
    margin-top: var(--fw-space-2);
  }

  .anchors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
    gap: var(--fw-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .anchor {
    display: grid;
    gap: var(--fw-space-1);
    padding: var(--fw-space-2);
    border: 1px solid var(--fw-border);
    background: var(--fw-raised);
  }

  .anchor__chip {
    height: 48px;
    border: 1px solid var(--fw-border);
  }

  .anchor__name {
    color: var(--fw-text-muted);
    font-family: var(--fw-font-mono);
    font-size: var(--fw-font-size-body-xxs);
    letter-spacing: var(--fw-tracking-caps);
    text-transform: uppercase;
  }

  .anchor code {
    justify-self: start;
  }

  .fail {
    color: var(--fw-danger);
    font-weight: var(--fw-weight-semibold);
  }
</style>
