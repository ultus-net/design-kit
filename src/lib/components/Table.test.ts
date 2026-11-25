import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Table from './Table.svelte';

// Svelte 5 renders table sections from a snippet supplied by the caller.
// createRawSnippet requires a single root element, so the rows share one tbody.
const body = createRawSnippet(() => ({
  render: () =>
    '<tbody><tr><th>Reference</th><th class="is-numeric">Total</th></tr><tr><td>FW-1042</td><td class="is-numeric">1,280.00</td></tr></tbody>'
}));

describe('Table', () => {
  it('renders the caption and exposes a named region', () => {
    render(Table, { props: { caption: 'Recent orders', children: body } });

    expect(screen.getByText('Recent orders')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Recent orders' })).toBeTruthy();
  });

  it('renders a table with the supplied cells', () => {
    render(Table, { props: { children: body } });

    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getByText('FW-1042')).toBeTruthy();
    expect(screen.getByText('1,280.00')).toBeTruthy();
  });

  it('adds the dense modifier to the outer element', () => {
    const { container } = render(Table, { props: { dense: true, children: body } });

    expect(container.firstElementChild?.classList.contains('fw-table--dense')).toBe(true);
  });

  it('adds the sticky modifier to the outer element', () => {
    const { container } = render(Table, { props: { stickyHead: true, children: body } });

    expect(container.firstElementChild?.classList.contains('fw-table--sticky')).toBe(true);
  });
});
