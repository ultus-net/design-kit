import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import AppShell from './AppShell.svelte';

const brand = createRawSnippet(() => ({
  render: () => '<span>Brand</span>'
}));

const body = createRawSnippet(() => ({
  render: () => '<span>Content</span>'
}));

describe('AppShell', () => {
  it('links the skip link to the main landmark', () => {
    render(AppShell, { props: { brand, children: body } });

    const skip = screen.getByRole('link', { name: 'Skip to content' });
    const main = screen.getByRole('main');

    expect(skip.getAttribute('href')).toBe('#fw-main');
    expect(main.id).toBe('fw-main');
    expect(main.textContent).toContain('Content');
  });

  it('labels the primary nav and renders the brand and actions', () => {
    const nav = createRawSnippet(() => ({
      render: () => '<a href="/docs">Docs</a>'
    }));
    const actions = createRawSnippet(() => ({
      render: () => '<button type="button">Sign out</button>'
    }));

    render(AppShell, { props: { brand, children: body, nav, actions } });

    const navigation = screen.getByRole('navigation', { name: 'Primary' });
    expect(navigation.textContent).toContain('Docs');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeTruthy();
  });

  it('omits the nav when absent and applies the content height class', () => {
    const { container } = render(AppShell, {
      props: { brand, children: body, height: 'content' }
    });

    expect(container.querySelector('nav')).toBeNull();
    // Height is layout-only and jsdom computes no layout, so the class is the
    // only observable signal that the content variant is applied.
    expect(container.querySelector('.fw-shell')?.classList.contains('fw-shell--content')).toBe(true);
  });
});
