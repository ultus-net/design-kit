<script lang="ts">
  import Switch from '$lib/components/Switch.svelte';

  let alerts = $state(true);
  let digest = $state(false);
</script>

<div class="demo-stack">
  <Switch label="Email alerts" hint="Sent when a run fails." bind:checked={alerts} />
  <Switch label="Weekly digest" hint="A summary every Monday." bind:checked={digest} />
  <Switch label="Beta features" hint="This account is not in the beta." disabled />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
