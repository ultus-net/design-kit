<script lang="ts">
  import Progress from '$lib/components/Progress.svelte';
</script>

<div class="demo-stack">
  <Progress label="Upload" value={40} />
  <Progress label="Step" value={1} max={4} />
  <Progress label="Loading" />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-4);
    max-width: 320px;
  }
</style>
