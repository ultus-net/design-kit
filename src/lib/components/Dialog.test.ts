import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Dialog from './Dialog.svelte';

const body = createRawSnippet(() => ({
  render: () => '<p>The selected orders will be removed.</p>'
}));

const actions = createRawSnippet(() => ({
  render: () => '<button type="button">Confirm</button>'
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

afterEach(() => {
  vi.restoreAllMocks();
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
});

describe('Dialog', () => {
  it('renders a dialog named by its title', () => {
    render(Dialog, {
      props: { id: 'delete-orders', title: 'Delete 12 orders', open: true, children: body }
    });

    expect(screen.getByRole('dialog', { name: 'Delete 12 orders' })).toBeTruthy();
  });

  it('reflects open into the native dialog state', async () => {
    // jsdom does not implement either method, so define them before spying.
    defineDialogMethods();
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    render(Dialog, {
      props: { id: 'delete-orders', title: 'Delete 12 orders', open: true, children: body }
    });
    await tick();

    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    expect(showModal).toHaveBeenCalled();
    expect(dialog.open).toBe(true);
  });

  it('associates the description through aria-describedby', () => {
    render(Dialog, {
      props: {
        id: 'delete-orders',
        title: 'Delete 12 orders',
        description: 'This cannot be undone.',
        open: true,
        children: body
      }
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-describedby')).toBe('delete-orders-description');
    expect(screen.getByText('This cannot be undone.').id).toBe('delete-orders-description');
  });

  it('fires the handler of a button in the actions snippet', async () => {
    render(Dialog, {
      props: { id: 'delete-orders', title: 'Delete 12 orders', open: true, children: body, actions }
    });

    const onClick = vi.fn();
    const button = screen.getByRole('button', { name: 'Confirm' });
    button.addEventListener('click', onClick);

    await fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('closes on a close event and calls onclose', async () => {
    const onclose = vi.fn();
    render(Dialog, {
      props: {
        id: 'delete-orders',
        title: 'Delete 12 orders',
        open: true,
        onclose,
        children: body
      }
    });

    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    dialog.dispatchEvent(new Event('close'));
    await tick();

    expect(dialog.open).toBe(false);
    expect(onclose).toHaveBeenCalledTimes(1);
  });
});
