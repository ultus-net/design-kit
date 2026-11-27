import { render, screen } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Drawer from './Drawer.svelte';

const body = createRawSnippet(() => ({
  render: () => '<p>Narrow the queue to one carrier.</p>'
}));

function defineDialogMethods() {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    writable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    }
  });

  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    writable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
    }
  });
}

// jsdom does not implement either method, so define them before each render.
beforeEach(defineDialogMethods);

afterEach(() => {
  vi.restoreAllMocks();
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
});

describe('Drawer', () => {
  it('renders a dialog named by its title', async () => {
    render(Drawer, {
      props: { id: 'filters', title: 'Filters', open: true, children: body }
    });
    await tick();

    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
  });

  it('opens once through showModal', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    render(Drawer, {
      props: { id: 'filters', title: 'Filters', open: true, children: body }
    });
    await tick();

    expect(showModal).toHaveBeenCalledTimes(1);
  });

  it('does not close a drawer that is already closed', async () => {
    const close = vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(
      function (this: HTMLDialogElement) {
        if (!this.open) throw new DOMException('The dialog is not open.', 'InvalidStateError');
        this.open = false;
      }
    );

    render(Drawer, {
      props: { id: 'filters', title: 'Filters', open: false, children: body }
    });
    await tick();

    const dialog = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
    expect(close).not.toHaveBeenCalled();
    expect(dialog.open).toBe(false);
  });

  it('closes on a close event and calls onclose', async () => {
    const onclose = vi.fn();
    render(Drawer, {
      props: { id: 'filters', title: 'Filters', open: true, onclose, children: body }
    });
    await tick();

    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    dialog.dispatchEvent(new Event('close'));
    await tick();

    expect(onclose).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);
  });

  it('places the drawer at the end by default', async () => {
    render(Drawer, {
      props: { id: 'filters', title: 'Filters', open: true, children: body }
    });
    await tick();

    const dialog = screen.getByRole('dialog');
    expect(dialog.classList.contains('fw-drawer--end')).toBe(true);
  });

  it('places the drawer at the start when asked', async () => {
    render(Drawer, {
      props: { id: 'filters', title: 'Filters', side: 'start', open: true, children: body }
    });
    await tick();

    const dialog = screen.getByRole('dialog');
    expect(dialog.classList.contains('fw-drawer--start')).toBe(true);
    expect(dialog.classList.contains('fw-drawer--end')).toBe(false);
  });

  it('names the dialog from its title element', async () => {
    render(Drawer, {
      props: { id: 'filters', title: 'Filters', open: true, children: body }
    });
    await tick();

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe('filters-title');
    expect(document.getElementById('filters-title')?.textContent).toBe('Filters');
  });
});
