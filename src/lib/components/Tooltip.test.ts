import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import Tooltip from './Tooltip.svelte';

const children = createRawSnippet(() => ({
  render: () => '<span>Delete</span>'
}));

describe('Tooltip', () => {
  it('shows a tooltip on hover whose text is text and wire aria-describedby', async () => {
    render(Tooltip, {
      props: { text: 'Delete this item?', children }
    });
    await tick();

    const trigger = screen.getByRole('button');
    fireEvent.pointerEnter(trigger);
    await tick();

    const content = screen.getByRole('tooltip');
    expect(content.textContent).toContain('Delete this item?');
    expect(trigger.getAttribute('aria-describedby')).toBe(content.id);
  });

  it('shows the tooltip on focus and links aria-describedby', async () => {
    const text = 'You are focused';
    render(Tooltip, {
      props: { text, children }
    });
    await tick();

    const trigger = screen.getByRole('button');
    await trigger.focus();
    await tick();

    const content = screen.getByRole('tooltip');
    expect(content.textContent).toContain(text);
    expect(trigger.getAttribute('aria-describedby')).toBe(content.id);
  });

  it('hides the tooltip on pointer leave and removes aria-describedby', async () => {
    render(Tooltip, {
      props: { text: 'Hover me', children }
    });
    await tick();

    const trigger = screen.getByRole('button');
    fireEvent.pointerEnter(trigger);
    await tick();
    expect(screen.getByRole('tooltip')).toBeTruthy();

    fireEvent.pointerLeave(trigger);
    await tick();
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('hides the tooltip on Escape without moving focus', async () => {
    render(Tooltip, {
      props: { text: 'Press Escape to close', children }
    });
    await tick();

    const trigger = screen.getByRole('button');
    expect(trigger).toBeTruthy();
    await trigger.focus();
    await tick();
    expect(screen.getByRole('tooltip')).toBeTruthy();

    fireEvent.keyDown(window, { key: 'Escape' });
    await tick();

    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('contains no focusable element', async () => {
    render(Tooltip, {
      props: { text: 'No focusables here', children }
    });
    await tick();

    const trigger = screen.getByRole('button');
    await trigger.focus();
    await tick();

    const content = screen.getByRole('tooltip');
    expect(content).toBeTruthy();
    expect(content.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
  });
});
