import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Badge from './Badge.svelte';

// The badge is the element itself, so the snippet returns bare text.
const label = createRawSnippet(() => ({
  render: () => 'New'
}));

describe('Badge', () => {
  it('renders its children', () => {
    render(Badge, { props: { children: label } });

    expect(screen.getByText('New').classList.contains('fw-badge')).toBe(true);
  });

  it('applies the neutral variant by default', () => {
    render(Badge, { props: { children: label } });

    expect(screen.getByText('New').classList.contains('fw-badge--neutral')).toBe(true);
  });

  it('applies the requested variant', () => {
    render(Badge, { props: { variant: 'danger', children: label } });

    const badge = screen.getByText('New');
    expect(badge.classList.contains('fw-badge--danger')).toBe(true);
    expect(badge.classList.contains('fw-badge--neutral')).toBe(false);
  });
});
