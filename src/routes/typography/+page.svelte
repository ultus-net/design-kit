<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';

  const displaySizes = Object.entries(tokens.primitives['font-size']).filter(([name]) =>
    name.startsWith('display-')
  );
  const bodySizes = Object.entries(tokens.primitives['font-size']).filter(
    ([name]) => !name.startsWith('display-')
  );

  const weights = Object.entries(tokens.primitives.weight);
  const lineHeights = tokens.primitives['line-height'] as Record<string, { value: string }>;
  const lineHeight = (name: string): string => lineHeights[name]?.value ?? '';
</script>

<PageHeader
  title="Typography"
  lede="Bricolage Grotesque carries display and body. JetBrains Mono carries identifiers, token names and numerals. Both are variable faces, self-hosted under the SIL Open Font License."
/>

<section class="block">
  <h2>Families</h2>
  <div class="families">
    <div class="family">
      <h3>Bricolage Grotesque</h3>
      <p class="note">Display and body. Axes opsz, wdth and wght.</p>
      <p class="family__sample" style="font-family: var(--fw-font-display)">
        Blueprint, measured not guessed.
      </p>
    </div>
    <div class="family">
      <h3>JetBrains Mono</h3>
      <p class="note">Identifiers, token names and tabular numerals. Axis wght.</p>
      <p class="family__sample" style="font-family: var(--fw-font-mono)">
        --fw-colour-blue-800 / 0A2A4A / 21.00
      </p>
    </div>
  </div>
</section>

<section class="block">
  <h2>Display scale</h2>
  <p class="note">
    Sizes and line heights come from tokens.json; the gate measures the surfaces they sit on.
  </p>
  {#each displaySizes as [name, entry] (name)}
    <div class="row">
      <div class="row__meta">
        <code>--fw-font-size-{name}</code>
        <span>{entry.value} / {lineHeight(name)}</span>
      </div>
      <p
        class="row__sample"
        style="font-family: var(--fw-font-display); font-size: var(--fw-font-size-{name}); line-height: var(--fw-line-height-{name})"
      >
        Blueprint, not ornament.
      </p>
    </div>
  {/each}
</section>

<section class="block">
  <h2>Body scale</h2>
  <p class="note">
    Bricolage Grotesque at 16 pixels is the working body size. Inputs sit at 15 pixels.
  </p>
  {#each bodySizes as [name, entry] (name)}
    <div class="row">
      <div class="row__meta">
        <code>--fw-font-size-{name}</code>
        <span>{entry.value} / {lineHeight(name)}</span>
      </div>
      <p
        class="row__sample"
        style="font-family: var(--fw-font-body); font-size: var(--fw-font-size-{name}); line-height: var(--fw-line-height-{name})"
      >
        Reading surface ink at 16 pixels, tool rows at 14.
      </p>
    </div>
  {/each}
</section>

<section class="block">
  <h2>Weights</h2>
  <div class="weights">
    {#each weights as [name, entry] (name)}
      <p class="weight" style="font-family: var(--fw-font-display); font-weight: {entry.value}">
        <span class="weight__sample">{entry.value}</span>
        <span class="weight__name">{name}</span>
      </p>
    {/each}
  </div>
</section>

<section class="block">
  <h2>Licensing</h2>
  <p class="note">
    Bricolage Grotesque and JetBrains Mono are licensed under the SIL Open Font License 1.1. The
    latin subsets ship in src/lib/assets/fonts, so the kit makes no font request at runtime.
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

  .note {
    max-width: 70ch;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }

  .families {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: var(--fw-space-4);
  }

  .family {
    display: grid;
    gap: var(--fw-space-2);
    padding: var(--fw-space-4);
    border: 1px solid var(--fw-border);
    background: var(--fw-raised);
  }

  .family__sample {
    font-size: var(--fw-font-size-display-4);
  }

  .row {
    display: grid;
    gap: var(--fw-space-2);
    padding: var(--fw-space-3) 0;
    border-top: 1px solid var(--fw-border);
  }

  .row__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-space-2);
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
  }

  .row__sample {
    overflow-wrap: anywhere;
  }

  .weights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
    gap: var(--fw-space-3);
  }

  .weight {
    display: grid;
    gap: var(--fw-space-1);
    padding: var(--fw-space-3);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
  }

  .weight__sample {
    font-size: var(--fw-font-size-display-2);
  }

  .weight__name {
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xxs);
  }
</style>
