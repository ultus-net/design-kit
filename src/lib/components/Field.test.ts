import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Field from './Field.svelte';

interface FieldControlLike {
  id: string;
  required: boolean | undefined;
  invalid: boolean | undefined;
  'aria-describedby': string | undefined;
}

// createRawSnippet hands the snippet its params as getters, so read them lazily.
const control = createRawSnippet<[FieldControlLike]>((getControl) => ({
  render: () => {
    const args = getControl();
    const required = args.required ? 'required' : '';
    const invalid = args.invalid ? 'aria-invalid="true"' : '';
    const describedBy = args['aria-describedby']
      ? `aria-describedby="${args['aria-describedby']}"`
      : '';

    return `<input id="${args.id}" ${required} ${invalid} ${describedBy} />`;
  }
}));

function renderField(props: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}) {
  return render(Field, { props: { ...props, children: control } });
}

describe('Field', () => {
  it('associates the label with the control', () => {
    renderField({ id: 'email', label: 'Email' });

    const input = screen.getByLabelText('Email');
    expect(input.tagName).toBe('INPUT');
    expect(input.id).toBe('email');
  });

  it('lists the hint and error ids in aria-describedby, hint first', () => {
    renderField({ id: 'email', label: 'Email', hint: 'Work address.', error: 'Required.' });

    expect(screen.getByLabelText('Email').getAttribute('aria-describedby')).toBe(
      'email-hint email-error'
    );
  });

  it('marks the control invalid when an error is present', () => {
    renderField({ id: 'project-key', label: 'Project key', error: 'This key already exists.' });

    expect(screen.getByLabelText('Project key').getAttribute('aria-invalid')).toBe('true');
  });

  it('marks required controls and hides the asterisk from assistive tech', () => {
    const { container } = renderField({ id: 'email', label: 'Email', required: true });

    expect(screen.getByLabelText('Email').hasAttribute('required')).toBe(true);
    expect(container.querySelector('.fw-field__required')?.getAttribute('aria-hidden')).toBe('true');
  });
});
