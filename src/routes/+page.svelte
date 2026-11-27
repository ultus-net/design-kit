<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from './_PageHeader.svelte';

  const routes = [
    { href: '/colours', title: 'Colours', body: 'Three palette families, each with light and dark, and every measured pair.' },
    { href: '/typography', title: 'Typography', body: 'Bricolage Grotesque and JetBrains Mono, self-hosted variable faces.' },
    { href: '/spacing', title: 'Spacing', body: 'The 4px rhythm, corner presets, breakpoints and motion.' },
    { href: '/components', title: 'Components', body: 'Twenty Svelte 5 components built on tokens only.' },
    { href: '/assets', title: 'Assets', body: 'Self-hosted font files and their licence.' },
    { href: '/guidelines', title: 'Guidelines', body: 'The rules, the surfaces and the tells that mark generated work.' }
  ];
</script>

<PageHeader
  title="Design Kit"
  lede="A personal brand kit with a blueprint palette and brutalist construction. Prussian blue ground, whiteprint paper, one pastel signal, sharp corners by default. Every ratio is measured by the same script that gates the build."
/>

<div class="hero">
  <div class="hero__copy">
    <Badge variant="success">Version {tokens.meta.version}</Badge>
    <h2>Three profiles, two modes, three corner presets</h2>
    <p>
      Blueprint, oxide and ledger are hand-authored in both modes. The contrast gate measures all 186
      pairs and refuses a regression in any of them.
    </p>
    <div class="hero__actions">
      <Button href="/components">Browse components</Button>
      <Button href="/colours" variant="secondary">Inspect colours</Button>
    </div>
  </div>
  <div class="hero__specimen">
    <p class="eyebrow">Specimen</p>
    <p class="hero__display">Blueprint</p>
    <p class="hero__body">Bricolage Grotesque at 16 pixels on the page surface.</p>
    <div class="hero__row">
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  </div>
</div>

<div class="cards">
  {#each routes as route (route.href)}
    <Card title={route.title}>
      <p class="card-copy">{route.body}</p>
      <p class="card-link"><a href={route.href}>Open {route.title.toLowerCase()}</a></p>
    </Card>
  {/each}
</div>

<section class="notes">
  <h2>What ships</h2>
  <ul>
    <li><code>tokens.css</code> with one primitive set, three colour profiles and two modes per profile.</li>
    <li><code>fonts.css</code> with two self-hosted variable faces under the SIL Open Font License.</li>
    <li><code>tailwind.css</code> as an opt-in Tailwind v4 bridge.</li>
    <li>Three profiles in one <code>tokens.css</code>, selected with the <code>data-profile</code> attribute.</li>
    <li>Three corner presets, switchable with the <code>data-corners</code> attribute.</li>
    <li>Twenty Svelte 5 components, including a dense table and a native dialog.</li>
    <li><code>npm run contrast</code> asserting 186 pairs across three profiles and exiting non-zero on a failure.</li>
    <li><code>npm test</code> covering the token schema and the interactive components.</li>
  </ul>
</section>

<style>
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--fw-space-6);
    padding: var(--fw-space-6);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-lg);
    background: var(--fw-raised);
  }

  .hero__copy {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: var(--fw-space-4);
  }

  .hero h2 {
    font-size: var(--fw-font-size-display-2);
    line-height: var(--fw-line-height-display-2);
  }

  .hero__copy p {
    color: var(--fw-text-muted);
    max-width: 58ch;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-space-3);
    padding-top: var(--fw-space-2);
  }

  .hero__specimen {
    display: grid;
    align-content: center;
    gap: var(--fw-space-3);
    padding: var(--fw-space-5);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-sunken);
  }

  .hero__display {
    font-family: var(--fw-font-display);
    font-size: var(--fw-font-size-display-1);
    line-height: var(--fw-line-height-display-1);
  }

  .hero__body {
    color: var(--fw-text-muted);
  }

  .hero__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-space-2);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--fw-space-4);
    margin-top: var(--fw-space-6);
  }

  .card-copy {
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }

  .card-link {
    margin-top: var(--fw-space-3);
    font-size: var(--fw-font-size-body-xs);
  }

  .notes {
    display: grid;
    gap: var(--fw-space-3);
    margin-top: var(--fw-space-8);
    padding-top: var(--fw-space-5);
    border-top: 1px solid var(--fw-border);
  }

  .notes h2 {
    font-size: var(--fw-font-size-display-3);
  }

  .notes ul {
    display: grid;
    gap: var(--fw-space-2);
    margin: 0;
    padding-left: var(--fw-space-5);
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
      padding: var(--fw-space-4);
    }
  }

  @media (max-width: 420px) {
    .hero {
      padding: var(--fw-space-3);
    }

    .hero__actions :global(.fw-button) {
      min-width: 0;
      flex: 1 1 100%;
    }
  }
</style>
