<script lang="ts">
  import Field from '$lib/components/Field.svelte';
  import Input from '$lib/components/Input.svelte';

  interface DemoFieldControl {
    id: string;
    required: boolean | undefined;
    invalid: boolean | undefined;
    'aria-describedby': string | undefined;
  }
</script>

{#snippet emailControl(control: DemoFieldControl)}
  <Input
    label=""
    type="email"
    id={control.id}
    required={control.required}
    aria-invalid={control.invalid}
    aria-describedby={control['aria-describedby']}
  />
{/snippet}

{#snippet textControl(control: DemoFieldControl)}
  <Input
    label=""
    type="text"
    id={control.id}
    required={control.required}
    aria-invalid={control.invalid}
    aria-describedby={control['aria-describedby']}
  />
{/snippet}

<div class="demo-stack">
  <Field
    id="demo-email"
    label="Email"
    hint="Confirmations go to this address."
    children={emailControl}
  />
  <Field
    id="demo-project-key"
    label="Project key"
    hint="Lowercase letters, digits and hyphens."
    error="This key already exists."
    required
    children={textControl}
  />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: var(--fw-space-5);
  }
</style>
