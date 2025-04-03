import { useTranslation } from 'react-i18next';

// Definicja typów propsów
interface FloorSwitcherProps {
  floorCount: number; // Całkowita liczba pięter (np. 3 oznacza piętra 0, 1, 2)
  currentFloor: number; // Aktualnie wybrane piętro (indeks 0-based)
  onFloorChange: (floorIndex: number) => void; // Funkcja wywoływana przy zmianie piętra
}

const FloorSwitcher: React.FC<FloorSwitcherProps> = ({ floorCount, currentFloor, onFloorChange }) => {
  const { t } = useTranslation();

  // Generowanie przycisków dla każdego piętra
  const floorButtons = Array.from({ length: floorCount }, (_, index) => {
    const isCurrent = index === currentFloor;
    // Klucz i18n dla etykiety piętra (można dostosować strukturę kluczy)
    // Np. floor.0, floor.1, floor.bsement, floor.roof
    // Prosty przykład:
    const floorLabelKey = `floor.${index}`;
    const defaultFloorLabel = `${t('map.floor', 'Floor')} ${index}`; // Fallback

    return (
      <button
        key={index}
        onClick={() => onFloorChange(index)}
        disabled={isCurrent}
        className={`
          px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${isCurrent
            ? 'bg-blue-600 text-white cursor-default shadow-inner'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white'
          }
        `}
        title={t(floorLabelKey, defaultFloorLabel)} // Użyj tłumaczenia dla tooltipa
      >
        {/* Wyświetl numer piętra lub przetłumaczoną nazwę */}
        {t(floorLabelKey, `${index + 1}`)}
      </button>
    );
  });

  return (
    <div className="floor-switcher absolute top-16 md:top-4 right-4 z-10 flex flex-col space-y-1 bg-gray-800 bg-opacity-80 p-1 rounded-lg shadow-lg">
      {floorButtons}
    </div>
  );
};

export default FloorSwitcher;