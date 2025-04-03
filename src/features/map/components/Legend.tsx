import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { legendItemsConfig } from '../../../lib/mapConfig'; // Importuj konfigurację legendy
import { LegendItemConfig } from '../types'
import { FaInfoCircle, FaTimes } from 'react-icons/fa'; // Ikony do przełączania

const Legend: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false); // Stan do kontrolowania widoczności legendy

  if (!legendItemsConfig || legendItemsConfig.length === 0) {
    return null; // Nie renderuj nic, jeśli nie ma elementów legendy
  }

  return (
    <div className="legend absolute bottom-4 right-4 z-10">
      {/* Przycisk do otwierania/zamykania legendy */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-full text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg
          ${isOpen ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}
        `}
        title={isOpen ? t('legend.close', 'Close Legend') : t('legend.open', 'Open Legend')}
      >
        {isOpen ? <FaTimes size={18} /> : <FaInfoCircle size={18} />}
      </button>

      {/* Kontener z zawartością legendy - widoczny warunkowo */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-xl border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-1">
            {t('map.legend', 'Legend')}
          </h4>
          <ul className="space-y-1">
            {legendItemsConfig.map((item: LegendItemConfig) => (
              <li key={item.id} className="flex items-center text-xs text-gray-300">
                {/* Symbol lub kolorowy kwadrat */}
                <span
                  className="w-3 h-3 rounded-sm mr-2 inline-block border border-gray-500 flex-shrink-0"
                  style={{ backgroundColor: item.color }} // Użyj koloru z konfiguracji
                  aria-hidden="true" // Dekoracyjny element
                >
                  {/* Opcjonalnie wyświetl symbol wewnątrz kwadratu, jeśli nie ma koloru lub dla dodatkowego info */}
                  {/* {item.symbol} */}
                </span>
                <span>{t(item.nameKey, item.id)}</span> {/* Wyświetl przetłumaczoną nazwę */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Legend;