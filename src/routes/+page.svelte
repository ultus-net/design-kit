<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import PageHeader from './_PageHeader.svelte';

  const routes = [
    { href: '/colours', title: 'Colours', body: 'Primitives, six theme combinations, and measured WCAG ratios.' },
    { href: '/typography', title: 'Typography', body: 'Gibson over Unica, the extracted scale, and open fallbacks.' },
    { href: '/spacing', title: 'Spacing', body: 'The 4px rhythm, radii, shadows, breakpoints and motion.' },
    { href: '/components', title: 'Components', body: 'Eight components built on tokens only.' },
    { href: '/assets', title: 'Assets', body: 'Logos, favicons and font files ready to download.' },
    { href: '/guidelines', title: 'Guidelines', body: 'Internal-tool rules, accessibility and a migration checklist.' }
  ];
</script>

<PageHeader
  title="The Jacobsens brand, as working parts"
  lede="Tokens, components and guidance extracted from the marketing site at c0461971. Built for internal tools first; the cream canvas, navy chrome and pill primary actions carry the brand."
/>

<div class="hero">
  <div class="hero__copy">
    <Badge variant="success">Version 0.1.0</Badge>
    <h2>One kit, three sections, two modes</h2>
    <p>
      Every value is marked extracted or derived. Switched sections repaint the accent, chrome and
      tints; dark mode is a derived companion the marketing site does not ship.
    </p>
    <div class="hero__actions">
      <Button href="/components">Browse components</Button>
      <Button href="/colours" variant="secondary">Inspect colours</Button>
    </div>
  </div>
  <div class="hero__specimen">
    <p class="eyebrow">Specimen</p>
    <p class="hero__display">Gibson display</p>
    <p class="hero__body">Unica body copy at 16 pixels, set on the page surface.</p>
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
    <li><code>tokens.css</code> for primitives and six section-and-mode palettes.</li>
    <li><code>fonts.css</code> for brand faces and the Figtree and Inter fallbacks.</li>
    <li><code>tailwind.css</code> as an opt-in Tailwind v4 bridge.</li>
    <li>Eight Svelte 5 components exported from the package root.</li>
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
    box-shadow: var(--fw-shadow-sm);
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
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
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

    .hero__actions :global(.jcs-button) {
      min-width: 0;
      flex: 1 1 100%;
    }
  }
</style>
