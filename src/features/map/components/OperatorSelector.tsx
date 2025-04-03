// src/features/map/components/OperatorSelector.tsx
import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { availableOperators } from '../../../lib/mapConfig';
import { useMapState, useMapDispatch } from '../contexts/MapStateContext';
import { OperatorConfig } from '../types';
import { FaTimes } from 'react-icons/fa';

interface OperatorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Ensure the portal root exists or create it
const ensurePortalRoot = (id: string = 'portal-root'): HTMLElement => {
    let portalRoot = document.getElementById(id);
    if (!portalRoot) {
        portalRoot = document.createElement('div');
        portalRoot.setAttribute('id', id);
        document.body.appendChild(portalRoot);
    }
    // You might want to add some base styling to the portal root if needed
    // e.g., portalRoot.style.position = 'relative'; portalRoot.style.zIndex = '50';
    return portalRoot;
};


const OperatorSelector: React.FC<OperatorSelectorProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { selectedOperator } = useMapState();
  const dispatch = useMapDispatch();

  const handleSelectOperator = useCallback((operator: OperatorConfig) => {
    dispatch({ type: 'SET_OPERATOR', payload: operator });
    onClose();
  }, [dispatch, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // --- Modal JSX Structure ---
  const modalContent = (
    // Backdrop: Covers screen, semi-transparent black.
    // Increased z-index slightly just in case. Click closes.
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-in-out" // Use z-50 for backdrop
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="operator-selector-title"
    >
      {/* Modal Content Area: Stop click propagation. Give it a higher z-index than backdrop just to be safe, though often not needed if structured correctly. */}
      <div
        className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-4 md:p-6 relative z-[51] max-h-[85vh] flex flex-col" // Use z-51 for content, increased max-w, max-h
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-600 flex-shrink-0"> {/* Ensure header doesn't shrink */}
          <h3 id="operator-selector-title" className="text-lg font-semibold text-white">
            {t('toolbar.selectOperator', 'Select Operator')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('common.close', 'Close')}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Operator Grid (Scrollable Content) */}
        {/* Make sure this area scrolls, not the whole modal card */}
        <div className="operator-grid overflow-y-auto flex-grow -mr-2 pr-2"> {/* Negative margin + padding for scrollbar */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3"> {/* Increased gap */}
            {availableOperators.map((op: OperatorConfig) => {
              const isSelected = selectedOperator?.id === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => handleSelectOperator(op)}
                  title={t(op.nameKey, op.id)}
                  className={`
                    flex flex-col items-center p-2 rounded-md transition-all duration-150 ease-in-out border aspect-square justify-center
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                    ${isSelected
                      ? 'bg-blue-600 border-blue-500 shadow-lg scale-105 z-10' // Selected on top
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:scale-105' // Hover effect
                    }
                  `}
                >
                   <div
                        className="w-10 h-10 md:w-12 md:h-12 mb-1 flex-shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" // Container + Tailwind directive for direct SVG child sizing
                        dangerouslySetInnerHTML={{ __html: op.icon }} // Render the SVG string
                    />
                   <span className={`text-[10px] md:text-xs text-center truncate w-full block ${isSelected ? 'text-white font-semibold' : 'text-gray-300'}`}> {/* Ensure block */}
                       {t(op.nameKey, op.id)}
                   </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Render into a dedicated portal root or document.body
  const portalContainer = ensurePortalRoot('operator-selector-portal');
  return ReactDOM.createPortal(modalContent, portalContainer); // Use the dedicated portal root
};

export default OperatorSelector;