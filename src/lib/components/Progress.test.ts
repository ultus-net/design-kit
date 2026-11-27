import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Progress from './Progress.svelte';

describe('Progress', () => {
  it('renders determinate ARIA values', () => {
    render(Progress, { props: { label: 'Upload', value: 40 } });

    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('uses a custom max and a proportional fill', () => {
    const { container } = render(Progress, { props: { label: 'Step', value: 1, max: 4 } });

    const bar = screen.getByRole('progressbar', { name: 'Step' });
    expect(bar.getAttribute('aria-valuemax')).toBe('4');
    expect(bar.getAttribute('aria-valuenow')).toBe('1');

    const fill = container.querySelector('.fw-progress__fill') as HTMLDivElement;
    expect(fill.style.width).toBe('25%');
  });

  it('omits aria-valuenow when indeterminate', () => {
    const { container } = render(Progress, { props: { label: 'Loading' } });

    const bar = screen.getByRole('progressbar', { name: 'Loading' });
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
    expect(bar.getAttribute('aria-valuemin')).toBeNull();
    expect(bar.getAttribute('aria-valuemax')).toBeNull();

    const fill = container.querySelector('.fw-progress__fill');
    expect(fill?.classList.contains('fw-progress__fill--indeterminate')).toBe(true);
  });

  it('clamps a value above the max', () => {
    const { container } = render(Progress, { props: { label: 'Over', value: 150 } });
    const bar = container.querySelector('[role="progressbar"]');

    expect(bar?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('clamps a value below zero', () => {
    const { container } = render(Progress, { props: { label: 'Under', value: -5 } });
    const bar = container.querySelector('[role="progressbar"]');

    expect(bar?.getAttribute('aria-valuenow')).toBe('0');
  });
});
