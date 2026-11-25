import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import RadioGroup from './RadioGroup.svelte';

const options = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' }
];

function renderGroup(props: Record<string, unknown> = {}) {
  return render(RadioGroup, {
    props: { legend: 'Billing period', name: 'billing', options, ...props }
  });
}

describe('RadioGroup', () => {
  it('names the group with the legend', () => {
    renderGroup();

    const group = screen.getByRole('group', { name: 'Billing period' });

    expect(group.tagName).toBe('FIELDSET');
  });

  it('checks exactly one radio and follows the value prop', () => {
    renderGroup({ value: 'yearly' });

    const checked = screen
      .getAllByRole('radio')
      .filter((radio) => (radio as HTMLInputElement).checked);

    expect(checked).toHaveLength(1);
    expect(checked[0]).toBe(screen.getByRole('radio', { name: 'Yearly' }));
  });

  it('moves selection and focus with arrow keys, wrapping at the ends', async () => {
    renderGroup({ value: 'monthly' });

    const group = screen.getByRole('group', { name: 'Billing period' });
    const monthly = screen.getByRole('radio', { name: 'Monthly' }) as HTMLInputElement;
    const yearly = screen.getByRole('radio', { name: 'Yearly' }) as HTMLInputElement;
    const weekly = screen.getByRole('radio', { name: 'Weekly' }) as HTMLInputElement;

    await fireEvent.keyDown(group, { key: 'ArrowDown' });
    await tick();

    expect(yearly.checked).toBe(true);
    expect(document.activeElement).toBe(yearly);

    await fireEvent.keyDown(group, { key: 'ArrowUp' });
    await tick();

    expect(monthly.checked).toBe(true);
    expect(document.activeElement).toBe(monthly);

    await fireEvent.keyDown(group, { key: 'ArrowUp' });
    await tick();

    expect(weekly.checked).toBe(true);
    expect(document.activeElement).toBe(weekly);
  });

  it('skips a disabled option when arrowing from the first enabled option', async () => {
    renderGroup({
      value: 'monthly',
      options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly', disabled: true },
        { value: 'weekly', label: 'Weekly' }
      ]
    });

    const group = screen.getByRole('group', { name: 'Billing period' });
    const monthly = screen.getByRole('radio', { name: 'Monthly' }) as HTMLInputElement;
    const weekly = screen.getByRole('radio', { name: 'Weekly' }) as HTMLInputElement;

    monthly.focus();
    await fireEvent.keyDown(group, { key: 'ArrowDown' });
    await tick();

    expect(weekly.checked).toBe(true);
    expect(document.activeElement).toBe(weekly);
  });

  it('starts at the first enabled option on ArrowDown and the last on ArrowUp without a value', async () => {
    const first = renderGroup();
    const group = screen.getByRole('group', { name: 'Billing period' });

    await fireEvent.keyDown(group, { key: 'ArrowDown' });
    await tick();

    const monthly = screen.getByRole('radio', { name: 'Monthly' }) as HTMLInputElement;

    expect(monthly.checked).toBe(true);
    expect(document.activeElement).toBe(monthly);

    first.unmount();

    renderGroup();
    const freshGroup = screen.getByRole('group', { name: 'Billing period' });

    await fireEvent.keyDown(freshGroup, { key: 'ArrowUp' });
    await tick();

    const weekly = screen.getByRole('radio', { name: 'Weekly' }) as HTMLInputElement;

    expect(weekly.checked).toBe(true);
    expect(document.activeElement).toBe(weekly);
  });

  it('wires an error to the group and lists hint then error in aria-describedby', () => {
    const { container } = renderGroup({
      hint: 'Cancel any time.',
      error: 'Choose a billing period.'
    });

    const group = screen.getByRole('group', { name: 'Billing period' });
    const hint = container.querySelector('.fw-radio-group__hint');
    const error = container.querySelector('.fw-radio-group__error');

    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(`${hint?.id} ${error?.id}`);
    expect(screen.getByText('Choose a billing period.')).toBeTruthy();
  });
});
