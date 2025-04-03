import React, { createContext, useReducer, useContext, Dispatch, ReactNode, useEffect } from 'react';
import { MapState, MapAction, MapElement, KonvaStageState } from '../types'; // Importuj typy

// Maksymalna liczba kroków historii
const MAX_HISTORY_LENGTH = 50;

// Definicja początkowego stanu z typem
const initialState: MapState = {
  mapId: null,
  elementsByFloor: {}, // Pusta mapa/słownik dla elementów pięter
  currentTool: 'select',
  selectedColor: '#ff0000',
  selectedOperator: null,
  stageState: { x: 0, y: 0, scale: 1 },
  history: {
    elementsByFloor: [],
    stageState: []
  },
};

// Funkcja pomocnicza do zapisywania stanu w historii
const saveToHistory = (state: MapState): MapState => {
  const newElementsHistory = [...state.history.elementsByFloor];
  const newStageHistory = [...state.history.stageState];
  
  // Zapisujemy kopię aktualnego stanu elementsByFloor
  newElementsHistory.push(JSON.parse(JSON.stringify(state.elementsByFloor)));
  // Zapisujemy kopię aktualnego stageState
  newStageHistory.push({ ...state.stageState });
  
  // Ograniczamy długość historii
  if (newElementsHistory.length > MAX_HISTORY_LENGTH) {
    newElementsHistory.shift();
  }
  if (newStageHistory.length > MAX_HISTORY_LENGTH) {
    newStageHistory.shift();
  }
  
  return {
    ...state,
    history: {
      elementsByFloor: newElementsHistory,
      stageState: newStageHistory
    }
  };
};

