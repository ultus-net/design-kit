import { describe, expect, it, vi, type Mock } from 'vitest';
import { syncDialogModal, type ModalElement } from './dialog-modal';

interface SpyElement extends ModalElement {
  showModal: Mock;
  close: Mock;
}

function element(overrides: Partial<Pick<ModalElement, 'open' | 'isConnected'>> = {}): SpyElement {
  return { open: false, isConnected: true, showModal: vi.fn(), close: vi.fn(), ...overrides };
}

describe('syncDialogModal', () => {
  it('opens a connected dialog that is closed', () => {
    const dialog = element();

    syncDialogModal(dialog, true);

    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('closes an open dialog when it is no longer open', () => {
    const dialog = element({ open: true });

    syncDialogModal(dialog, false);

    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.showModal).not.toHaveBeenCalled();
  });

  it('leaves a detached or missing dialog alone', () => {
    const detached = element({ isConnected: false });

    syncDialogModal(detached, true);
    syncDialogModal(undefined, true);

    expect(detached.showModal).not.toHaveBeenCalled();
  });
});
