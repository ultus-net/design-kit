<script lang="ts">
  import PageHeader from '../_PageHeader.svelte';

  const terms = [
    ['Token', 'A named value, such as a colour, a radius or a spacing step', 'src/lib/tokens/tokens.json'],
    ['CSS custom property', 'A CSS variable. It starts with two dashes and holds one value', '--fw-text'],
    ['Primitives', 'The raw values copied from the marketing site', 'tokens.primitives'],
    ['Themes', 'The six section-and-mode combinations', 'tokens.themes'],
    ['Derived value', 'A value this kit corrects or adds, rather than extracts', 'marked derived'],
    ['Data attribute', 'An extra word on an HTML element that switches styling', 'data-mode="dark"'],
    ['Component', 'A reusable piece of interface with props and markup', 'src/lib/components/'],
    ['Prop', 'An input a component accepts', 'variant, size, disabled'],
    ['Static build', 'Plain HTML, CSS and JS that needs no server to read it', 'build/'],
    ['Hydration', 'The browser taking over static HTML and making it interactive', 'runs after first paint'],
    ['Viewport', 'The visible width of the browser window', 'tested at 320 to 1280'],
    ['Breakpoint', 'A viewport width where the layout changes', 'tokens.primitives.breakpoint'],
    ['Contrast ratio', 'How different two colours are in brightness', '1:1 to 21:1'],
    ['WCAG AA', 'The accessibility level most policies require', '4.5:1 text, 3:1 non-text'],
    ['Focus ring', 'The outline showing which control the keyboard is on', '--fw-focus']
  ] as const;

  const tasks = [
    ['Change a colour', 'Edit tokens.json, then run npm run tokens', 'Generated CSS updates and every component follows'],
    ['Check accessibility', 'npm run contrast', 'Prints every pair and exits non-zero on a miss'],
    ['Preview the site', 'npm run dev', 'Serves http://localhost:5173 with reload'],
    ['Build static files', 'npm run build', 'Writes HTML and assets to build/'],
    ['Type-check', 'npm run check', 'Reports type and markup errors'],
    ['Ship the package', 'npm run package', 'Writes the library to dist/']
  ] as const;

  const reading = [
    {
      group: 'Accessibility standard',
      items: [
        ['WCAG 2.2 Quick Reference', 'https://www.w3.org/WAI/WCAG22/quickref/', 'Every success criterion, grouped by level, with the technique for each.'],
        ['Understanding 1.4.3 Contrast (Minimum)', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', 'Why normal text needs 4.5:1 and large text needs 3:1.'],
        ['Understanding 1.4.11 Non-text Contrast', 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', 'Why borders, icons and focus rings need 3:1.']
      ]
    },
    {
      group: 'Colour and contrast',
      items: [
        ['web.dev: Color and contrast', 'https://web.dev/learn/accessibility/color-contrast', 'A short course with worked examples and the maths behind the ratio.']
      ]
    },
    {
      group: 'CSS and HTML basics',
      items: [
        ['MDN: Using CSS custom properties', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties', 'What a variable starting with two dashes actually does.'],
        ['MDN: data-* attributes', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/data-*', 'The attribute family this kit uses for section, mode and corners.'],
        ['MDN: prefers-reduced-motion', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion', 'How a page detects a user who asked for less motion.']
      ]
    },
    {
      group: 'The toolchain',
      items: [
        ['Svelte 5 overview', 'https://svelte.dev/docs/svelte/overview', 'The component syntax, props and snippets used in src/lib/components.'],
        ['SvelteKit introduction', 'https://svelte.dev/docs/kit/introduction', 'Routing and prerendering, which produces the static build.'],
        ['Vite guide', 'https://vite.dev/guide/', 'The dev server and the production build behind both commands.'],
        ['Tailwind theme', 'https://tailwindcss.com/docs/theme', 'How the generated bridge maps tokens to utility classes.']
      ]
    }
  ] as const;
</script>

<PageHeader
  title="Cheatsheet"
  lede="The words this kit uses, in plain terms, plus the sources worth reading when you need the detail. No frontend background assumed."
/>

<section class="block">
  <h2>Start here</h2>
  <p class="note">
    This kit is a colour and type system that ships as code. You do not need frontend experience to
    use it. Read the table, copy a token, then run the contrast command.
  </p>
</section>

<section class="block">
  <h2>Words you will meet</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Term</th><th>Plain meaning</th><th>Where it lives</th></tr>
      </thead>
      <tbody>
        {#each terms as [term, meaning, where] (term)}
          <tr>
            <td><strong>{term}</strong></td>
            <td>{meaning}</td>
            <td><code>{where}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="block">
  <h2>Common tasks</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Task</th><th>Command or file</th><th>What you get</th></tr>
      </thead>
      <tbody>
        {#each tasks as [task, how, result] (task)}
          <tr>
            <td>{task}</td>
            <td><code>{how}</code></td>
            <td>{result}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="block">
  <h2>Further reading</h2>
  <p class="note">Grouped by the question you are likely asking. Every link was checked and returns a live page.</p>
  {#each reading as entry (entry.group)}
    <h3>{entry.group}</h3>
    <ul class="reading">
      {#each entry.items as [label, href, note] (href)}
        <li>
          <a {href} rel="noreferrer">{label}</a>
          <span class="reading__note">{note}</span>
        </li>
      {/each}
    </ul>
  {/each}
</section>

<style>
  .reading {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--fw-space-5);
    display: grid;
    gap: var(--fw-space-3);
  }

  .reading__note {
    display: block;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-s);
  }
</style>
