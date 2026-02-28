import { clsx } from 'clsx';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className={clsx('surface-panel max-h-[85vh] w-full max-w-2xl overflow-auto p-6')}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="heading-font text-2xl text-accentDeep">{title}</h3>
          <button type="button" onClick={onClose} className="focus-ring rounded-full p-2 text-muted hover:bg-accentDeep/10">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
