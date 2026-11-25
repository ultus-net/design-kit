import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Pagination from './Pagination.svelte';

describe('Pagination', () => {
  it('marks the current page with aria-current', () => {
    const { container } = render(Pagination, { props: { page: 3, pageCount: 10 } });

    const current = container.querySelector('[aria-current="page"]');

    expect(current?.textContent?.trim()).toBe('3');
  });

  it('disables previous on the first page and next on the last page', () => {
    const first = render(Pagination, { props: { page: 1, pageCount: 5 } });
    expect(screen.getByText('Previous').getAttribute('aria-disabled')).toBe('true');
    first.unmount();

    const last = render(Pagination, { props: { page: 5, pageCount: 5 } });
    expect(screen.getByText('Next').getAttribute('aria-disabled')).toBe('true');
    last.unmount();
  });

  it('renders the page window with an ellipsis on each side', () => {
    const { container } = render(Pagination, { props: { page: 10, pageCount: 20 } });

    for (const number of ['1', '9', '10', '11', '20']) {
      expect(screen.getByText(number)).toBeTruthy();
    }
    expect(container.querySelectorAll('.fw-pagination__gap')).toHaveLength(2);
  });

  it('collapses a three-page gap at the window edge to one ellipsis', () => {
    const { container } = render(Pagination, { props: { page: 1, pageCount: 5 } });

    for (const number of ['1', '2', '5']) {
      expect(screen.getByText(number)).toBeTruthy();
    }
    expect(container.querySelectorAll('.fw-pagination__gap')).toHaveLength(1);
    expect(screen.getByText('Previous').getAttribute('aria-disabled')).toBe('true');
  });

  it('renders every page when the range is contiguous', () => {
    const { container } = render(Pagination, { props: { page: 2, pageCount: 3 } });

    expect(container.querySelectorAll('.fw-pagination__page')).toHaveLength(3);
    expect(container.querySelectorAll('.fw-pagination__gap')).toHaveLength(0);
  });

  it('renders page links as anchors when hrefFor is provided', () => {
    const { container } = render(Pagination, {
      props: { page: 2, pageCount: 5, hrefFor: (n: number) => `/docs/${n}` }
    });

    const links = container.querySelectorAll('a.fw-pagination__page');

    expect(links).toHaveLength(5);
    expect(links[1].getAttribute('href')).toBe('/docs/2');
  });
});