// Wpisanie reducera
function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_MAP_ID':
        // Resetuj stan przy zmianie mapy, zachowując tylko nowe mapId
        return { ...initialState, mapId: action.payload };
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload };
    case 'SET_COLOR':
      return { ...state, selectedColor: action.payload };
    case 'SET_OPERATOR':
         return { ...state, selectedOperator: action.payload };
    case 'ADD_ELEMENT': {
        // Zapisujemy stan przed zmianą
        const stateWithHistory = saveToHistory(state);
        
        // Dodajemy nowy element do tablicy. Payload jest już typu MapElement.
        // Upewnijmy się, że ID jest unikalne (logika generowania ID może być inna)
        const { floor, element } = action.payload;
        const newElementWithId: MapElement = { 
            ...element, 
            id: element.id || Date.now() + Math.random(),
            floorIndex: floor // Dodajemy informację o piętrze
        };
        
        // Tworzymy kopię obecnej mapy elementów dla pięter
        const updatedElementsByFloor = { ...stateWithHistory.elementsByFloor };
        
        // Inicjalizujemy tablicę dla piętra, jeśli nie istnieje
        if (!updatedElementsByFloor[floor]) {
          updatedElementsByFloor[floor] = [];
        }
        
        // Dodajemy element do odpowiedniego piętra
        updatedElementsByFloor[floor] = [...updatedElementsByFloor[floor], newElementWithId];
        
        return { ...stateWithHistory, elementsByFloor: updatedElementsByFloor };
    }
    case 'REMOVE_ELEMENT': {
        // Zapisujemy stan przed zmianą
        const stateWithHistory = saveToHistory(state);
        
        const { floor, id } = action.payload;
        
        // Jeśli nie ma elementów dla tego piętra, nie rób nic
        if (!stateWithHistory.elementsByFloor[floor]) {
          return stateWithHistory;
        }
        
        // Tworzymy kopię obecnej mapy elementów dla pięter
        const updatedElementsByFloor = { ...stateWithHistory.elementsByFloor };
        
        // Filtrujemy elementy, usuwając element o podanym id
        updatedElementsByFloor[floor] = updatedElementsByFloor[floor].filter(el => el.id !== id);
        
        return { ...stateWithHistory, elementsByFloor: updatedElementsByFloor };
    }
    case 'UPDATE_ELEMENT': { // Użyj bloku dla lepszej czytelności i zakresu zmiennych
        // Zapisujemy stan przed zmianą
        const stateWithHistory = saveToHistory(state);
        
        const { floor, id, updates } = action.payload;
        
        // Jeśli nie ma elementów dla tego piętra, nie rób nic
        if (!stateWithHistory.elementsByFloor[floor]) {
          return stateWithHistory;
        }
        
        // Tworzymy kopię obecnej mapy elementów dla pięter
        const updatedElementsByFloor = { ...stateWithHistory.elementsByFloor };
        
        // Aktualizujemy element o podanym id
        updatedElementsByFloor[floor] = updatedElementsByFloor[floor].map(el => {
            if (el.id === id) {
                const { type: _type, ...otherUpdates } = updates;
                void _type;
                return { ...el, ...otherUpdates };
            }
            return el;
        });
        
        return { ...stateWithHistory, elementsByFloor: updatedElementsByFloor };
    }
    case 'SET_STAGE_STATE': {
        // Dla zmiany widoku (przesunięcie, zoom) nie zapisujemy w historii
        return { ...state, stageState: { ...state.stageState, ...action.payload } };
    }
    case 'LOAD_STATE': {
        // Walidacja wczytanego stanu jest kluczowa!
        const loadedElementsByFloor = action.payload.elementsByFloor || {};
        const loadedStageState = action.payload.stageState || state.stageState; // Zachowaj stary, jeśli brak w imporcie

        // Prosta walidacja
        if (typeof loadedElementsByFloor !== 'object') {
            console.error("Invalid imported state: elementsByFloor is not an object.");
            return state; // Nie zmieniaj stanu, jeśli import jest niepoprawny
        }
        
        // Dodatkowa walidacja, sprawdzenie że każda wartość to tablica
        for (const floorIndex in loadedElementsByFloor) {
          if (!Array.isArray(loadedElementsByFloor[floorIndex])) {
            console.error(`Invalid imported state: elementsByFloor[${floorIndex}] is not an array.`);
            return state;
          }
        }

        // Zapisujemy stan przed wczytaniem nowego
        const stateWithHistory = saveToHistory(state);

        return {
            ...stateWithHistory, // Zachowaj aktualne mapId, tool, color, operator
            elementsByFloor: loadedElementsByFloor, 
            stageState: loadedStageState as KonvaStageState,
         };
    }
    case 'CLEAR_CANVAS': {
        // Zapisujemy stan przed czyszczeniem
        const stateWithHistory = saveToHistory(state);
        
        // Wyczyść elementy na aktualnym piętrze (opcjonalny parametr floor)
        if (action.payload?.floor !== undefined) {
          const floor = action.payload.floor;
          const updatedElementsByFloor = { ...stateWithHistory.elementsByFloor };
          updatedElementsByFloor[floor] = []; // Wyczyść tylko wskazane piętro
          return { ...stateWithHistory, elementsByFloor: updatedElementsByFloor };
        }
        
        // Wyczyść wszystkie piętra i zresetuj zoom/pan
        return { 
            ...stateWithHistory, 
            elementsByFloor: {}, 
            stageState: { ...initialState.stageState } 
        }; 
    }
    case 'UNDO': {
        // Sprawdzamy, czy mamy coś w historii
        if (state.history.elementsByFloor.length === 0) {
            return state; // Brak historii, nie możemy cofnąć
        }
        
        // Pobieramy ostatni stan z historii
        const elementsHistory = [...state.history.elementsByFloor];
        const stageHistory = [...state.history.stageState];
        
        const lastElementsState = elementsHistory.pop();
        const lastStageState = stageHistory.pop() || state.stageState;
        
        // Aktualizujemy historię
        return {
            ...state,
            elementsByFloor: lastElementsState || {},
            stageState: lastStageState,
            history: {
                elementsByFloor: elementsHistory,
                stageState: stageHistory
            }
        };
    }
    default:
      // TypeScript pomoże wychwycić, jeśli nie obsłużyliśmy jakiejś akcji
      // const exhaustiveCheck: never = action; // Linia do sprawdzania kompletności switcha
      return state;
  }
}

// Typowanie Contextów
const MapStateContext = createContext<MapState | undefined>(undefined);
const MapDispatchContext = createContext<Dispatch<MapAction> | undefined>(undefined);

// Typowanie propsów Providera
interface MapStateProviderProps {
  children: ReactNode;
  initialMapId: string | null; // Wymagamy initialMapId
}

// Provider Component
export const MapStateProvider: React.FC<MapStateProviderProps> = ({ children, initialMapId }) => {
  // Inicjalizuj stan z przekazanym mapId
  const [state, dispatch] = useReducer(mapReducer, { ...initialState, mapId: initialMapId });

  // Efekt do resetowania stanu przy zmianie mapId (jeśli provider nie jest odmontowywany)
   useEffect(() => {
       // Sprawdź, czy initialMapId się zmieniło i czy różni się od stanu
       if (initialMapId !== null && state.mapId !== initialMapId) {
          dispatch({ type: 'SET_MAP_ID', payload: initialMapId });
       }
       // Nie resetuj jeśli initialMapId staje się null (np. przy powrocie do menu)
   }, [initialMapId, state.mapId]);

  // Obsługa skrótu klawiszowego CTRL+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <MapStateContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        {children}
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  );
}

// Custom hooks z typowaniem
export function useMapState(): MapState {
  const context = useContext(MapStateContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapStateProvider');
  }
  return context;
}

export function useMapDispatch(): Dispatch<MapAction> {
  const context = useContext(MapDispatchContext);
  if (context === undefined) {
    throw new Error('useMapDispatch must be used within a MapStateProvider');
  }
  return context;
}