<script lang="ts">
  import tokens from '$lib/tokens/tokens.json';
  import Alert from '$lib/components/Alert.svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import Input from '$lib/components/Input.svelte';
  import PageHeader from '../_PageHeader.svelte';
  import { getChrome } from '../_chrome.svelte';

  interface CornerPreset {
    id: string;
    label: string;
    source: string;
    tokens: Record<string, { value: string; status: string }>;
  }

  const chrome = getChrome();

  const presets = Object.entries(tokens.corners as Record<string, CornerPreset>).map(
    ([id, preset]) => ({ ...preset, id })
  );
  const steps = Object.keys(presets[0].tokens);
</script>

<PageHeader
  title="Corners"
  lede="Three presets, one radius scale. Sharp is the default; soft and round soften the same components without touching borders, shadows or density."
/>

<section class="block">
  <h2>Values</h2>
  <div class="table-wrap">
    <table class="stack-table">
      <thead>
        <tr>
          <th>Step</th>
          {#each presets as preset (preset.id)}<th>{preset.label}</th>{/each}
        </tr>
      </thead>
      <tbody>
        {#each steps as step (step)}
          <tr>
            <td data-label="Step"><code>--fw-{step}</code></td>
            {#each presets as preset (preset.id)}
              <td data-label={preset.label}><code>{preset.tokens[step].value}</code></td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

{#each presets as preset (preset.id)}
  <section class="block" class:active={chrome.corners === preset.id}>
    <h2>{preset.label}</h2>
    <p>{preset.source}</p>
    <div class="samples" data-corners={preset.id}>
      <div class="corner-sample">
        <Button>Primary action</Button>
      </div>
      <div class="corner-sample">
        <Input
          id={`corners-${preset.id}-input`}
          label="Input label"
          hint="Hint text sits under the input."
        />
      </div>
      <div class="corner-sample">
        <Card title="Card">
          <p>Text on the card surface.</p>
        </Card>
      </div>
      <div class="corner-sample">
        <Alert variant="info">A short message on the alert surface.</Alert>
      </div>
    </div>
  </section>
{/each}

<style>
  .block {
    display: grid;
    gap: var(--fw-space-3);
    margin-bottom: var(--fw-space-8);
  }

  .block.active {
    border-left: 2px solid var(--fw-accent);
    padding-left: var(--fw-space-4);
  }

  .block h2 {
    font-size: var(--fw-font-size-display-3);
    line-height: var(--fw-line-height-display-3);
  }

  .samples {
    display: grid;
    gap: var(--fw-space-3);
  }

  .corner-sample {
    display: grid;
    gap: var(--fw-space-3);
  }
</style>
