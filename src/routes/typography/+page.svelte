<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';

  type Family = 'brand' | 'fallback';
  let family = $state<Family>('brand');

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
  lede="Gibson carries display and headings. Unica carries body copy, labels and controls. Figtree and Inter are self-hosted open fallbacks under the SIL Open Font License."
/>

<div class="toolbar">
  <p class="eyebrow">Specimen source</p>
  <div class="toggle" role="group" aria-label="Specimen source">
    <button type="button" aria-pressed={family === 'brand'} onclick={() => (family = 'brand')}>
      Brand faces
    </button>
    <button type="button" aria-pressed={family === 'fallback'} onclick={() => (family = 'fallback')}>
      Open fallbacks
    </button>
  </div>
</div>

<div class="specimen" class:is-fallback={family === 'fallback'}>
  <section class="block">
    <h2>Display scale</h2>
    <p class="note">
      Sizes and line heights are extracted from the marketing site. The toggle swaps Gibson for
      Figtree without changing the scale.
    </p>
    {#each displaySizes as [name, entry] (name)}
      <div class="row">
        <div class="row__meta">
          <code>--fw-font-size-{name}</code>
          <span>{entry.value} / {lineHeight(name)}</span>
        </div>
        <p
          class="row__sample"
          style="font-family: var(--specimen-display); font-size: var(--fw-font-size-{name}); line-height: var(--fw-line-height-{name})"
        >
          Residential orders, clearly handled
        </p>
      </div>
    {/each}
  </section>

  <section class="block">
    <h2>Body scale</h2>
    <p class="note">
      Unica at 16 pixels is the working body size. Inputs sit at the extracted 15 pixels.
    </p>
    {#each bodySizes as [name, entry] (name)}
      <div class="row">
        <div class="row__meta">
          <code>--fw-font-size-{name}</code>
          <span>{entry.value} / {lineHeight(name)}</span>
        </div>
        <p
          class="row__sample"
          style="font-family: var(--specimen-body); font-size: var(--fw-font-size-{name}); line-height: var(--fw-line-height-{name})"
        >
          Commercial and residential jobs share one queue and one set of controls.
        </p>
      </div>
    {/each}
  </section>

  <section class="block">
    <h2>Weights</h2>
    <div class="weights">
      {#each weights as [name, entry] (name)}
        <p class="weight" style="font-family: var(--specimen-body); font-weight: {entry.value}">
          <span class="weight__sample">{entry.value}</span>
          <span class="weight__name">{name}</span>
        </p>
      {/each}
    </div>
  </section>
</div>

<section class="block">
  <h2>Licensing</h2>
  <p class="note">
    Gibson and Unica are licensed brand faces bundled for Jacobsens internal use. Figtree and Inter
    are open fallbacks; their OFL texts ship beside the font files in the package.
  </p>
</section>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-3);
    margin-bottom: var(--fw-space-6);
  }

  .toggle {
    display: flex;
    gap: var(--fw-space-1);
  }

  .toggle button {
    padding: var(--fw-space-2) var(--fw-space-3);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
    cursor: pointer;
  }

  .toggle button[aria-pressed='true'] {
    border-color: var(--fw-accent);
    background: var(--fw-accent);
    color: var(--fw-on-accent);
  }

  .specimen {
    --specimen-display: var(--fw-font-display);
    --specimen-body: var(--fw-font-body);
  }

  .specimen.is-fallback {
    --specimen-display: var(--fw-font-display-fallback);
    --specimen-body: var(--fw-font-body-fallback);
  }

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
