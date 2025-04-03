import { useTranslation } from 'react-i18next';

interface Floor {
  nameKey: string;
  floorNumber: number;
}

interface FloorSwitcherProps {
  floors: Floor[]; // Tablica obiektów pięter
  currentFloor: number; // Aktualnie wybrane piętro (floorNumber)
  onFloorChange: (floorNumber: number) => void; // Funkcja wywoływana przy zmianie piętra
}

const getClassNaming = (isCurrent: boolean) => {
  const isCurrentStyle = isCurrent
    ? '!bg-blue-600 !text-white !cursor-default !shadow-inner !font-bold ring-2 ring-blue-400'
    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white';
  return `px-3 py-1.5 text-sm font-medium rounded-md transition ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isCurrentStyle}`;
};

const FloorSwitcher: React.FC<FloorSwitcherProps> = ({ floors, currentFloor, onFloorChange }) => {
  const { t } = useTranslation();

  console.log('FloorSwitcher props:', { floors, currentFloor });

  // Sortowanie pięter według floorNumber
  const sortedFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);

  // Generowanie przycisków dla każdego piętra
  const floorButtons = sortedFloors.map((floor) => {
    const isCurrent = floor.floorNumber === currentFloor;
    console.log('Floor button:', { floor, isCurrent, currentFloor });

    return (
      <button
        type='button'
        key={floor.floorNumber}
        onClick={() => onFloorChange(floor.floorNumber)}
        disabled={isCurrent}
        className={getClassNaming(isCurrent)}
        title={t(floor.nameKey, { floorNumber: floor.floorNumber })}
      >
        {t(floor.nameKey, { floorNumber: floor.floorNumber })}
      </button>
    );
  });

  return (
    <div className="floor-switcher absolute top-16 md:top-4 right-4 z-10 flex flex-col space-y-1 bg-gray-800 bg-opacity-90 p-2 rounded-lg shadow-lg">
      <p className="px-3 text-gray-300 font-medium">{t('map.floor')}</p>
      {floorButtons}
    </div>
  );
};

export default FloorSwitcher;