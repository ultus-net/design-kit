import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Select from './Select.svelte';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' }
];

describe('Select', () => {
  it('renders the labelled options', () => {
    render(Select, { props: { label: 'Plan', options } });

    const select = screen.getByLabelText('Plan') as HTMLSelectElement;
    expect(select).toBeInstanceOf(HTMLSelectElement);
    expect([...select.options].map((option) => option.text)).toEqual(['Alpha', 'Beta']);
  });

  it('carries the disabled option and the bound value', () => {
    render(Select, {
      props: {
        label: 'Plan',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta', disabled: true }
        ],
        value: 'b'
      }
    });

    const select = screen.getByLabelText('Plan') as HTMLSelectElement;
    const beta = [...select.options].find((option) => option.value === 'b');

    expect(beta?.disabled).toBe(true);
    expect(select.value).toBe('b');
  });

  it('describes an error and omits aria-invalid without one', async () => {
    const { rerender } = render(Select, {
      props: { label: 'Plan', options, error: 'Pick one' }
    });

    const select = screen.getByLabelText('Plan');
    const describedBy = select.getAttribute('aria-describedby') ?? '';
    const description = describedBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent)
      .join(' ');

    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(description).toBe('Pick one');

    await rerender({ error: undefined });

    expect(screen.getByLabelText('Plan').getAttribute('aria-invalid')).toBeNull();
  });

  it('forwards a caller id to the select and the label', () => {
    const { container } = render(Select, {
      props: { label: 'Plan', id: 'billing-plan', options }
    });

    const select = screen.getByLabelText('Plan') as HTMLSelectElement;

    expect(select.tagName).toBe('SELECT');
    expect(select.id).toBe('billing-plan');
    expect(container.querySelector('label')?.htmlFor).toBe('billing-plan');
  });
});
