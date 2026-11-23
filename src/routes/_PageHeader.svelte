<script lang="ts">
  interface Props {
    eyebrow?: string;
    title: string;
    lede: string;
  }

  let { eyebrow = 'Brand kit', title, lede }: Props = $props();
</script>

<header class="page-head">
  <p class="eyebrow">{eyebrow}</p>
  <h1 class="page-title">{title}</h1>
  <p class="lede">{lede}</p>
</header>

<style>
  .page-title {
    font-size: var(--fw-font-size-display-1);
    line-height: var(--fw-line-height-display-1);
  }

  @media (max-width: 420px) {
    .page-title {
      font-size: var(--fw-font-size-display-2);
      line-height: var(--fw-line-height-display-2);
    }
  }
</style>
