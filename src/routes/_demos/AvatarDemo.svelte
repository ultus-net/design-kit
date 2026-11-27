<script lang="ts">
  import Avatar from '$lib/components/Avatar.svelte';
</script>

<div class="demo-row">
  <Avatar name="Design Kit" src="/favicon.svg" alt="Design Kit mark" />
  <Avatar name="Ada Lovelace" />
  <Avatar name="Ada" />
</div>

<style>
  .demo-row {
    display: flex;
    align-items: center;
    gap: var(--fw-space-3);
  }
</style>
