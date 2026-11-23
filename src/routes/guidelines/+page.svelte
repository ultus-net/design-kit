<script lang="ts">
  import PageHeader from '../_PageHeader.svelte';

  const usage = `:root {
  background: var(--fw-page);
  color: var(--fw-text);
}

.panel {
  background: var(--fw-raised);
  border: 1px solid var(--fw-border);
  border-radius: var(--fw-radius-md);
}

.action {
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  border-radius: var(--fw-radius-pill);
}`;
</script>

<PageHeader
  title="Guidelines"
  lede="Rules for internal tools: token-only colour, accessible defaults, deliberate density and a migration path for existing surfaces."
/>

<div class="prose">
  <h2>Internal-tool rules</h2>
  <ul>
    <li>Reference tokens, never raw colour. A component stylesheet contains only <code>var(--fw-*)</code> references.</li>
    <li>Set both <code>data-section</code> and <code>data-mode</code> on the root element. Every token below <code>--fw-page</code> depends on both attributes.</li>
    <li>Keep host tokens unprefixed. The kit claims only the <code>--fw-</code> namespace so host systems keep <code>--page-bg</code>, <code>--accent</code> and their status names.</li>
    <li>Use display faces for headings, chrome and numerals. Use the body face for copy, labels, inputs and tables.</li>
    <li>Primary actions are pills. One primary action per view; secondary and ghost actions carry the rest.</li>
    <li>Use hairlines and surface changes before shadows. Shadows are for menus and dialogs.</li>
    <li>Write Roman headings and sentence-case labels. No emoji, no decorative gradients.</li>
  </ul>

  <h2>Accessibility</h2>
  <ul>
    <li>Body text meets 4.5:1 against its surface in all six section-and-mode combinations. The contrast script checks each pair and fails the build on a regression.</li>
    <li>Non-text boundaries, including strong borders and focus rings, meet 3:1 against the page.</li>
    <li>Residential accent pairs with white, not cream. The cream pair measures 4.26:1 and is rejected.</li>
    <li>Muted text uses the derived <code>--fw-text-muted</code> at 5.00:1 on cream. Grey 600 is decoration only.</li>
    <li>Focus is a 2px ring at 2px offset. Never remove it; the ring uses the extracted blue at 3.27:1, which clears the non-text minimum.</li>
    <li>Status colour never carries meaning alone. Pair every badge with a word, and every alert with a title.</li>
    <li>Respect reduced motion. Component transitions drop to none under <code>prefers-reduced-motion</code>.</li>
    <li>New to these terms? The <a href="/cheatsheet">cheatsheet</a> defines token, contrast ratio and WCAG AA in plain language.</li>
  </ul>

  <h2>Density</h2>
  <ul>
    <li>Default body size is 16px; dense tables may drop to 14px. Inputs sit at 15px to match the marketing forms.</li>
    <li>Use the 4px spacing rhythm. Compact rows use 8px vertical padding; comfortable rows use 12px or 16px.</li>
    <li>Keep the content measure at or below 78 characters for prose. Tool panes may run full width to 1600px.</li>
    <li>Cards use a 12px radius and a hairline border. Pills use the extracted 20px radius.</li>
  </ul>

  <h2>Surface treatments</h2>
  <ul>
    <li><strong>Choose one surface treatment per product.</strong> Brand for marketing-facing surfaces, sharp for dense operator tools.</li>
    <li>Do not mix pill and square actions in one view. A sharp dashboard uses square buttons; a marketing page uses pill actions.</li>
    <li>Sharp is derived, not extracted from the marketing site. It reduces radius, shadows and motion for scan-friendly interfaces.</li>
  </ul>

  <h2>Roadmap: Web Components</h2>
  <ul>
    <li>The CSS tokens and class recipes are the portable contract.</li>
    <li>Custom elements are the next layer, built once a second framework is real.</li>
    <li>No duplicate component library until then.</li>
  </ul>
  <p class="note">
    See <code>docs/web-components.md</code> for the design direction.
  </p>

  <h2>Migration checklist</h2>
  <ol>
    <li>Install the package or vendor <code>dist/</code> into the host repository.</li>
    <li>Import <code>@jacobsens/brand-kit/fonts.css</code>, then <code>tokens.css</code>, before host styles.</li>
    <li>Set <code>data-section</code> and <code>data-mode</code> on the document root. Persist the choice and apply it before paint.</li>
    <li>Map host tokens to kit tokens. For the dashboard, <code>--page-bg</code> maps to <code>--fw-page</code> and <code>--page-fg</code> to <code>--fw-text</code>.</li>
    <li>Replace raw hex and palette classes in components with semantic tokens.</li>
    <li>Replace bespoke buttons, badges and alerts with the pack shipped here.</li>
    <li>Run the host test suite plus the kit contrast script, then check 320, 768 and 1280 widths for overflow.</li>
    <li>Record the migration in the host changelog and remove the superseded local components.</li>
  </ol>

  <h2>Token usage</h2>
  <pre><code>{usage}</code></pre>

  <h2>Tailwind bridge</h2>
  <p>
    The bridge is opt-in. Import <code>tailwind.css</code> after <code>tailwindcss</code> to receive
    namespaced colour, font, radius, text and breakpoint utilities. Hosts that do not use Tailwind
    lose nothing: the components are plain CSS.
  </p>
</div>
