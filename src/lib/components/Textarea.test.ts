import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Textarea from './Textarea.svelte';

describe('Textarea', () => {
  it('associates the label with the textarea', () => {
    render(Textarea, { props: { label: 'Release notes' } });

    const textarea = screen.getByLabelText('Release notes');

    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('reflects rows and defaults to four', () => {
    const { unmount } = render(Textarea, { props: { label: 'Release notes' } });

    expect(screen.getByLabelText('Release notes').getAttribute('rows')).toBe('4');

    unmount();

    render(Textarea, { props: { label: 'Release notes', rows: 8 } });

    expect(screen.getByLabelText('Release notes').getAttribute('rows')).toBe('8');
  });

  it('forwards data and ARIA attributes to the textarea', () => {
    render(Textarea, {
      props: { label: 'Release notes', 'data-testid': 'notes', 'aria-label': 'Notes field' }
    });

    const textarea = screen.getByTestId('notes');

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.getAttribute('aria-label')).toBe('Notes field');
  });

  it('wires an error to aria-invalid and lists hint then error in aria-describedby', () => {
    const { container } = render(Textarea, {
      props: { label: 'Reason', hint: 'Keep it short.', error: 'A reason is required.' }
    });

    const textarea = screen.getByLabelText('Reason');
    const hint = container.querySelector('.fw-textarea__hint');
    const error = container.querySelector('.fw-textarea__error');

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.getAttribute('aria-describedby')).toBe(`${hint?.id} ${error?.id}`);
    expect(error?.textContent).toBe('A reason is required.');
  });

  it('forwards a caller id, and lets a caller describedby win over the hint', () => {
    const { container } = render(Textarea, {
      props: {
        label: 'Release notes',
        id: 'notes-body',
        hint: 'Keep it short.',
        'aria-describedby': 'external-note'
      }
    });

    const textarea = screen.getByLabelText('Release notes') as HTMLTextAreaElement;

    expect(textarea.id).toBe('notes-body');
    // The label is a sibling rather than a wrapper here, so the render container is the link.
    expect(container.querySelector('label')?.htmlFor).toBe('notes-body');
    // Same precedence as Checkbox: the caller's describedby replaces the hint id.
    expect(textarea.getAttribute('aria-describedby')).toBe('external-note');
  });
});
