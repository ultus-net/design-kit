import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Toast from './Toast.svelte';

type Tone = 'info' | 'success' | 'warning' | 'danger';

interface Message {
  id: string;
  tone?: Tone;
  title: string;
  body?: string;
}

const messages: Message[] = [
  { id: 'info-1', tone: 'info', title: 'Saved', body: 'Your changes are stored.' },
  { id: 'danger-1', tone: 'danger', title: 'Upload failed', body: 'The file was too large.' }
];

describe('Toast', () => {
  it('defaults the live region to polite and switches it to assertive', () => {
    const polite = render(Toast, { props: { messages } });
    expect(polite.container.querySelector('.fw-toast-stack')?.getAttribute('aria-live')).toBe(
      'polite'
    );
    polite.unmount();

    const assertive = render(Toast, { props: { messages, assertive: true } });
    expect(assertive.container.querySelector('.fw-toast-stack')?.getAttribute('aria-live')).toBe(
      'assertive'
    );
  });

  it('renders each message title and body', () => {
    render(Toast, { props: { messages } });

    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Your changes are stored.')).toBeTruthy();
    expect(screen.getByText('Upload failed')).toBeTruthy();
    expect(screen.getByText('The file was too large.')).toBeTruthy();
  });

  it('marks danger messages as alerts and the rest as status', () => {
    render(Toast, { props: { messages } });

    expect(screen.getByText('Upload failed').closest('.fw-toast')?.getAttribute('role')).toBe(
      'alert'
    );
    expect(screen.getByText('Saved').closest('.fw-toast')?.getAttribute('role')).toBe('status');
  });

  it('applies a tone class per message', () => {
    const { container } = render(Toast, {
      props: {
        messages: [
          { id: 'a', tone: 'info', title: 'Info' },
          { id: 'b', tone: 'success', title: 'Success' },
          { id: 'c', tone: 'warning', title: 'Warning' },
          { id: 'd', tone: 'danger', title: 'Danger' }
        ]
      }
    });

    for (const tone of ['info', 'success', 'warning', 'danger']) {
      expect(container.querySelector(`.fw-toast--${tone}`)).toBeTruthy();
    }
  });

  it('renders a dismiss button only when onDismiss is supplied', () => {
    const withoutDismiss = render(Toast, { props: { messages } });
    expect(withoutDismiss.container.querySelectorAll('.fw-toast__dismiss')).toHaveLength(0);
    withoutDismiss.unmount();

    const withDismiss = render(Toast, { props: { messages, onDismiss: () => {} } });
    expect(withDismiss.container.querySelectorAll('.fw-toast__dismiss')).toHaveLength(
      messages.length
    );
  });

  it('calls onDismiss with the message id', async () => {
    const onDismiss = vi.fn();
    render(Toast, { props: { messages, onDismiss } });

    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss Saved' }));

    expect(onDismiss).toHaveBeenCalledWith('info-1');
  });
});
