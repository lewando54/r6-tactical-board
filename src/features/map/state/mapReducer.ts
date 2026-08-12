import { DEFAULT_MARKER_COLOR, MAX_HISTORY_LENGTH } from '../config/canvasConstants';
import {
  isPositionedElement,
  type ElementsByFloor,
  type MapAction,
  type MapElement,
  type MapState,
} from '../types';

export const initialMapState: MapState = {
  mapId: null,
  elementsByFloor: {},
  currentTool: 'select',
  selectedColor: DEFAULT_MARKER_COLOR,
  selectedOperator: null,
  selectedLegendItem: null,
  stageState: { x: 0, y: 0, scale: 1 },
  history: {
    elementsByFloor: [],
    stageState: [],
  },
};

function cloneElementsByFloor(elementsByFloor: ElementsByFloor): ElementsByFloor {
  return structuredClone(elementsByFloor);
}

function saveToHistory(state: MapState): MapState {
  const elementsHistory = [...state.history.elementsByFloor, cloneElementsByFloor(state.elementsByFloor)];
  const stageHistory = [...state.history.stageState, { ...state.stageState }];

  if (elementsHistory.length > MAX_HISTORY_LENGTH) {
    elementsHistory.shift();
  }
  if (stageHistory.length > MAX_HISTORY_LENGTH) {
    stageHistory.shift();
  }

  return {
    ...state,
    history: {
      elementsByFloor: elementsHistory,
      stageState: stageHistory,
    },
  };
}

function replaceElement(
  elements: MapElement[],
  id: string,
  updater: (element: MapElement) => MapElement,
): MapElement[] {
  return elements.map((element) => (element.id === id ? updater(element) : element));
}

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_MAP_ID':
      return { ...initialMapState, mapId: action.payload };
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload };
    case 'SET_COLOR':
      return { ...state, selectedColor: action.payload };
    case 'SET_OPERATOR':
      return { ...state, selectedOperator: action.payload };
    case 'SET_LEGEND_ITEM':
      return { ...state, selectedLegendItem: action.payload };
    case 'ADD_ELEMENT': {
      const stateWithHistory = saveToHistory(state);
      const { floor, element } = action.payload;
      const floorElements = stateWithHistory.elementsByFloor[floor] ?? [];

      return {
        ...stateWithHistory,
        elementsByFloor: {
          ...stateWithHistory.elementsByFloor,
          [floor]: [...floorElements, element],
        },
      };
    }
    case 'REMOVE_ELEMENT': {
      const { floor, id } = action.payload;
      const floorElements = state.elementsByFloor[floor];
      if (!floorElements) {
        return state;
      }

      const stateWithHistory = saveToHistory(state);
      return {
        ...stateWithHistory,
        elementsByFloor: {
          ...stateWithHistory.elementsByFloor,
          [floor]: floorElements.filter((element) => element.id !== id),
        },
      };
    }
    case 'MOVE_ELEMENT': {
      const { floor, id, x, y } = action.payload;
      const floorElements = state.elementsByFloor[floor];
      if (!floorElements) {
        return state;
      }

      const target = floorElements.find((element) => element.id === id);
      if (!target || !isPositionedElement(target)) {
        return state;
      }

      const stateWithHistory = saveToHistory(state);
      return {
        ...stateWithHistory,
        elementsByFloor: {
          ...stateWithHistory.elementsByFloor,
          [floor]: replaceElement(floorElements, id, (element) => {
            if (!isPositionedElement(element)) {
              return element;
            }
            return { ...element, x, y };
          }),
        },
      };
    }
    case 'SET_STAGE_STATE':
      return { ...state, stageState: { ...state.stageState, ...action.payload } };
    case 'LOAD_STATE': {
      const stateWithHistory = saveToHistory(state);
      return {
        ...stateWithHistory,
        elementsByFloor: action.payload.elementsByFloor,
        stageState: action.payload.stageState,
      };
    }
    case 'CLEAR_CANVAS': {
      const stateWithHistory = saveToHistory(state);
      if (action.payload?.floor !== undefined) {
        return {
          ...stateWithHistory,
          elementsByFloor: {
            ...stateWithHistory.elementsByFloor,
            [action.payload.floor]: [],
          },
        };
      }
      return {
        ...stateWithHistory,
        elementsByFloor: {},
        stageState: { ...initialMapState.stageState },
      };
    }
    case 'UNDO': {
      if (state.history.elementsByFloor.length === 0) {
        return state;
      }

      const elementsHistory = [...state.history.elementsByFloor];
      const stageHistory = [...state.history.stageState];
      const lastElementsState = elementsHistory.pop();
      const lastStageState = stageHistory.pop() ?? state.stageState;

      return {
        ...state,
        elementsByFloor: lastElementsState ?? {},
        stageState: lastStageState,
        history: {
          elementsByFloor: elementsHistory,
          stageState: stageHistory,
        },
      };
    }
    default: {
      const exhaustive: never = action;
      void exhaustive;
      return state;
    }
  }
}
