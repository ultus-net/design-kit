import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import Checkbox from './Checkbox.svelte';

describe('Checkbox', () => {
  it('reflects indeterminate onto the DOM property', async () => {
    render(Checkbox, { props: { label: 'Select all', indeterminate: true } });
    await tick();

    const input = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;

    expect(input.indeterminate).toBe(true);
  });

  it('associates the label with the checkbox', () => {
    render(Checkbox, { props: { label: 'Email me' } });

    const input = screen.getByLabelText('Email me');

    expect(input.tagName).toBe('INPUT');
    expect((input as HTMLInputElement).type).toBe('checkbox');
  });

  it('wires an error to aria-invalid and lists hint then error in aria-describedby', () => {
    const { container } = render(Checkbox, {
      props: { label: 'Accept terms', hint: 'Required to continue.', error: 'You must accept.' }
    });

    const input = screen.getByLabelText('Accept terms');
    const hint = container.querySelector('.fw-checkbox__hint');
    const error = container.querySelector('.fw-checkbox__error');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(`${hint?.id} ${error?.id}`);
    expect(error?.textContent).toBe('You must accept.');
  });

  it('toggles on a click when enabled', async () => {
    render(Checkbox, { props: { label: 'Email me' } });

    const input = screen.getByLabelText('Email me') as HTMLInputElement;

    expect(input.checked).toBe(false);

    await fireEvent.click(input);
    await tick();

    expect(input.checked).toBe(true);
  });

  it('blocks interaction when disabled', async () => {
    render(Checkbox, { props: { label: 'Archived', disabled: true } });

    const input = screen.getByLabelText('Archived') as HTMLInputElement;

    await fireEvent.click(input);
    await tick();

    expect(input.disabled).toBe(true);
    expect(input.checked).toBe(false);
  });

  it('forwards a caller id to the checkbox and the label, and lets a caller describedby win', () => {
    render(Checkbox, {
      props: {
        label: 'Email me',
        id: 'opt-in',
        'aria-describedby': 'external-note',
        hint: 'Daily digest.',
        error: 'Pick one.'
      }
    });

    const found = document.getElementById('opt-in');
    // A missing forward leaves getElementById null, so this fails rather than
    // passing on a stale node.
    expect(found).toBeInstanceOf(HTMLInputElement);

    const input = found as HTMLInputElement;
    const label = input.closest('label');

    expect(label?.tagName).toBe('LABEL');
    expect(input.id).toBe('opt-in');
    expect(label?.htmlFor).toBe('opt-in');
    expect(screen.getByLabelText('Email me')).toBe(input);
    // The caller's describedby overrides the list, but the error still marks the control.
    expect(input.getAttribute('aria-invalid')).toBe('true');
    // Pins the documented escape hatch: a caller who sets aria-describedby opts out
    // of the hint/error wiring.
    expect(input.getAttribute('aria-describedby')).toBe('external-note');
  });
});
