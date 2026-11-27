import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Card from './Card.svelte';

const body = createRawSnippet(() => ({
  render: () => '<span>42 calls</span>'
}));

describe('Card', () => {
  it('renders the title, body and footer', () => {
    const footer = createRawSnippet(() => ({
      render: () => '<span>Updated today</span>'
    }));

    render(Card, { props: { title: 'Usage', footer, children: body } });

    expect(screen.getByRole('heading', { level: 2, name: 'Usage' })).toBeTruthy();
    expect(screen.getByText('42 calls')).toBeTruthy();
    expect(screen.getByText('Updated today')).toBeTruthy();
  });

  it('renders actions in the header', () => {
    const actions = createRawSnippet(() => ({
      render: () => '<button type="button">Export</button>'
    }));

    const { container } = render(Card, { props: { actions, children: body } });

    const header = container.querySelector('.fw-card__header');
    const button = screen.getByRole('button', { name: 'Export' });

    expect(header?.contains(button)).toBe(true);
  });

  it('omits the header when there is no title or actions', () => {
    const { container } = render(Card, { props: { children: body } });

    expect(container.querySelector('.fw-card__header')).toBeNull();
    expect(screen.getByText('42 calls')).toBeTruthy();
  });
});
