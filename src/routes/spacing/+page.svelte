<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';

  const spacing = Object.entries(tokens.primitives.space);
  const radii = Object.entries(tokens.primitives.radius);
  const shadows = Object.entries(tokens.primitives.shadow);
  const breakpoints = Object.entries(tokens.primitives.breakpoint);
</script>

<PageHeader
  title="Spacing and structure"
  lede="A 4px rhythm carries layout. Radii, shadows, breakpoints and motion are small, named sets so internal tools share one geometry."
/>

<section class="block">
  <h2>Spacing</h2>
  <p class="note">The scale is derived from a 4px base. Buttons use the extracted 20px pill radius.</p>
  <ul class="scale">
    {#each spacing as [name, entry] (name)}
      <li>
        <code>--fw-space-{name}</code>
        <span class="bar" style="width: var(--fw-space-{name})"></span>
        <span class="value">{entry.value}</span>
      </li>
    {/each}
  </ul>
</section>

<section class="block">
  <h2>Radii</h2>
  <ul class="tiles">
    {#each radii as [name, entry] (name)}
      <li>
        <span class="tile" style="border-radius: var(--fw-radius-{name})"></span>
        <code>--fw-radius-{name}</code>
        <span class="value">{entry.value}</span>
      </li>
    {/each}
  </ul>
</section>

<section class="block">
  <h2>Shadows</h2>
  <ul class="tiles">
    {#each shadows as [name, entry] (name)}
      <li>
        <span class="shadow" style="box-shadow: var(--fw-shadow-{name})"></span>
        <code>--fw-shadow-{name}</code>
        <span class="value">{entry.value}</span>
      </li>
    {/each}
  </ul>
</section>

<section class="block">
  <h2>Breakpoints</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Token</th><th>Width</th><th>Source</th></tr></thead>
      <tbody>
        {#each breakpoints as [name, entry] (name)}
          <tr>
            <td><code>--fw-breakpoint-{name}</code></td>
            <td>{entry.value}</td>
            <td>{entry.status}</td>
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

  .note {
    max-width: 70ch;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }

  .scale {
    display: grid;
    gap: var(--fw-space-2);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .scale li {
    display: grid;
    grid-template-columns: 140px minmax(0, 1fr) 56px;
    align-items: center;
    gap: var(--fw-space-3);
    font-size: var(--fw-font-size-body-xxs);
  }

  .bar {
    display: block;
    max-width: 100%;
    height: 12px;
    border-radius: var(--fw-radius-sm);
    background: var(--fw-accent);
  }

  .value {
    color: var(--fw-text-muted);
    font-family: var(--fw-font-mono);
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
    gap: var(--fw-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tiles li {
    display: grid;
    gap: var(--fw-space-2);
    font-size: var(--fw-font-size-body-xxs);
  }

  .tile {
    height: 64px;
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-sunken);
  }

  .shadow {
    height: 64px;
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
  }

  @media (max-width: 420px) {
    .scale li {
      grid-template-columns: 96px minmax(0, 1fr) 48px;
    }
  }

  .table-wrap {
    overflow-x: auto;
  }

  .table-wrap table {
    width: 100%;
    font-size: var(--fw-font-size-body-xs);
  }

  .table-wrap th,
  .table-wrap td {
    padding: var(--fw-space-2) var(--fw-space-3);
    text-align: left;
  }

  .table-wrap th {
    font-weight: var(--fw-weight-semibold);
    border-bottom: 1px solid var(--fw-border-strong);
  }

  .demo-wrap {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: var(--fw-space-3);
    margin-bottom: var(--fw-space-5);
  }

  .demo-label {
    font-weight: var(--fw-weight-semibold);
    font-size: var(--fw-font-size-body-xs);
    color: var(--fw-text-muted);
  }

  .demo-panel {
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    padding: var(--fw-space-5);
    box-shadow: var(--fw-shadow-sm);
  }

  .demo-heading {
    font-size: var(--fw-font-size-display-2);
    margin: 0 0 var(--fw-space-2);
  }

  .demo-body {
    font-size: var(--fw-font-size-body);
  }

  .demo-action {
    background: var(--fw-accent);
    color: var(--fw-on-accent);
    border-radius: var(--fw-radius-pill);
    padding: var(--fw-space-2) var(--fw-space-4);
    font-size: var(--fw-font-size-body-s);
  }

  @media (max-width: 768px) {
    .demo-wrap {
      grid-template-columns: minmax(0, 1fr);
    }

    .demo-label {
      font-size: var(--fw-font-size-body-xxs);
    }
  }
</style>
