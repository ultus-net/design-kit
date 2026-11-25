<script lang="ts">
  import Textarea from '$lib/components/Textarea.svelte';

  let notes = $state('Add one line per change.');
</script>

<div class="demo-stack">
  <Textarea label="Release notes" hint="Markdown is supported." bind:value={notes} />
  <Textarea label="Summary" rows={2} placeholder="One or two sentences." />
  <Textarea label="Reason" error="A reason is required." required />
  <Textarea label="Internal comment" hint="Only your team can read this." disabled />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
