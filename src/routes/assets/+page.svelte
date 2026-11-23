<script lang="ts">
  import PageHeader from '../_PageHeader.svelte';

  interface Asset {
    url: string;
    name: string;
    group: string;
    preview: boolean;
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

  const logoModules = toUrlMap(
    import.meta.glob('../../lib/assets/logos/**/*.{svg,png}', {
      eager: true,
      query: '?url',
      import: 'default'
    })
  );

  const faviconModules = toUrlMap(
    import.meta.glob('../../lib/assets/favicons/*', {
      eager: true,
      query: '?url',
      import: 'default'
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
    group,
    preview: /\.(svg|png|ico)$/i.test(path)
  });

  const logos = Object.entries(logoModules)
    .map(([path, url]) =>
      toAsset(path, url, path.includes('/jacobsen/') ? 'Jacobsen logos' : 'J logos')
    )
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));

  const favicons = Object.entries(faviconModules)
    .map(([path, url]) => toAsset(path, url, 'Favicons'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const fonts = Object.entries(fontModules)
    .map(([path, url]) => toAsset(path, url, 'Fonts and licences'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const groups = [
    { title: 'Jacobsen logos', assets: logos.filter((asset) => asset.group === 'Jacobsen logos') },
    { title: 'J logos', assets: logos.filter((asset) => asset.group === 'J logos') },
    { title: 'Favicons', assets: favicons },
    { title: 'Fonts and licences', assets: fonts }
  ];
</script>

<PageHeader
  title="Assets"
  lede="Logos, favicons and font files ship inside the package. Every link below downloads the file from this build."
/>

{#each groups as group (group.title)}
  <section class="block">
    <h2>{group.title}</h2>
    <ul class="assets">
      {#each group.assets as asset (asset.url)}
        <li>
          {#if asset.preview}
            <span class="preview"><img src={asset.url} alt="" loading="lazy" /></span>
          {:else}
            <span class="preview preview--file" aria-hidden="true">FILE</span>
          {/if}
          <a href={asset.url} download={asset.name}>{asset.name}</a>
        </li>
      {/each}
    </ul>
  </section>
{/each}

<section class="prose">
  <h2>Usage notes</h2>
  <ul>
    <li>Logos keep their own colours. Use the dark mark on light surfaces and the white mark on chrome.</li>
    <li>Gibson and Unica are licensed for Jacobsens internal use. Do not redistribute them outside the company.</li>
    <li>Figtree and Inter are licensed under the SIL Open Font License; the OFL texts are in the font list.</li>
    <li>Favicon formats cover browsers, iOS, Android and Windows tiles.</li>
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

  .preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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
