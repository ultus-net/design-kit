<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import Alert from '$lib/components/Alert.svelte';
  import PageHeader from '../_PageHeader.svelte';
  import { contrastRatio, ratioText, themePairs, type Theme } from '../_page';

  const themes: Record<string, Theme> = tokens.themes;
  const themeList = Object.entries(themes).map(([id, theme]) => ({ id, ...theme }));
  const primitives = Object.entries(tokens.primitives.colour);

  const palette = (name: keyof typeof tokens.primitives.colour): string =>
    tokens.primitives.colour[name].value;

  const shownPairs = [
    'text/page',
    'text-muted/page',
    'link/page',
    'on-accent/accent',
    'on-danger/danger',
    'chrome-text/chrome',
    'border-strong/page',
    'focus/page',
    'success/success-tint',
    'warning/warning-tint',
    'danger/danger-tint',
    'info/info-tint',
    'review/review-tint'
  ];

  const pairs = themePairs.filter((pair) =>
    shownPairs.includes(`${pair.foreground}/${pair.background}`)
  );

  const findings = [
    { label: 'Ink on cream', foreground: palette('ink'), background: palette('cream'), note: 'Body text, light mode' },
    { label: 'Cream on about', foreground: palette('cream'), background: palette('about-primary'), note: '5.50:1 pass' },
    { label: 'Cream on commercial', foreground: palette('cream'), background: palette('commercial-primary'), note: '12.33:1 pass' },
    { label: 'Cream on residential', foreground: palette('cream'), background: palette('residential-primary'), note: 'Rejected: 4.26:1 fails AA' },
    { label: 'White on residential', foreground: palette('white'), background: palette('residential-primary'), note: 'Derived correction: 4.55:1' },
    { label: 'Cream on residential secondary', foreground: palette('cream'), background: palette('residential-secondary'), note: '5.59:1 for small text' },
    { label: 'Grey 600 on cream', foreground: palette('grey-600'), background: palette('cream'), note: 'Rejected: 4.45:1 fails AA' },
    { label: 'Muted correction on cream', foreground: palette('muted-aa'), background: palette('cream'), note: 'Derived: 5.00:1' },
    { label: 'Error on cream', foreground: palette('error'), background: palette('cream'), note: '4.65:1 pass' },
    { label: 'Link blue on cream', foreground: palette('focus-ring'), background: palette('cream'), note: '3.27:1, focus ring only' },
    { label: 'Link correction on cream', foreground: palette('link-aa'), background: palette('cream'), note: 'Derived: 5.65:1' }
  ];
</script>

<PageHeader
  title="Colours"
  lede="The palette is extracted from the marketing site. Six section-and-mode combinations derive from three section themes. Every ratio below is computed in the browser from tokens.json."
/>

<section class="block">
  <h2>Primitives</h2>
  <p class="note">
    Extracted values are copied from the marketing site. Derived values are accessibility
    corrections or dark-mode companions added by this kit.
  </p>
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

<section class="block">
  <h2>Measured findings</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Pair</th><th>Foreground</th><th>Background</th><th>Ratio</th><th>Reading</th></tr>
      </thead>
      <tbody>
        {#each findings as finding (finding.label)}
          {@const ratio = contrastRatio(finding.foreground, finding.background)}
          <tr>
            <td>{finding.label}</td>
            <td><code>{finding.foreground}</code></td>
            <td><code>{finding.background}</code></td>
            <td class:fail={ratio < 4.5}>{ratioText(ratio)}</td>
            <td>{finding.note}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="block">
  <h2>Accessibility corrections</h2>
  <div class="alerts">
    <Alert variant="warning" title="Residential accent needs white, not cream">
      Cream on residential primary measures 4.26:1 and fails AA for normal text. The kit sets the
      semantic <code>--fw-on-accent</code> token to white in that section, which measures 4.55:1, and
      uses cream with the secondary at 5.59:1 for small text. The contrast script asserts
      <code>on-accent</code> against <code>accent</code> and keeps that pair at or above 4.5.
    </Alert>
    <Alert variant="info" title="Muted body text moved to 6B6B6B">
      Grey 600 measures 4.45:1 on cream and misses AA by a hair. The semantic muted token uses the
      derived 6B6B6B at 5.00:1. Grey 600 remains a primitive for decoration only.
    </Alert>
    <Alert variant="info" title="Link blue is a ring, not text">
      The site's link blue measures 3.27:1 on cream. It is kept for the 2px focus ring, where the
      non-text minimum is 3:1. Text links use the derived 306699 at 5.65:1.
    </Alert>
  </div>
</section>

{#each themeList as theme (theme.id)}
  <section class="block">
    <h2>{theme.section} / {theme.mode}</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Pair</th><th>Ratio</th><th>Minimum</th><th>Result</th><th>Values</th></tr>
        </thead>
        <tbody>
          {#each pairs as pair (pair.foreground + pair.background)}
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

  .note {
    max-width: 70ch;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
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

  .alerts {
    display: grid;
    gap: var(--fw-space-3);
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
