<script lang="ts">
  import Tooltip from '$lib/components/Tooltip.svelte';

  let clicks = $state(0);
</script>

<div class="demo-stack">
  <Tooltip text="Removes this row" onclick={() => (clicks += 1)}>
    <span>Delete</span>
  </Tooltip>
  <Tooltip text="Each click adds one" onclick={() => (clicks += 1)}>
    <span>Click me</span>
  </Tooltip>
  <span class="clicks">{clicks} clicks</span>
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .clicks {
    font-size: var(--fw-font-size-body-xs);
    color: var(--fw-text-muted);
  }
</style>