import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet, type ComponentProps } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button.svelte';

// Svelte 5 passes children as a snippet, so the tests build a raw one.
const save = createRawSnippet(() => ({
  render: () => '<span>Save</span>'
}));

function renderButton(props: Partial<ComponentProps<typeof Button>> = {}) {
  return render(Button, { props: { children: save, ...props } });
}

describe('Button', () => {
  it('renders an enabled button named by its label and typed by default', () => {
    renderButton();

    const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBeNull();
  });

  it('passes the type through', () => {
    renderButton({ type: 'submit' });

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('applies the requested variant class', () => {
    renderButton({ variant: 'danger' });

    const button = screen.getByRole('button');
    expect(button.classList.contains('fw-button')).toBe(true);
    expect(button.classList.contains('fw-button--danger')).toBe(true);
    expect(button.classList.contains('fw-button--primary')).toBe(false);
  });

  it('applies the requested size class', () => {
    renderButton({ size: 'lg' });

    const button = screen.getByRole('button');
    expect(button.classList.contains('fw-button--lg')).toBe(true);
  });

  it('defaults to the medium size', () => {
    renderButton();

    const button = screen.getByRole('button');
    expect(button.classList.contains('fw-button--md')).toBe(true);
    expect(button.classList.contains('fw-button--lg')).toBe(false);
  });

  it('disables the native control', () => {
    renderButton({ disabled: true });

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('false');
  });

  it('marks a loading button busy and announces the wait', () => {
    const { container } = renderButton({ loading: true });

    const button = screen.getByRole('button', { name: /Save/ }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.classList.contains('is-loading')).toBe(true);

    const spinner = container.querySelector<HTMLElement>('.fw-button__spinner');
    expect(spinner?.getAttribute('aria-hidden')).toBe('true');

    expect(button.textContent).toContain('Save');
    expect(button.textContent).toContain('Loading');
  });

  it('renders a link when href is set', () => {
    renderButton({ href: '/orders' });

    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href.endsWith('/orders')).toBe(true);
    expect(link.hasAttribute('type')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('false');
    expect(link.getAttribute('tabindex')).toBeNull();
  });

  // Known defect, tracked in #35: the busy anchor loses its handler and its tab
  // stop but not its default action, so a pointer click still navigates. That is
  // what this test pins; the fix lands as its own change, never as a test edit.
  // TODO(#35): assert event.defaultPrevented once the busy anchor cancels it.
  it('removes a busy link from the tab order and drops its handler, while a pointer click still navigates', async () => {
    const onclick = vi.fn<(event: MouseEvent) => void>();
    // A fragment href keeps the click from navigating the jsdom document.
    renderButton({ href: '#orders', disabled: true, onclick });

    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');

    await fireEvent.click(link);
    expect(onclick).not.toHaveBeenCalled();
  });

  it('appends a custom class instead of replacing the component classes', () => {
    renderButton({ class: 'w-full' });

    const button = screen.getByRole('button');
    expect(button.classList.contains('fw-button')).toBe(true);
    expect(button.classList.contains('fw-button--primary')).toBe(true);
    expect(button.classList.contains('fw-button--md')).toBe(true);
    expect(button.classList.contains('w-full')).toBe(true);
  });

  it('keeps the visible label in the accessible name while loading', () => {
    renderButton({ loading: true });

    const button = screen.getByRole('button', { name: /Save/ });
    expect(button.textContent).toContain('Save');
    expect(button.textContent).toContain('Loading');
  });
});
