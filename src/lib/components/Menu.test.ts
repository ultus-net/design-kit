import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import Menu from './Menu.svelte';

interface Item {
  id: string;
  label: string;
}

const menuItems: Item[] = [
  { id: 'action1', label: 'Copy' },
  { id: 'action2', label: 'Paste' },
  { id: 'action3', label: 'Cut' }
];

function renderMenu(onSelect = vi.fn()) {
  return render(Menu, { props: { label: 'Actions', items: menuItems, onSelect } });
}

describe('Menu', () => {
  it('closed by default: no role="menu", no aria-controls, aria-expanded false', () => {
    renderMenu();

    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeNull();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('click opens: aria-expanded true, one named menu, three menuitems, aria-controls equals menu id', async () => {
    renderMenu();

    await fireEvent.click(screen.getByRole('button'));
    await tick();

    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(menu.id).toMatch(/-menu$/);

    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(menuItems.length);

    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
  });

  it('ArrowDown opens and focuses the first item; ArrowDown then ArrowUp move the focus', async () => {
    renderMenu();

    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await tick();

    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[0]);

    await fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    await tick();

    expect(document.activeElement).toBe(items[1]);

    await fireEvent.keyDown(items[1], { key: 'ArrowUp' });
    await tick();

    expect(document.activeElement).toBe(items[0]);
  });

  it('Home and End focus the first and last item', async () => {
    renderMenu();

    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await tick();

    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[0]);

    await fireEvent.keyDown(items[0], { key: 'End' });
    await tick();

    expect(document.activeElement).toBe(items[items.length - 1]);

    await fireEvent.keyDown(items[items.length - 1], { key: 'Home' });
    await tick();

    expect(document.activeElement).toBe(items[0]);
  });

  it('Escape closes and returns focus to the trigger', async () => {
    renderMenu();

    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await tick();

    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[0]);

    await fireEvent.keyDown(items[0], { key: 'Escape' });
    await tick();

    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('clicking an item calls onSelect, closes the menu, and returns focus to the trigger', async () => {
    const onSelect = vi.fn();
    renderMenu(onSelect);

    const trigger = screen.getByRole('button');

    await fireEvent.click(trigger);
    await tick();

    const items = screen.getAllByRole('menuitem');
    await fireEvent.click(items[0]);
    await tick();

    expect(onSelect).toHaveBeenCalledWith('action1');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('outside pointerdown closes the menu without stealing focus', async () => {
    renderMenu();

    const trigger = screen.getByRole('button');
    const focusSpy = vi.spyOn(trigger, 'focus');

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await tick();

    expect(screen.getByRole('menu', { name: 'Actions' })).toBeTruthy();

    await fireEvent.pointerDown(document.body);
    await tick();

    expect(screen.queryByRole('menu')).toBeNull();
    expect(focusSpy).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(trigger);
  });

  it('Tab closes the menu and returns focus to the trigger', async () => {
    renderMenu();

    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await tick();

    const items = screen.getAllByRole('menuitem');
    await fireEvent.keyDown(items[0], { key: 'Tab' });
    await tick();

    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
