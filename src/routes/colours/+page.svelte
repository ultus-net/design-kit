<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';
  import { contrastRatio, ratioText, themePairs, type Theme } from '../_page';

  const themes: (Theme & { id: string })[] = Object.entries(tokens.themes).map(([id, theme]) => ({
    id,
    ...theme
  }));
  const primitives = Object.entries(tokens.primitives.colour);
</script>

<PageHeader
  title="Colours"
  lede="Blueprint ground, two modes. Every ratio on this page is computed in the browser from tokens.json, and npm run contrast asserts the same pairs at build time."
/>

<section class="block">
  <h2>Primitives</h2>
  <ul class="swatches">
    {#each primitives as [name, entry] (name)}
      <li class="swatch">
        <span class="swatch__chip" style="background: var(--fw-colour-{name})"></span>
        <span class="swatch__name">{name}</span>
        <span class="swatch__value">{entry.value}</span>
        <span class="swatch__status" class:is-derived={entry.status === 'derived'}>{entry.status}</span>
      </li>
    {/each}
  </ul>
</section>

{#each themes as theme (theme.id)}
  <section class="block">
    <h2>{theme.id}</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Pair</th><th>Ratio</th><th>Minimum</th><th>Result</th><th>Values</th></tr>
        </thead>
        <tbody>
          {#each themePairs as pair (pair.foreground + pair.background)}
            {@const foreground = theme.tokens[pair.foreground]}
            {@const background = theme.tokens[pair.background]}
            {#if foreground && background}
              {@const ratio = contrastRatio(foreground.value, background.value)}
              <tr>
                <td>{pair.label}</td>
                <td>{ratioText(ratio)}</td>
                <td>{pair.minimum}:1</td>
                <td class:fail={ratio < pair.minimum}>{ratio >= pair.minimum ? 'Pass' : 'Fail'}</td>
                <td><code>{foreground.value}</code> on <code>{background.value}</code></td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </section>
{/each}

<section class="block">
  <h2>Pastel as ink</h2>
  <p>
    On whiteprint the pastel <code>#B9A7F2</code> measures 1.92:1 and is fill-only, so text uses
    <code>accent-strong</code>. On cyanotype the same pastel measures 6.84:1 and is legal annotation
    text.
  </p>
</section>

<style>
  .block {
    display: grid;
    gap: var(--fw-space-3);
    margin-bottom: var(--fw-space-8);
  }

  .block h2 {
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 1fr));
    gap: var(--fw-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .swatch {
    display: grid;
    gap: var(--fw-space-1);
    padding: var(--fw-space-2);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
  }

  .swatch__chip {
    height: 56px;
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
  }

  .swatch__name {
    font-family: var(--fw-font-mono);
    font-size: var(--fw-font-size-body-xxs);
  }

  .swatch__value {
    color: var(--fw-text-muted);
    font-family: var(--fw-font-mono);
    font-size: var(--fw-font-size-body-xxs);
  }

  .swatch__status {
    color: var(--fw-success);
    font-size: var(--fw-font-size-body-xxs);
    text-transform: uppercase;
    letter-spacing: var(--fw-tracking-caps);
  }

  .swatch__status.is-derived {
    color: var(--fw-info);
  }

  .fail {
    color: var(--fw-danger);
    font-weight: var(--fw-weight-semibold);
  }

  @media (max-width: 420px) {
    .swatches {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
