import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/Modal';

interface TextPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export function TextPromptDialog({ isOpen, onClose, onSubmit }: TextPromptDialogProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('map.enterText')} titleId="text-prompt-title" panelClassName="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-3"
      >
        <input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
          >
            {t('common.cancel')}
          </button>
          <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-500">
            {t('common.confirm')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
