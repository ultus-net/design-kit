<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';

  let messages = $state([
    { id: 'info-1', tone: 'info' as const, title: 'Heads up', body: 'A new profile is available.' },
    { id: 'success-1', tone: 'success' as const, title: 'Saved', body: 'Your changes are stored.' },
    {
      id: 'warning-1',
      tone: 'warning' as const,
      title: 'Check your input',
      body: 'Two fields need attention.'
    },
    {
      id: 'danger-1',
      tone: 'danger' as const,
      title: 'Upload failed',
      body: 'The file exceeded the size limit.'
    }
  ]);
</script>

<div class="demo-stack">
  <Toast
    {messages}
    onDismiss={(id) => (messages = messages.filter((message) => message.id !== id))}
  />
  <Toast
    assertive
    messages={[
      {
        id: 'danger-2',
        tone: 'danger' as const,
        title: 'Connection lost',
        body: 'Retrying in the background.'
      }
    ]}
  />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
