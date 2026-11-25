<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import PageHeader from '../_PageHeader.svelte';

  const spacing = Object.entries(tokens.primitives.space);
  const breakpoints = Object.entries(tokens.primitives.breakpoint);
  const motion = Object.entries(tokens.primitives.motion);
</script>

<PageHeader
  title="Spacing and structure"
  lede="A 4px rhythm carries layout. Radius comes from the active corner preset and shadow stays off, so structure comes from spacing and 1px rules."
/>

<section class="block">
  <h2>Spacing</h2>
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
  <p>
    Radius comes from the active corner preset. <code>sharp</code> is the default and writes no
    attribute. Pick another preset on <a href="/corners">the corners page</a>.
  </p>
</section>

<section class="block">
  <h2>Breakpoints</h2>
  <div class="table-wrap">
    <table class="stack-table">
      <thead><tr><th>Token</th><th>Width</th><th>Status</th></tr></thead>
      <tbody>
        {#each breakpoints as [name, entry] (name)}
          <tr>
            <td data-label="Token"><code>--fw-breakpoint-{name}</code></td>
            <td data-label="Width">{entry.value}</td>
            <td data-label="Status">{entry.status}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="block">
  <h2>Motion</h2>
  <div class="table-wrap">
    <table class="stack-table">
      <thead><tr><th>Token</th><th>Value</th><th>Status</th></tr></thead>
      <tbody>
        {#each motion as [name, entry] (name)}
          <tr>
            <td data-label="Token"><code>--fw-motion-{name}</code></td>
            <td data-label="Value">{entry.value}</td>
            <td data-label="Status">{entry.status}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="block">
  <h2>Shadows</h2>
  <p>
    <code>--fw-shadow-*</code> tokens all resolve to <code>none</code>. The kit has no elevation; use
    a surface change or a rule instead.
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

  .scale {
    display: grid;
    gap: var(--fw-space-2);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .scale li {
    display: grid;
    grid-template-columns: 140px 104px 56px;
    justify-content: start;
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

  @media (max-width: 420px) {
    .scale li {
      grid-template-columns: 96px 76px 48px;
    }
  }
</style>
