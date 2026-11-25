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
});
