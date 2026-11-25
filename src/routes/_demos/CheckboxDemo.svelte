<script lang="ts">
  import Checkbox from '$lib/components/Checkbox.svelte';

  let releases = $state(true);
  let terms = $state(false);
</script>

<div class="demo-stack">
  <Checkbox label="Email releases" hint="At most one message a month." bind:checked={releases} />
  <Checkbox
    label="Accept the terms"
    hint="Required before you can publish."
    error={terms ? undefined : 'You must accept the terms.'}
    bind:checked={terms}
  />
  <Checkbox label="Select all rows" hint="Some rows are selected." indeterminate />
  <Checkbox label="Archived projects" hint="Archived projects stay read-only." disabled />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
