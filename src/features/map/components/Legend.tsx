import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { legendItems } from '../../map/config/legendConfig'; // Importuj konfigurację legendy
import { LegendItemConfig } from '../types'
import { FaInfoCircle, FaTimes } from 'react-icons/fa'; // Ikony do przełączania

const Legend: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false); // Stan do kontrolowania widoczności legendy

  if (!legendItems || legendItems.length === 0) {
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
            {legendItems.map((item: LegendItemConfig) => (
              <li key={item.id} className="flex items-center text-xs text-gray-800">
                {/* Symbol lub kolorowy kwadrat */}
                <div
                  className="w-8 h-8 rounded-sm mr-2 border border-gray-500 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                >
                  {item.symbol ? (
                  <span className="flex items-center justify-center w-full h-full text-lg leading-none">{item.symbol}</span>
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-lg leading-none"><img className="w-5 h-5" src={item.svgSource} /></span>
                  )}
                </div>
                <span className="text-gray-300">{t(item.nameKey, item.id)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Legend;