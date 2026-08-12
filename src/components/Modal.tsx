import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: ReactNode;
  panelClassName?: string;
}

export function Modal({ isOpen, onClose, title, titleId, children, panelClassName }: ModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={`relative flex max-h-[85vh] w-full flex-col rounded-lg bg-gray-800 p-4 shadow-xl md:p-6 ${panelClassName ?? 'max-w-2xl'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex flex-shrink-0 items-center justify-between border-b border-gray-600 pb-2">
          <h3 id={titleId} className="text-lg font-semibold text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('common.close')}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
