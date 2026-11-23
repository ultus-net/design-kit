<script lang="ts">
  import PageHeader from '../_PageHeader.svelte';

  const usage = `:root {
  background: var(--fw-page);
  color: var(--fw-text);
}

.panel {
  background: var(--fw-raised);
  border: 1px solid var(--fw-border);
}

.action {
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  border: 1px solid var(--fw-accent);
}`;
</script>

<PageHeader
  title="Guidelines"
  lede="Rules for the three surfaces this kit serves. Each rule is checkable, and the measurement that makes it checkable is named beside it."
/>

<div class="prose">
  <h2>Global invariants</h2>
  <div class="table-wrap">
    <table class="rules-table">
      <thead>
        <tr><th>Rule</th><th>Enforced by</th></tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Rule">No colour outside tokens.json</td>
          <td data-label="Enforced by">Consult the primitive and semantic tokens; npm run contrast fails the build on a measured regression.</td>
        </tr>
        <tr>
          <td data-label="Rule">Radius 0, shadow none</td>
          <td data-label="Enforced by">Every --fw-radius-* resolves to 0px and every --fw-shadow-* to none. A literal radius or shadow is a defect.</td>
        </tr>
        <tr>
          <td data-label="Rule">Text pairs at least 4.5:1</td>
          <td data-label="Enforced by">npm run contrast asserts 31 pairs per mode: 26 text pairs at 4.5:1 and 5 structural pairs at 3:1.</td>
        </tr>
        <tr>
          <td data-label="Rule">Structural rules and focus at least 3:1</td>
          <td data-label="Enforced by">The same gate covers border on page, raised and sunken, plus strong border and focus on page.</td>
        </tr>
        <tr>
          <td data-label="Rule">A pastel is a fill, and text only where measured</td>
          <td data-label="Enforced by">The pastel measures 1.92:1 on whiteprint and 6.84:1 on cyanotype. Whiteprint text uses accent-strong; cyanotype may use the pastel.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>Three surfaces</h2>
  <div class="table-wrap">
    <table class="rules-table">
      <thead>
        <tr><th>Surface</th><th>Default mode</th><th>Rules</th></tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Surface">Reading</td>
          <td data-label="Default mode">whiteprint</td>
          <td data-label="Rules">Measure at or below 68 characters. One signal moment per viewport: the primary action. Display type for headings only. Links use link, never accent.</td>
        </tr>
        <tr>
          <td data-label="Surface">App</td>
          <td data-label="Default mode">cyanotype</td>
          <td data-label="Rules">Rows are 32px compact or 40px default. Numerals are mono and tabular, right-aligned in tables. Status is a tint fill plus matching text, never colour alone. One accent fill per row or panel. Destructive actions use danger. Focus is 2px focus at 2px offset and is never removed.</td>
        </tr>
        <tr>
          <td data-label="Surface">Documentation</td>
          <td data-label="Default mode">whiteprint</td>
          <td data-label="Rules">Mono for identifiers, token names and commands. 1px for construction, 2px for a section cut; the colour stays border. Show the failing example beside the passing one. Every claim carries its measurement or it is removed.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>Type</h2>
  <ul>
    <li>Bricolage Grotesque carries display and body. JetBrains Mono carries identifiers, token names and numerals.</li>
    <li>Both faces are self-hosted latin subsets under the SIL Open Font License 1.1. No proprietary face is permitted.</li>
    <li>Body is 16px, dense rows 14px, inputs 15px. Do not set body copy in the display tier beyond its heading role.</li>
  </ul>

  <h2>Colour</h2>
  <ul>
    <li>Style with semantic tokens only. Primitives are reference values; a component that reads --fw-colour-* directly is a defect.</li>
    <li>An accent fill takes on-accent ink. On paper, text uses accent-strong, not accent.</li>
    <li>Status is always text plus a tint. Never colour alone.</li>
  </ul>

  <h2>Tells</h2>
  <ul>
    <li>Defect: pill buttons, offset drop shadows, or thick black card borders on white. That is neubrutalism, a different and more common look.</li>
    <li>Defect: gradients, glassmorphism or blurred panels. The kit has no blur and no elevation.</li>
    <li>Defect: emoji used as icons.</li>
    <li>Defect: a centred hero with three feature cards.</li>
    <li>Defect: all-caps at every level instead of one label tier.</li>
    <li>Defect: neon on pure black. The cyanotype ground is #0A2A4A.</li>
    <li>Defect: any radius or shadow literal.</li>
  </ul>

  <h2>Token usage</h2>
  <pre><code>{usage}</code></pre>

  <h2>Migration checklist</h2>
  <ol>
    <li>Install the package or vendor dist/ into the host repository.</li>
    <li>Import @ultus-net/formwork/fonts.css, then tokens.css, before host styles.</li>
    <li>Set data-mode to light or dark on the document root, and persist it under fw-mode before paint.</li>
    <li>Map host tokens to kit tokens. --page-bg maps to --fw-page and --page-fg to --fw-text.</li>
    <li>Replace raw hex and palette classes with semantic tokens.</li>
    <li>Replace bespoke buttons, badges and alerts with the shipped components.</li>
    <li>Run npm run contrast plus the host test suite, then check 320, 768 and 1280 widths for overflow.</li>
    <li>Record the change in the host changelog and remove the superseded local components.</li>
  </ol>

  <h2>The gate</h2>
  <p>
    npm run contrast computes every pair in the Node script and prints 62 pairs, 0 failures; it
    exits non-zero on any miss. npm run check must report zero errors and zero warnings before a
    change lands. Readers new to the vocabulary can start with the
    <a href="/cheatsheet">cheatsheet</a>.
  </p>
</div>

<style>
  @media (max-width: 640px) {
    .rules-table,
    .rules-table tbody,
    .rules-table tr,
    .rules-table td {
      display: block;
      min-width: 0;
      width: 100%;
    }

    .rules-table thead {
      display: none;
    }

    .rules-table tr {
      padding: var(--fw-space-3) 0;
      border-bottom: 1px solid var(--fw-border);
    }

    .rules-table tr:last-child {
      border-bottom: 0;
    }

    .rules-table td {
      padding: 0;
      border: 0;
    }

    .rules-table td + td {
      margin-top: var(--fw-space-2);
    }

    .rules-table td::before {
      display: block;
      margin-bottom: 2px;
      color: var(--fw-text-muted);
      font-size: var(--fw-font-size-body-xxs);
      font-weight: var(--fw-weight-semibold);
      letter-spacing: var(--fw-tracking-caps);
      text-transform: uppercase;
      content: attr(data-label);
    }
  }
</style>
