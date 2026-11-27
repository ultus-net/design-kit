import { render, within } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Alert from './Alert.svelte';

const saved = createRawSnippet(() => ({
  render: () => '<span>Saved</span>'
}));

describe('Alert', () => {
  it('renders a status role by default', () => {
    const { container } = render(Alert, { props: { variant: 'info', children: saved } });

    expect(within(container).getByRole('status').textContent).toContain('Saved');
  });

  it('renders an alert role for the danger variant', () => {
    const body = createRawSnippet(() => ({
      render: () => '<span>Nothing was stored.</span>'
    }));

    const { container } = render(Alert, {
      props: { variant: 'danger', title: 'Failed', children: body }
    });

    const alert = within(container).getByRole('alert');
    expect(alert.textContent).toContain('Failed');
    expect(alert.textContent).toContain('Nothing was stored.');
  });

  it('renders the variant class and omits the title when absent', () => {
    const { container } = render(Alert, { props: { variant: 'warning', children: saved } });

    expect(container.querySelector('.fw-alert')?.classList.contains('fw-alert--warning')).toBe(true);
    expect(container.querySelector('.fw-alert__title')).toBeNull();
  });
});
