import { useTranslation } from 'react-i18next';
import type { Floor } from '../types';

interface FloorSwitcherProps {
  floors: Floor[];
  currentFloor: number;
  onFloorChange: (floorNumber: number) => void;
}

function getClassNaming(isCurrent: boolean) {
  const isCurrentStyle = isCurrent
    ? '!bg-blue-600 !text-white !cursor-default !shadow-inner !font-bold ring-2 ring-blue-400'
    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white';
  return `px-3 py-1.5 text-sm font-medium rounded-md transition ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isCurrentStyle}`;
}

export default function FloorSwitcher({ floors, currentFloor, onFloorChange }: FloorSwitcherProps) {
  const { t } = useTranslation();
  const sortedFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);

  return (
    <div className="floor-switcher absolute top-16 right-4 z-10 flex flex-col space-y-1 rounded-lg bg-gray-800 bg-opacity-90 p-2 shadow-lg md:top-4">
      <p className="px-3 font-medium text-gray-300">{t('map.floor')}</p>
      {sortedFloors.map((floor) => {
        const isCurrent = floor.floorNumber === currentFloor;
        return (
          <button
            type="button"
            key={floor.floorNumber}
            onClick={() => onFloorChange(floor.floorNumber)}
            disabled={isCurrent}
            className={getClassNaming(isCurrent)}
            title={t(floor.nameKey, { floorNumber: floor.floorNumber })}
          >
            {t(floor.nameKey, { floorNumber: floor.floorNumber })}
          </button>
        );
      })}
    </div>
  );
}
