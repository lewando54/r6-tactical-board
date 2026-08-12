import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/Modal';
import { availableOperators, type OperatorConfig, type OperatorRole } from '../../../lib/operators';
import { useMapDispatch, useMapState } from '../state/MapStateContext';

interface OperatorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_SECTIONS: { role: OperatorRole; titleKey: 'operators.role.attacker' | 'operators.role.defender' }[] = [
  { role: 'Attacker', titleKey: 'operators.role.attacker' },
  { role: 'Defender', titleKey: 'operators.role.defender' },
];

function OperatorGrid({
  operators,
  selectedId,
  onSelect,
}: {
  operators: OperatorConfig[];
  selectedId: string | undefined;
  onSelect: (operator: OperatorConfig) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 md:gap-3">
      {operators.map((operator) => {
        const isSelected = selectedId === operator.id;
        return (
          <button
            type="button"
            key={operator.id}
            onClick={() => onSelect(operator)}
            title={operator.name}
            className={`flex aspect-square flex-col items-center justify-center rounded-md border p-2 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              isSelected
                ? 'z-10 scale-105 border-blue-500 bg-blue-600 shadow-lg'
                : 'border-gray-600 bg-gray-700 hover:scale-105 hover:border-gray-500 hover:bg-gray-600'
            }`}
          >
            <div
              className="mb-1 flex h-10 w-10 flex-shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full md:h-12 md:w-12"
              dangerouslySetInnerHTML={{ __html: operator.icon }}
            />
            <span className={`block w-full truncate text-center text-[10px] md:text-xs ${isSelected ? 'font-semibold text-white' : 'text-gray-300'}`}>
              {operator.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function OperatorSelector({ isOpen, onClose }: OperatorSelectorProps) {
  const { t } = useTranslation();
  const { selectedOperator } = useMapState();
  const dispatch = useMapDispatch();

  const handleSelectOperator = useCallback(
    (operator: OperatorConfig) => {
      dispatch({ type: 'SET_OPERATOR', payload: operator });
      onClose();
    },
    [dispatch, onClose],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('toolbar.selectOperator')} titleId="operator-selector-title">
      <div className="flex flex-col gap-4">
        {ROLE_SECTIONS.map((section) => (
          <section key={section.role}>
            <h4 className="mb-2 text-sm font-semibold text-gray-300">{t(section.titleKey)}</h4>
            <OperatorGrid
              operators={availableOperators.filter((operator) => operator.role === section.role)}
              selectedId={selectedOperator?.id}
              onSelect={handleSelectOperator}
            />
          </section>
        ))}
      </div>
    </Modal>
  );
}
