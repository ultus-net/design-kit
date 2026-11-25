import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import Combobox from './Combobox.svelte';

const options = [
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'london', label: 'London' },
  { value: 'lucerne', label: 'Lucerne' }
];

function renderCombobox(props: Record<string, unknown> = {}) {
  return render(Combobox, { props: { label: 'City', options, ...props } });
}

function combobox() {
  return screen.getByRole('combobox');
}

describe('Combobox', () => {
  it('starts collapsed and opens a listbox on typing', async () => {
    renderCombobox();
    const input = combobox();

    expect(input.getAttribute('aria-expanded')).toBe('false');

    await fireEvent.input(input, { target: { value: 'Lis' } });
    await tick();

    expect(input.getAttribute('aria-expanded')).toBe('true');

    const listId = input.getAttribute('aria-controls');
    expect(listId).toBeTruthy();

    const listbox = document.getElementById(listId ?? '');
    expect(listbox?.getAttribute('role')).toBe('listbox');
  });

  it('moves the active option with ArrowDown and wraps', async () => {
    renderCombobox();
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'L' } });
    await tick();

    const [first, second] = screen.getAllByRole('option');

    expect(input.getAttribute('aria-activedescendant')).toBe(first.id);

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();

    expect(input.getAttribute('aria-activedescendant')).toBe(second.id);

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();

    expect(input.getAttribute('aria-activedescendant')).toBe(first.id);
  });

  it('selects the active option on Enter', async () => {
    const onselect = vi.fn();
    renderCombobox({ onselect });
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'L' } });
    await tick();
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();
    await fireEvent.keyDown(input, { key: 'Enter' });
    await tick();

    expect(input).toHaveProperty('value', 'London');
    expect(onselect).toHaveBeenCalledTimes(1);
    expect(onselect).toHaveBeenCalledWith({ value: 'london', label: 'London' });
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes on Escape and restores the pre-open query', async () => {
    renderCombobox({ value: 'Lis' });
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'Lisb' } });
    await tick();

    expect(input.getAttribute('aria-expanded')).toBe('true');

    await fireEvent.keyDown(input, { key: 'Escape' });
    await tick();

    expect(input).toHaveProperty('value', 'Lis');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();

    await fireEvent.keyDown(input, { key: 'Escape' });
    await tick();

    expect(input).toHaveProperty('value', 'Lis');
  });

  it('narrows the list to matching options, case-insensitively', async () => {
    renderCombobox();
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'lo' } });
    await tick();

    const labels = screen.getAllByRole('option').map((option) => option.textContent?.trim());

    expect(labels).toEqual(['London']);
  });

  it('selects an option on mousedown', async () => {
    const onselect = vi.fn();
    renderCombobox({ onselect });
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'L' } });
    await tick();
    await fireEvent.mouseDown(screen.getByRole('option', { name: 'Lucerne' }));
    await tick();

    expect(input).toHaveProperty('value', 'Lucerne');
    expect(onselect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('restores the selection when Escape follows a fresh query', async () => {
    renderCombobox();
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'Lis' } });
    await tick();
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();
    await fireEvent.keyDown(input, { key: 'Enter' });
    await tick();

    expect(input).toHaveProperty('value', 'Lisbon');

    await fireEvent.input(input, { target: { value: 'Lisbonx' } });
    await tick();
    await fireEvent.keyDown(input, { key: 'Escape' });
    await tick();

    expect(input).toHaveProperty('value', 'Lisbon');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('keeps the selection when ArrowDown opens the listbox and Escape closes it', async () => {
    renderCombobox();
    const input = combobox();

    await fireEvent.input(input, { target: { value: 'Lis' } });
    await tick();
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();
    await fireEvent.keyDown(input, { key: 'Enter' });
    await tick();

    expect(input).toHaveProperty('value', 'Lisbon');

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    await tick();
    await fireEvent.keyDown(input, { key: 'Escape' });
    await tick();

    expect(input).toHaveProperty('value', 'Lisbon');
  });
});
