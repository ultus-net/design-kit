import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Avatar from './Avatar.svelte';

describe('Avatar', () => {
  it('renders an image with its alt text and size class', () => {
    render(Avatar, {
      props: { name: 'Ada Lovelace', src: '/ada.png', alt: 'Ada Lovelace portrait', size: 'lg' }
    });

    const image = screen.getByAltText('Ada Lovelace portrait') as HTMLImageElement;
    expect(image).toBeInstanceOf(HTMLImageElement);
    expect(image.getAttribute('src')).toBe('/ada.png');
    expect(image.classList.contains('fw-avatar--lg')).toBe(true);
  });

  it('falls back to two initials from a two-word name', () => {
    render(Avatar, { props: { name: 'Ada Lovelace' } });

    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(avatar.textContent).toBe('AL');
    expect(avatar.classList.contains('fw-avatar--initials')).toBe(true);
  });

  it('falls back to one initial from a single word', () => {
    render(Avatar, { props: { name: 'Ada' } });

    const avatar = screen.getByRole('img', { name: 'Ada' });
    expect(avatar.textContent).toBe('A');
  });

  it('uses the medium size by default', () => {
    render(Avatar, { props: { name: 'Ada' } });

    const avatar = screen.getByRole('img', { name: 'Ada' });
    expect(avatar.classList.contains('fw-avatar--md')).toBe(true);
    expect(avatar.classList.contains('fw-avatar--sm')).toBe(false);
    expect(avatar.classList.contains('fw-avatar--lg')).toBe(false);
  });

  it('collapses whitespace in the accessible name', () => {
    render(Avatar, { props: { name: '  Ada   Lovelace  ' } });

    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(avatar.textContent).toBe('AL');
    expect(avatar.getAttribute('aria-label')).toBe('Ada Lovelace');
  });

  it('takes the surname initial across a hyphen', () => {
    render(Avatar, { props: { name: 'Ada Byron-Lovelace' } });

    const avatar = screen.getByRole('img', { name: 'Ada Byron-Lovelace' });
    expect(avatar.textContent).toBe('AL');
  });

  it('ignores middle names when there are three parts', () => {
    render(Avatar, { props: { name: 'Ada Byron Lovelace' } });

    const avatar = screen.getByRole('img', { name: 'Ada Byron Lovelace' });
    expect(avatar.textContent).toBe('AL');
  });

  it('renders an empty name as decorative', () => {
    const { container } = render(Avatar, { props: { name: '   ' } });

    const avatar = container.querySelector<HTMLElement>('.fw-avatar');
    expect(avatar?.getAttribute('aria-hidden')).toBe('true');
    expect(avatar?.hasAttribute('role')).toBe(false);
    expect(avatar?.hasAttribute('aria-label')).toBe(false);
    expect(avatar?.textContent).toBe('');
  });

  it('rejects alt without src at the type level', () => {
    // @ts-expect-error src and alt are a paired requirement.
    const { container } = render(Avatar, { props: { name: 'Ada', alt: 'x' } });

    expect(container.querySelector('[role="img"]')).not.toBeNull();
  });

  it('renders a punctuation-only name as decorative', () => {
    const { container } = render(Avatar, { props: { name: '---' } });

    const avatar = container.querySelector<HTMLElement>('.fw-avatar');
    expect(avatar?.getAttribute('aria-hidden')).toBe('true');
    expect(avatar?.hasAttribute('role')).toBe(false);
    expect(avatar?.textContent).toBe('');
  });
});
