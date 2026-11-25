<script lang="ts">
  import Combobox from '$lib/components/Combobox.svelte';

  interface Option {
    value: string;
    label: string;
  }

  const cities: Option[] = [
    { value: 'lisbon', label: 'Lisbon' },
    { value: 'london', label: 'London' },
    { value: 'lucerne', label: 'Lucerne' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'milan', label: 'Milan' },
    { value: 'munich', label: 'Munich' },
    { value: 'oslo', label: 'Oslo' }
  ];

  let selected = $state('');

  function handleSelect(option: Option) {
    selected = option.label;
  }
</script>

<div class="demo-stack">
  <Combobox
    label="City"
    options={cities}
    placeholder="Search cities"
    hint="Start typing to filter the list."
    onselect={handleSelect}
  />
  <p class="demo-selected">Selected: {selected || 'none'}</p>

  <Combobox
    label="City with an error"
    options={cities}
    value="Berlin"
    error="This city is not in the list."
  />

  <Combobox label="Disabled city" options={cities} value="Lisbon" disabled />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }

  .demo-selected {
    margin: 0;
    color: var(--fw-text-muted);
    font-size: var(--fw-font-size-body-xs);
  }
</style>
