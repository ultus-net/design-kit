import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Accordion from './Accordion.svelte';

interface BodyArgs {
  id: string;
}

// createRawSnippet hands the snippet its params as getters, so read them lazily.
const body = createRawSnippet<[BodyArgs]>((getId) => ({
  render: () => {
    const args = getId();

    return `<p>Body ${args.id}</p>`;
  }
}));

const items = [
  { id: 'overview', title: 'Overview' },
  { id: 'billing', title: 'Billing' }
];

function renderAccordion(props: { multiple?: boolean } = {}) {
  return render(Accordion, { props: { items, label: 'FAQ', children: body, ...props } });
}

function itemDetails(container: HTMLElement): HTMLDetailsElement[] {
  return [...container.querySelectorAll<HTMLDetailsElement>('details')];
}

function itemSummaries(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>('summary')];
}

describe('Accordion', () => {
  it('renders one details and summary per item', () => {
    const { container } = renderAccordion();
    const group = screen.getByRole('group', { name: 'FAQ' });
    const details = group.querySelectorAll('details');
    const summaries = [...group.querySelectorAll('summary')];

    expect(details).toHaveLength(2);
    expect(summaries).toHaveLength(2);
    expect(summaries[0]?.textContent?.trim()).toBe('Overview');
    expect(summaries[1]?.textContent?.trim()).toBe('Billing');
    for (const summary of summaries) {
      expect(summary.getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('one-open mode closes the previously open item on a summary click', async () => {
    const { container } = renderAccordion();
    const details = itemDetails(container);
    const summaries = itemSummaries(container);

    await fireEvent.click(summaries[0]);
    await fireEvent.click(summaries[1]);

    expect(details[0].open).toBe(false);
    expect(details[1].open).toBe(true);
    expect(summaries[0].getAttribute('aria-expanded')).toBe('false');
    expect(summaries[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('multiple mode keeps both items open', async () => {
    const { container } = renderAccordion({ multiple: true });
    const details = itemDetails(container);
    const summaries = itemSummaries(container);

    await fireEvent.click(summaries[0]);
    await fireEvent.click(summaries[1]);

    expect(details[0].open).toBe(true);
    expect(details[1].open).toBe(true);
    expect(summaries[0].getAttribute('aria-expanded')).toBe('true');
    expect(summaries[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('closing the open item leaves none open', async () => {
    const { container } = renderAccordion();
    const details = itemDetails(container);
    const summaries = itemSummaries(container);

    await fireEvent.click(summaries[0]);
    await fireEvent.click(summaries[0]);

    expect(details.some((item) => item.open)).toBe(false);
  });

  // Keyboard activation of a summary dispatches a click with detail 0, so the
  // same handler serves Enter and Space. jsdom does not synthesise that click.
  it('opens from a keyboard-dispatched click', async () => {
    const { container } = renderAccordion();
    const details = itemDetails(container);
    const summaries = itemSummaries(container);

    summaries[0].focus();
    await fireEvent.click(summaries[0], { detail: 0 });

    expect(details[0].open).toBe(true);
    expect(summaries[0].getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(summaries[0]);
  });

  it('opens the item named by a bound openIds value', () => {
    const { container } = render(Accordion, {
      props: { items, label: 'FAQ', children: body, openIds: ['billing'] }
    });
    const details = itemDetails(container);
    const summaries = itemSummaries(container);

    expect(details[0].open).toBe(false);
    expect(details[1].open).toBe(true);
    expect(summaries[1].getAttribute('aria-expanded')).toBe('true');
  });

  it("renders each item's content inside its own details", () => {
    const { container } = renderAccordion();
    const details = itemDetails(container);

    expect(details[0].textContent).toContain('Body overview');
    expect(details[0].textContent).not.toContain('Body billing');
    expect(details[1].textContent).toContain('Body billing');
    expect(details[1].textContent).not.toContain('Body overview');
  });
});
