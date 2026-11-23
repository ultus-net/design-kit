<script lang="ts">
  import Field from '$lib/components/Field.svelte';

  interface DemoFieldControl {
    id: string;
    required: boolean | undefined;
    invalid: boolean | undefined;
    'aria-describedby': string | undefined;
  }
</script>

{#snippet emailControl(control: DemoFieldControl)}
  <input
    class="demo-input"
    type="email"
    id={control.id}
    required={control.required}
    aria-invalid={control.invalid}
    aria-describedby={control['aria-describedby']}
  />
{/snippet}

{#snippet textControl(control: DemoFieldControl)}
  <input
    class="demo-input"
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

  .demo-input {
    width: 100%;
    padding: var(--fw-space-3);
    border: 1px solid var(--fw-border-strong);
    background: var(--fw-raised);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-size: var(--fw-font-size-input);
    line-height: var(--fw-line-height-input);
  }

  .demo-input:focus-visible {
    outline: 2px solid var(--fw-focus);
    outline-offset: 2px;
    border-color: var(--fw-accent);
  }

  .demo-input[aria-invalid='true'] {
    border-color: var(--fw-danger);
  }
</style>
