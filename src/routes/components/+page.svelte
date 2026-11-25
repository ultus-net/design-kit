<script lang="ts">
  import Alert from '$lib/components/Alert.svelte';
  import AppShell from '$lib/components/AppShell.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import Stat from '$lib/components/Stat.svelte';
  import PageHeader from '../_PageHeader.svelte';
  import DialogDemo from '../_demos/DialogDemo.svelte';
  import FieldDemo from '../_demos/FieldDemo.svelte';
  import PaginationDemo from '../_demos/PaginationDemo.svelte';
  import TableDemo from '../_demos/TableDemo.svelte';
  import TabsDemo from '../_demos/TabsDemo.svelte';
  import ToastDemo from '../_demos/ToastDemo.svelte';

  let email = $state('dispatch@example.com');
  let density = $state('compact');
  let loading = $state(false);

  const options = [
    { value: 'compact', label: 'Compact' },
    { value: 'default', label: 'Default' }
  ];
</script>

<PageHeader
  title="Components"
  lede="Fourteen Svelte 5 components built on tokens only. Props are typed, markup is plain, and no component requires Tailwind."
/>

{#snippet shellBrand()}
  <a href="/">formwork</a>
{/snippet}

{#snippet shellNav()}
  <a href="/components">Components</a>
{/snippet}

{#snippet shellActions()}
  <Button size="sm" href="/guidelines">Guidelines</Button>
{/snippet}

<section class="block">
  <h2>Button</h2>
  <p class="note">Primary, secondary, ghost and danger, in three sizes, with disabled and loading states.</p>
  <div class="row">
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Delete order</Button>
  </div>
  <div class="row">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
  <div class="row">
    <Button disabled>Disabled</Button>
    <Button loading={loading} onclick={() => (loading = !loading)}>
      {loading ? 'Loaded' : 'Toggle loading'}
    </Button>
  </div>
</section>

<section class="block">
  <h2>Input and Select</h2>
  <div class="form-grid">
    <Input
      label="Email"
      bind:value={email}
      type="email"
      hint="Confirmations go to this address."
      required
    />
    <Input label="Reference" value="FW-10428" hint="Read only in the demo." disabled />
    <Select
      label="Density"
      bind:value={density}
      options={options}
      hint="Sets row height in dense tools."
    />
    <Input label="Project key" value="blueprint-021" error="This key already exists." />
  </div>
</section>

<section class="block">
  <h2>Badge</h2>
  <div class="row">
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="success">Matched</Badge>
    <Badge variant="warning">Held</Badge>
    <Badge variant="danger">Unmatched</Badge>
    <Badge variant="info">New</Badge>
    <Badge variant="review">Needs review</Badge>
  </div>
</section>

<section class="block">
  <h2>Alert</h2>
  <div class="alerts">
    <Alert variant="success" title="Import complete">42 orders landed in the queue.</Alert>
    <Alert variant="warning" title="Three orders held">Address lines need a human check.</Alert>
    <Alert variant="danger" title="Import failed">The carrier feed returned an invalid payload.</Alert>
    <Alert variant="info" title="Cut-off at 14:00">Orders after the cut-off ship the next business day.</Alert>
  </div>
</section>

<section class="block">
  <h2>Card and Stat</h2>
  <div class="grid">
    <Card title="Today">
      <p>18 orders imported, 3 held for review, 15 sent to the floor.</p>
    </Card>
    <Stat label="Queue depth" value="128" delta="12 fewer than yesterday" tone="success" />
    <Stat label="Held orders" value="3" delta="Needs review" tone="warning" />
  </div>
</section>

<section class="block">
  <h2>Table</h2>
  <p class="note">Default and dense rows, tabular numerals, and a scroll region that takes keyboard focus.</p>
  <TableDemo />
</section>

<section class="block">
  <h2>Field</h2>
  <p class="note">Label, hint and error wired through aria-describedby and aria-invalid.</p>
  <FieldDemo />
</section>

<section class="block">
  <h2>Pagination</h2>
  <p class="note">Anchors or buttons, aria-current on the active page, and an ellipsis window.</p>
  <PaginationDemo />
</section>

<section class="block">
  <h2>Tabs</h2>
  <p class="note">Roving tabindex with arrow, Home and End keys on the native button role.</p>
  <TabsDemo />
</section>

<section class="block">
  <h2>Dialog</h2>
  <p class="note">Native dialog element with showModal, a token backdrop and focus return.</p>
  <DialogDemo />
</section>

<section class="block">
  <h2>Toast</h2>
  <p class="note">A polite live region by default, alert for danger, and no timers.</p>
  <ToastDemo />
</section>

<section class="block">
  <h2>AppShell</h2>
  <p class="note">Brand, nav and actions are snippets. The demo is content-height rather than viewport-height.</p>
  <div class="shell">
    <AppShell height="content" brand={shellBrand} nav={shellNav} actions={shellActions}>
      <p>Page content sits on the page surface inside the shell.</p>
    </AppShell>
  </div>
</section>

<style>
  .block {
    display: grid;
    gap: var(--fw-space-3);
    margin-bottom: var(--fw-space-8);
  }

  .block h2 {
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
  }

  .note {
    max-width: 70ch;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--fw-space-3);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
    gap: var(--fw-space-4);
  }

  .alerts {
    display: grid;
    gap: var(--fw-space-3);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: var(--fw-space-4);
    align-items: start;
  }

  .shell {
    overflow: hidden;
    border: 1px solid var(--fw-border);
    border-radius: var(--fw-radius-md);
  }

  @media (max-width: 420px) {
    .row :global(.fw-button) {
      min-width: 0;
      flex: 1 1 100%;
    }
  }
</style>
