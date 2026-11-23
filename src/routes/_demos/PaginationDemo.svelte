<script lang="ts">
  import Pagination from '$lib/components/Pagination.svelte';
</script>

<div class="demo-stack">
  <Pagination page={4} pageCount={20} hrefFor={(n) => `?page=${n}`} />
  <Pagination page={1} pageCount={5} />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
