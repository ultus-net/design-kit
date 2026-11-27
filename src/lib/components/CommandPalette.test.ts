import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CommandPalette from './CommandPalette.svelte';

const items = [
  { value: 'alerts', label: 'Alerts', group: 'Components' },
  { value: 'avatars', label: 'Avatars', group: 'Components' },
  { value: 'releases', label: 'Releases', group: 'Pages' },
  { value: 'reports', label: 'Reports', group: 'Pages' }
];

function renderPalette(props: Record<string, unknown> = {}) {
  return render(CommandPalette, {
    props: { id: 'palette', title: 'Jump to', label: 'Search', items, open: true, ...props }
  });
}

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

describe('CommandPalette', () => {
  it('opens as a dialog named by its title and focuses the search input', async () => {
    render(CommandPalette, {
      props: { id: 'palette', title: 'Jump to', label: 'Search', items, open: true }
    });
    await tick();

    expect(screen.getByRole('dialog', { name: 'Jump to' })).toBeTruthy();

    const input = screen.getByRole('combobox', { name: 'Search' });
    expect(document.activeElement).toBe(input);
  });

  it('opens once through showModal', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    renderPalette();
    await tick();

    expect(showModal).toHaveBeenCalledTimes(1);
  });

  it('lists every item when the query is empty', async () => {
    renderPalette();
    await tick();

    expect(screen.getAllByRole('option')).toHaveLength(items.length);
  });

  it('narrows the list as the user types, case-insensitively', async () => {
    renderPalette();
    await tick();

    const input = screen.getByRole('combobox', { name: 'Search' });
    await fireEvent.input(input, { target: { value: 'RE' } });

    const labels = screen.getAllByRole('option').map((option) => option.textContent?.trim());

    expect(labels).toEqual(['Releases', 'Reports']);
  });

  it('groups the results under their group names', async () => {
    renderPalette();
    await tick();

    const groups = screen.getAllByRole('group');
    expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual(['Components', 'Pages']);

    const [components, pages] = groups;
    expect(within(components).getAllByRole('option').map((option) => option.textContent?.trim())).toEqual([
      'Alerts',
      'Avatars'
    ]);
    expect(within(pages).getAllByRole('option').map((option) => option.textContent?.trim())).toEqual([
      'Releases',
      'Reports'
    ]);
  });

  it('moves the active option with the arrow keys across a group boundary', async () => {
    renderPalette();
    await tick();

    const input = screen.getByRole('combobox', { name: 'Search' });
    const groups = screen.getAllByRole('group');
    const firstGroup = within(groups[0]).getAllByRole('option');
    const secondGroup = within(groups[1]).getAllByRole('option');
    const lastOfFirst = firstGroup[firstGroup.length - 1];
    const firstOfSecond = secondGroup[0];

    // The palette opens on the first item, so one step reaches the end of group one.
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();

    expect(input.getAttribute('aria-activedescendant')).toBe(lastOfFirst.id);
    expect(lastOfFirst.getAttribute('aria-selected')).toBe('true');

    // The next step leaves the group and lands on the first item of the next one.
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();

    expect(input.getAttribute('aria-activedescendant')).toBe(firstOfSecond.id);
    expect(firstOfSecond.getAttribute('aria-selected')).toBe('true');
    expect(lastOfFirst.getAttribute('aria-selected')).toBe('false');
  });

  it('invokes the active item on Enter and closes', async () => {
    const onselect = vi.fn();
    renderPalette({ onselect });
    await tick();

    const dialog = screen.getByRole('dialog', { name: 'Jump to' }) as HTMLDialogElement;
    const input = screen.getByRole('combobox', { name: 'Search' });

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();
    await fireEvent.keyDown(input, { key: 'Enter' });
    await tick();

    expect(onselect).toHaveBeenCalledTimes(1);
    expect(onselect).toHaveBeenCalledWith(items[1]);
    expect(dialog.open).toBe(false);
  });

  it('closes on Escape and clears the query', async () => {
    renderPalette();
    await tick();

    const dialog = screen.getByRole('dialog', { name: 'Jump to' }) as HTMLDialogElement;
    const input = screen.getByRole('combobox', { name: 'Search' });

    await fireEvent.input(input, { target: { value: 're' } });
    await tick();

    expect(dialog.open).toBe(true);

    await fireEvent.keyDown(input, { key: 'Escape' });
    await tick();

    expect(dialog.open).toBe(false);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('writes open back to false and calls onclose on the close event', async () => {
    const onclose = vi.fn();
    renderPalette({ onclose });
    await tick();

    const dialog = screen.getByRole('dialog', { name: 'Jump to' }) as HTMLDialogElement;
    dialog.dispatchEvent(new Event('close'));
    await tick();

    expect(onclose).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);
  });
});
