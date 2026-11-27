export interface ModalElement {
  open: boolean;
  isConnected: boolean;
  showModal?: () => void;
  close?: () => void;
}

export function syncDialogModal(element: ModalElement | undefined, open: boolean): void {
  if (!element?.isConnected) return;

  if (open && !element.open) {
    if (typeof element.showModal === 'function') element.showModal();
  } else if (!open && element.open && typeof element.close === 'function') {
    element.close();
  }
}
