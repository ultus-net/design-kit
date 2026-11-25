import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import Tabs from './Tabs.svelte';

interface PanelArgs {
  id: string;
}

// createRawSnippet hands the snippet its params as getters, so read them lazily.
const panel = createRawSnippet<[PanelArgs]>((getId) => ({
  render: () => {
    const args = getId();

    return `<p>Panel ${args.id}</p>`;
  }
}));

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'rows', label: 'Rows' },
  { id: 'history', label: 'History' }
];

function renderTabs() {
  return render(Tabs, { props: { tabs, label: 'Order sections', children: panel } });
}

function selectedTab() {
  return screen.getAllByRole('tab').find((tab) => tab.getAttribute('aria-selected') === 'true');
}

describe('Tabs', () => {
  it('selects the first tab and renders its panel by default', () => {
    const { container } = renderTabs();

    expect(selectedTab()?.textContent?.trim()).toBe('Overview');
    expect(container.querySelector('.fw-tabs__panel')?.textContent?.trim()).toBe('Panel overview');
  });

  it('selects a tab on click and swaps the panel', async () => {
    const { container } = renderTabs();

    await fireEvent.click(screen.getByRole('tab', { name: 'Rows' }));
    await tick();

    expect(selectedTab()?.textContent?.trim()).toBe('Rows');
    expect(container.querySelector('.fw-tabs__panel')?.textContent?.trim()).toBe('Panel rows');
  });

  it('moves selection with ArrowRight and wraps with ArrowLeft', async () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');

    await fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    await tick();

    expect(selectedTab()?.textContent?.trim()).toBe('Rows');

    await fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    await tick();

    expect(selectedTab()?.textContent?.trim()).toBe('Overview');

    await fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    await tick();

    expect(selectedTab()?.textContent?.trim()).toBe('History');
  });

  it('jumps to the first and last tab with Home and End', async () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');

    await fireEvent.keyDown(tablist, { key: 'End' });
    await tick();

    expect(selectedTab()?.textContent?.trim()).toBe('History');

    await fireEvent.keyDown(tablist, { key: 'Home' });
    await tick();

    expect(selectedTab()?.textContent?.trim()).toBe('Overview');
  });

  it('keeps only the selected tab in the tab order', async () => {
    renderTabs();

    await fireEvent.click(screen.getByRole('tab', { name: 'Rows' }));
    await tick();

    const tabindexes = screen.getAllByRole('tab').map((tab) => tab.getAttribute('tabindex'));

    expect(tabindexes).toEqual(['-1', '0', '-1']);
  });
});
