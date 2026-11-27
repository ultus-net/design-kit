import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Stat from './Stat.svelte';

describe('Stat', () => {
  it('renders the label and value', () => {
    render(Stat, { props: { label: 'Uptime', value: '99.9%' } });

    expect(screen.getByText('Uptime')).toBeTruthy();
    expect(screen.getByText('99.9%')).toBeTruthy();
  });

  it('renders a delta with its tone class', () => {
    const { container } = render(Stat, {
      props: { label: 'Errors', value: 3, delta: '+1', tone: 'danger' }
    });

    // Tone is colour-only, so the variant class is the only observable signal.
    const delta = container.querySelector('.fw-stat__delta');
    expect(delta?.textContent).toBe('+1');
    expect(delta?.classList.contains('fw-stat__delta--danger')).toBe(true);
  });

  it('omits the delta when absent', () => {
    const { container } = render(Stat, { props: { label: 'Errors', value: 3 } });

    expect(container.querySelector('.fw-stat__delta')).toBeNull();
  });
});
