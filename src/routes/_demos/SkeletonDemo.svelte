<script lang="ts">
  import Skeleton from '$lib/components/Skeleton.svelte';
</script>

<div class="demo-stack">
  <Skeleton shape="line" />
  <Skeleton shape="block" />
  <Skeleton shape="circle" />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-4);
    max-width: 320px;
  }
</style>
