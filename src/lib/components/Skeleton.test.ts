import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Skeleton from './Skeleton.svelte';

describe('Skeleton', () => {
  it('is hidden from the accessibility tree', () => {
    const { container } = render(Skeleton, { props: {} });

    const root = container.querySelector('.fw-skeleton');
    expect(root?.getAttribute('aria-hidden')).toBe('true');
  });

  it('is a line by default', () => {
    const { container } = render(Skeleton, { props: {} });

    const root = container.querySelector('.fw-skeleton');
    expect(root?.classList.contains('fw-skeleton--line')).toBe(true);
    expect(root?.classList.contains('fw-skeleton--block')).toBe(false);
    expect(root?.classList.contains('fw-skeleton--circle')).toBe(false);
  });

  it('applies each shape class', () => {
    const shapes: Array<'block' | 'circle'> = ['block', 'circle'];

    for (const shape of shapes) {
      const { container } = render(Skeleton, { props: { shape } });

      const root = container.querySelector('.fw-skeleton');
      expect(root?.classList.contains(`fw-skeleton--${shape}`)).toBe(true);
    }
  });

  it('applies explicit width and height', () => {
    const { container } = render(Skeleton, { props: { shape: 'circle', width: '2rem', height: '2rem' } });

    const root = container.querySelector('.fw-skeleton') as HTMLDivElement;
    expect(root?.style.width).toBe('2rem');
    expect(root?.style.height).toBe('2rem');
  });
});
