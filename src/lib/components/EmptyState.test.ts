import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from './EmptyState.svelte';

const markSnippet = createRawSnippet(() => ({
  render: () => '<span class="mark-icon">Icon</span>'
}));

const actionSnippet = createRawSnippet(() => ({
  render: () => '<button type="button">Confirm</button>'
}));

describe('EmptyState', () => {
  it('renders title and description text', () => {
    render(EmptyState, {
      props: { title: 'No content', description: 'There is nothing to see here.' }
    });

    expect(screen.getByText('No content')).toBeTruthy();
    expect(screen.getByText('There is nothing to see here.')).toBeTruthy();
  });

  it('renders the mark snippet and the mark wrapper has aria-hidden', async () => {
    const { container } = render(EmptyState, {
      props: { title: 'Empty', mark: markSnippet }
    });
    await tick();

    const wrapper = container.querySelector('.fw-empty__mark');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper?.textContent).toContain('Icon');
  });

  it('renders the action snippet; a button inside it fires its handler', async () => {
    const { container } = render(EmptyState, {
      props: { title: 'Empty', action: actionSnippet }
    });
    await tick();

    const onClick = vi.fn();
    const action = container.querySelector('.fw-empty__action');
    expect(action).toBeTruthy();

    const button = screen.getByRole('button', { name: 'Confirm' });
    expect(action?.contains(button)).toBe(true);
    button.addEventListener('click', onClick);

    await fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('omits description, mark and action when those props are not passed', () => {
    const { container } = render(EmptyState, {
      props: { title: 'Empty' }
    });

    expect(container.querySelector('.fw-empty__title')?.textContent).toBe('Empty');
    expect(container.querySelector('.fw-empty__description')).toBeNull();
    expect(container.querySelector('.fw-empty__mark')).toBeNull();
    expect(container.querySelector('.fw-empty__action')).toBeNull();
  });
});
