import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Input from './Input.svelte';

describe('Input', () => {
  it('associates the label with the control', () => {
    render(Input, { props: { label: 'Email', type: 'email' } });

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.type).toBe('email');
  });

  it('describes the control with the hint and marks an invalid error', () => {
    render(Input, { props: { label: 'Email', hint: 'Work address', error: 'Required' } });

    const input = screen.getByLabelText('Email');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const descriptions = describedBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);

    expect(descriptions).toEqual(['Work address', 'Required']);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('marks a required field and honours disabled', () => {
    const { container } = render(Input, {
      props: { label: 'Email', required: true, disabled: true }
    });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const label = container.querySelector('label');

    // The asterisk is aria-hidden, so the label text still matches by regex.
    expect(screen.getByLabelText(/Email/)).toBe(input);
    expect(label?.htmlFor).toBe(input.id);
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(container.querySelector('.fw-field__required')?.getAttribute('aria-hidden')).toBe('true');
  });
});
