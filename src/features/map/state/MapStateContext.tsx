import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { type MapAction, type MapState } from '../types';
import { initialMapState, mapReducer } from './mapReducer';

const MapStateContext = createContext<MapState | undefined>(undefined);
const MapDispatchContext = createContext<Dispatch<MapAction> | undefined>(undefined);

interface MapStateProviderProps {
  children: ReactNode;
  initialMapId: string | null;
}

export function MapStateProvider({ children, initialMapId }: MapStateProviderProps) {
  const [state, dispatch] = useReducer(mapReducer, { ...initialMapState, mapId: initialMapId });

  useEffect(() => {
    if (initialMapId !== null && state.mapId !== initialMapId) {
      dispatch({ type: 'SET_MAP_ID', payload: initialMapId });
    }
  }, [initialMapId, state.mapId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
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
      <MapDispatchContext.Provider value={dispatch}>{children}</MapDispatchContext.Provider>
    </MapStateContext.Provider>
  );
}

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
