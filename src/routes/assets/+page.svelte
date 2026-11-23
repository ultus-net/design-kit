<script lang="ts">
  import PageHeader from '../_PageHeader.svelte';

  interface Asset {
    url: string;
    name: string;
    group: string;
  }

  const fileName = (path: string): string => path.split('/').pop() ?? path;

  const toUrlMap = (modules: Record<string, unknown>): Record<string, string> =>
    Object.fromEntries(
      Object.entries(modules).map(([path, value]) => {
        if (typeof value !== 'string') {
          throw new Error(`Asset did not resolve to a URL: ${path}`);
        }
        return [path, value];
      })
    );

  const fontModules = toUrlMap(
    import.meta.glob('../../lib/assets/fonts/*', {
      eager: true,
      query: '?url',
      import: 'default'
    })
  );

  const toAsset = (path: string, url: string, group: string): Asset => ({
    url,
    name: fileName(path),
    group
  });

  const fonts = Object.entries(fontModules)
    .map(([path, url]) => toAsset(path, url, 'Fonts'))
    .sort((a, b) => a.name.localeCompare(b.name));
</script>

<PageHeader
  title="Assets"
  lede="Two variable font files ship inside the package. Both are latin subsets, so the build makes no request to a font network."
/>

<section class="block">
  <h2>Self-hosted faces</h2>
  <ul class="assets">
    {#each fonts as asset (asset.url)}
      <li>
        <span class="preview preview--file" aria-hidden="true">FILE</span>
        <a href={asset.url} download={asset.name}>{asset.name}</a>
      </li>
    {/each}
  </ul>
</section>

<section class="prose">
  <h2>Usage notes</h2>
  <ul>
    <li>Bricolage Grotesque and JetBrains Mono are licensed under the SIL Open Font License 1.1.</li>
    <li>The files are latin subsets. Add another subset only when a surface actually needs those glyphs.</li>
    <li>Declare both faces in fonts.css, then import tokens.css. Nothing else is required.</li>
  </ul>
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

  .assets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
    gap: var(--fw-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .assets li {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: var(--fw-space-3);
    padding: var(--fw-space-3);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
    background: var(--fw-raised);
    font-size: var(--fw-font-size-body-xxs);
  }

  .preview {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    padding: var(--fw-space-1);
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-sm);
    background: var(--fw-sunken);
    overflow: hidden;
  }

  .preview--file {
    color: var(--fw-text-muted);
    font-family: var(--fw-font-mono);
    font-size: var(--fw-font-size-body-xxs);
  }

  .assets a {
    overflow-wrap: anywhere;
  }
</style>
