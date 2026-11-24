<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Dialog from '$lib/components/Dialog.svelte';

  let open = $state(false);
</script>

<div class="demo-stack">
  <div class="demo-trigger">
    <Button onclick={() => (open = true)}>Delete orders</Button>
  </div>

  <Dialog
    id="delete-orders"
    title="Delete 12 orders"
    description="This cannot be undone."
    bind:open
  >
    <p class="demo-copy">
      Deleting 12 orders removes them and their line items from every report and export.
    </p>

    {#snippet actions()}
      <Button variant="secondary" onclick={() => (open = false)}>Keep</Button>
      <Button variant="danger" onclick={() => (open = false)}>Delete</Button>
    {/snippet}
  </Dialog>
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .demo-trigger {
    justify-self: start;
  }

  .demo-copy {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-s);
  }
</style>
