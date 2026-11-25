import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import Switch from './Switch.svelte';

describe('Switch', () => {
  it('toggles with Space and tracks aria-checked', async () => {
    render(Switch, { props: { label: 'Email alerts' } });

    const control = screen.getByRole('switch', { name: 'Email alerts' });

    expect(control.getAttribute('aria-checked')).toBe('false');

    await fireEvent.keyDown(control, { key: ' ' });
    await tick();

    expect(control.getAttribute('aria-checked')).toBe('true');

    await fireEvent.keyDown(control, { key: ' ' });
    await tick();

    expect(control.getAttribute('aria-checked')).toBe('false');
  });

  it('toggles on click', async () => {
    render(Switch, { props: { label: 'Weekly digest' } });

    const control = screen.getByRole('switch', { name: 'Weekly digest' });

    await fireEvent.click(control);
    await tick();

    expect(control.getAttribute('aria-checked')).toBe('true');
  });

  it('takes its accessible name from the label', () => {
    render(Switch, { props: { label: 'Beta features', hint: 'Opt in to previews.' } });

    const control = screen.getByRole('switch', { name: 'Beta features' });
    const hint = screen.getByText('Opt in to previews.');

    expect(control.tagName).toBe('BUTTON');
    expect(control.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('prevents toggling when disabled', async () => {
    render(Switch, { props: { label: 'Beta features', disabled: true } });

    const control = screen.getByRole('switch', { name: 'Beta features' });

    await fireEvent.click(control);
    await tick();
    await fireEvent.keyDown(control, { key: ' ' });
    await tick();

    expect(control.getAttribute('aria-checked')).toBe('false');
  });
});
