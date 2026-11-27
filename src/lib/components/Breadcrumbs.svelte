<script lang="ts">
  interface Props {
    items: Array<{ label: string; href?: string }>;
    label?: string;
  }

  let { items, label = 'Breadcrumbs' }: Props = $props();
</script>

{#if items.length > 0}
  <nav class="fw-breadcrumbs" aria-label={label}>
    <ol class="fw-breadcrumbs__list">
      {#each items as item, index}
        <li class="fw-breadcrumbs__item">
          {#if index > 0}
            <span class="fw-breadcrumbs__separator" aria-hidden="true">/</span>
          {/if}
          {#if index === items.length - 1}
            <span class="fw-breadcrumbs__text" aria-current="page">{item.label}</span>
          {:else if item.href}
            <a class="fw-breadcrumbs__link" href={item.href}>{item.label}</a>
          {:else}
            <span class="fw-breadcrumbs__text">{item.label}</span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style>
  .fw-breadcrumbs {
    display: flex;
    flex-wrap: wrap;
  }

  .fw-breadcrumbs__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    gap: var(--fw-space-1);
  }

  .fw-breadcrumbs__item {
    display: flex;
    align-items: center;
  }

  .fw-breadcrumbs__link {
    color: var(--fw-link);
    text-decoration: none;
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
  }

  .fw-breadcrumbs__link:hover {
    text-decoration: underline;
  }

  .fw-breadcrumbs__link:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
  }

  .fw-breadcrumbs__text {
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-body-xs);
  }

  .fw-breadcrumbs__text[aria-current='page'] {
    color: var(--fw-text-muted);
  }

  .fw-breadcrumbs__separator {
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }
</style>
