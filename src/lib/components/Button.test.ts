import { render } from '@testing-library/svelte';
import { screen } from '@testing-library/dom';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders an enabled button with its label', () => {
    // Svelte 5 passes children as a snippet, so the test builds a raw one.
    const children = createRawSnippet(() => ({
      render: () => '<span>Save</span>'
    }));

    render(Button, { props: { children } });

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBeNull();
    expect(button.getAttribute('type')).toBe('button');
  });
});
