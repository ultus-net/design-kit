<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<div class="demo-stack">
  <Breadcrumbs items={[
    { label: 'Orders', href: '?orders' },
    { label: 'FW-10428', href: '?order=FW-10428' },
    { label: 'Lines' }
  ]} />
  <Breadcrumbs
    label="Product catalog"
    items={[
      { label: 'Products', href: '?products' },
      { label: 'Electronics', href: '?category=electronics' },
      { label: 'Computers', href: '?category=computers' }
    ]}
  />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
