<script lang="ts">
  import RadioGroup from '$lib/components/RadioGroup.svelte';

  const periods = [
    { value: 'monthly', label: 'Monthly', hint: 'Billed every month.' },
    { value: 'yearly', label: 'Yearly', hint: 'Two months free.' },
    { value: 'weekly', label: 'Weekly', hint: 'Paid weekly in arrears.' }
  ];

  const speeds = [
    { value: 'standard', label: 'Standard' },
    { value: 'express', label: 'Express' },
    { value: 'same-day', label: 'Same day', disabled: true }
  ];

  let period = $state('monthly');
  let speed = $state('');
</script>

<div class="demo-stack">
  <RadioGroup
    legend="Billing period"
    name="billing-period"
    options={periods}
    bind:value={period}
    hint="You can change the period at any time."
  />
  <RadioGroup
    legend="Delivery speed"
    name="delivery-speed"
    options={speeds}
    bind:value={speed}
    error={speed ? undefined : 'Choose a delivery speed.'}
  />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
