import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './Breadcrumbs.svelte';

describe('Breadcrumbs', () => {
  it('sets the nav accessible name from the label prop', () => {
    render(Breadcrumbs, {
      props: {
        label: 'Site navigation',
        items: [{ label: 'Home', href: '/' }, { label: 'Orders', href: '/orders' }]
      }
    });

    expect(screen.getByRole('navigation', { name: 'Site navigation' })).toBeTruthy();
  });

  it('uses a default label of breadcrumbs', () => {
    render(Breadcrumbs, {
      props: {
        items: [{ label: 'Orders', href: '/orders' }, { label: 'Details', href: '/orders/details' }]
      }
    });

    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeTruthy();
  });

  it('marks the last item with aria-current and renders it as a text span', () => {
    const { container } = render(Breadcrumbs, {
      props: {
        items: [{ label: 'Orders', href: '/orders' }, { label: 'Details', href: '/orders/details' }]
      }
    });

    const current = container.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('Details');
    expect(current?.tagName).toBe('SPAN');
    expect(current?.closest('a')).toBeNull();
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });

  it('renders a non-last item with href as an anchor with that href', () => {
    const { container } = render(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Orders', href: '/orders' },
          { label: 'Details', href: '/orders/details' }
        ]
      }
    });

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/orders');
  });

  it('renders no navigation landmark when items is empty', () => {
    const { container } = render(Breadcrumbs, {
      props: {
        items: []
      }
    });

    const nav = container.querySelector('nav');
    expect(nav).toBeNull();
  });
});
