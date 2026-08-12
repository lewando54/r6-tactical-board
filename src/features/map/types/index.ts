import type { OperatorConfig } from '../../../lib/operators';
import type { AdminMapConfig, CalloutConfig, Floor, MapConfig, MapIconConfig } from '../schemas/mapConfig';
import type {
  ArrowElement,
  DrawingElement,
  ElementsByFloor,
  EraserElement,
  KonvaStageState,
  LegendIconElement,
  MapElement,
  OperatorElement,
  PermMarkerElement,
  TextElement,
} from '../schemas/mapElement';
import type { StrategyFile } from '../schemas/strategyFile';

export type {
  AdminMapConfig,
  ArrowElement,
  CalloutConfig,
  DrawingElement,
  ElementsByFloor,
  EraserElement,
  Floor,
  KonvaStageState,
  LegendIconElement,
  MapConfig,
  MapElement,
  MapIconConfig,
  OperatorElement,
  PermMarkerElement,
  StrategyFile,
  TextElement,
};

export type { OperatorConfig };

export type LegendItemConfigSymbol = {
  symbol: string;
  svgSource?: never;
};

export type LegendItemConfigSVG = {
  symbol?: never;
  svgSource: string;
};

export type LegendItemConfig = {
  id: string;
  color: string;
  nameKey: string;
} & (LegendItemConfigSymbol | LegendItemConfigSVG);

export type Tool =
  | 'select'
  | 'permMarker'
  | 'operator'
  | 'arrow'
  | 'text'
  | 'draw'
  | 'erase'
  | 'legendIcon';

export interface MapState {
  mapId: string | null;
  elementsByFloor: ElementsByFloor;
  currentTool: Tool;
  selectedColor: string;
  selectedOperator: OperatorConfig | null;
  selectedLegendItem: LegendItemConfig | null;
  stageState: KonvaStageState;
  history: {
    elementsByFloor: ElementsByFloor[];
    stageState: KonvaStageState[];
  };
}

export type MapAction =
  | { type: 'SET_MAP_ID'; payload: string | null }
  | { type: 'SET_TOOL'; payload: Tool }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_OPERATOR'; payload: OperatorConfig | null }
  | { type: 'SET_LEGEND_ITEM'; payload: LegendItemConfig | null }
  | { type: 'ADD_ELEMENT'; payload: { floor: number; element: MapElement } }
  | { type: 'REMOVE_ELEMENT'; payload: { floor: number; id: string } }
  | { type: 'MOVE_ELEMENT'; payload: { floor: number; id: string; x: number; y: number } }
  | { type: 'SET_STAGE_STATE'; payload: Partial<KonvaStageState> }
  | { type: 'LOAD_STATE'; payload: Pick<StrategyFile, 'elementsByFloor' | 'stageState'> }
  | { type: 'CLEAR_CANVAS'; payload?: { floor?: number } }
  | { type: 'UNDO' };

export function isPositionedElement(
  element: MapElement,
): element is PermMarkerElement | OperatorElement | TextElement | LegendIconElement {
  switch (element.type) {
    case 'permMarker':
    case 'operator':
    case 'text':
    case 'legendIcon':
      return true;
    default:
      return false;
  }
}
