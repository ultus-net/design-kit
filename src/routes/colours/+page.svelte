<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';
  import { contrastRatio, ratioText, themePairs, type Mode } from '../_page';

  const profiles = Object.entries(tokens.profiles);
  const modes = ['light', 'dark'] as const;
  const primitives = Object.entries(tokens.primitives.colour);
  const signalRows = profiles.flatMap(([, profile]) =>
    modes.map((mode) => {
      const { tokens: modeTokens }: Mode = profile.modes[mode];
      return {
        key: `${profile.label} ${mode}`,
        profile: profile.label,
        mode,
        ratio: contrastRatio(modeTokens.accent.value, modeTokens.page.value)
      };
    })
  );
</script>

<PageHeader
  title="Colours"
  lede="Three profiles, two modes each. Every ratio on this page is computed in the browser from tokens.json, and npm run contrast asserts all 186 pairs at build time."
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

{#each profiles as [id, profile] (id)}
  {#each modes as mode (mode)}
    {@const modeTokens: Mode = profile.modes[mode]}
    <section class="block">
      <h2>{profile.label} — {mode}</h2>
      <div class="table-wrap">
        <table>
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
{/each}

<section class="block">
  <h2>Pastel as ink</h2>
  <p>
    The signal is a fill. Where its ratio against the page falls below 4.5:1 it may never carry text,
    so labels use accent-strong.
  </p>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Profile</th><th>Mode</th><th>Signal on page</th><th>Verdict</th></tr>
      </thead>
      <tbody>
        {#each signalRows as row (row.key)}
          {@const legal = row.ratio >= 4.5}
          <tr>
            <td>{row.profile}</td>
            <td>{row.mode}</td>
            <td>{ratioText(row.ratio)}</td>
            <td class:fail={!legal}>{legal ? 'Legal as text' : 'Fill only'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
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
