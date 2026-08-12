import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';
import { legendItems } from '../config/legendConfig';

export default function Legend() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (legendItems.length === 0) {
    return null;
  }

  return (
    <div className="legend absolute right-4 bottom-4 z-10">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`rounded-full p-2 text-white shadow-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          isOpen ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
        }`}
        title={isOpen ? t('legend.close') : t('legend.open')}
      >
        {isOpen ? <FaTimes size={18} /> : <FaInfoCircle size={18} />}
      </button>
      {isOpen ? (
        <div className="absolute right-0 bottom-full mb-2 w-48 rounded-lg border border-gray-700 bg-gray-800 bg-opacity-90 p-3 shadow-xl">
          <h4 className="mb-2 border-b border-gray-600 pb-1 text-sm font-semibold text-gray-200">{t('map.legend')}</h4>
          <ul className="space-y-1">
            {legendItems.map((item) => (
              <li key={item.id} className="flex items-center text-xs text-gray-800">
                <div
                  className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm border border-gray-500"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                >
                  {item.symbol ? (
                    <span className="flex h-full w-full items-center justify-center text-lg leading-none">{item.symbol}</span>
                  ) : (
                    <img className="h-5 w-5" src={item.svgSource} alt="" />
                  )}
                </div>
                <span className="text-gray-300">{t(item.nameKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
