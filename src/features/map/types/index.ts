// src/features/map/types/index.ts

// --- Konfiguracja ---
export interface MapConfig {
  id: string;
  nameKey: string; // Klucz i18n dla nazwy mapy
  floors: number; // Liczba pięter (plików obrazków)
  menuImage: string; // Ścieżka do obrazu mapy w menu
}

export interface OperatorConfig {
  id: string;
  nameKey: string; // Klucz i18n dla nazwy operatora
  icon: string;
}


export type LegendItemConfigSymbol = {
    symbol: string;
    svgSource?: never;
}

export type LegendItemConfigSVG = {
    symbol?: never;
    svgSource: string;
}

export type LegendItemConfig = {
    id: string;
    color: string;
    nameKey: string; // Klucz i18n dla opisu
} & (LegendItemConfigSymbol | LegendItemConfigSVG);

export interface CalloutConfig {
    nameKey: string; // Klucz i18n
    x: number;
    y: number;
}

export interface MapIconConfig {
    legendId: string;
    x: number;
    y: number;
}

export interface AdminMapConfig {
    floors: {
      callouts?: CalloutConfig[];
      icons?: MapIconConfig[];
    }[];
}



// --- Stan Mapy i Elementy ---

export type Tool = 'select' | 'tempMarker' | 'permMarker' | 'operator' | 'arrow' | 'text' | 'draw' | 'erase' | 'legendIcon';

// Podstawowy interfejs dla wszystkich elementów na mapie
interface BaseElement {
    id: number; // Unikalne ID, może być stringiem jeśli generujesz inaczej
    x: number;
    y: number;
    floorIndex?: number; // Opcjonalne pole określające numer piętra, na którym znajduje się element
}

// Typy specyficzne dla elementów (używamy discriminated union przez 'type')
export interface PermMarkerElement extends BaseElement {
    type: 'permMarker';
    radius: number;
    fill: string;
}

export interface OperatorElement extends BaseElement {
    type: 'operator';
    operatorId: string; // ID z OperatorConfig
    icon: string;
    iconSVG: string;
    width: number;
    height: number;
}

export interface ArrowElement { // Strzałka nie potrzebuje x, y, tylko punkty
    id: number;
    type: 'arrow';
    points: number[]; // [x1, y1, x2, y2]
    stroke: string;
    fill: string;
    strokeWidth: number;
    pointerLength: number;
    pointerWidth: number;
    floorIndex?: number; // Opcjonalne pole określające numer piętra
}

export interface TextElement extends BaseElement {
    type: 'text';
    text: string;
    fill: string;
    fontSize: number;
}

export interface DrawingElement { // Rysowanie nie potrzebuje x, y
    id: number;
    type: 'drawing';
    points: number[]; // [x1, y1, x2, y2, x3, y3, ...]
    stroke: string;
    strokeWidth: number;
    // Opcjonalne właściwości Konva.Line
    tension?: number;
    lineCap?: 'butt' | 'round' | 'square';
    lineJoin?: 'round' | 'bevel' | 'miter';
    globalCompositeOperation?: string;
    floorIndex?: number; // Opcjonalne pole określające numer piętra
}

// Dodajemy nowy typ elementu dla ikon z legendy
export interface LegendIconElementBase extends BaseElement {
    type: 'legendIcon';
    legendId: string; // ID z LegendItemConfig
    color: string;
    width: number;
    height: number;
}

export type LegendIconElementSymbol = {
    symbol: string;
    svgSource?: never;
};

export type LegendIconElementSVG = {
    symbol?: never;
    svgSource: string;
};

export type LegendIconElement = LegendIconElementBase & (LegendIconElementSymbol | LegendIconElementSVG);

// Discriminated Union dla wszystkich możliwych elementów mapy
export type MapElement = PermMarkerElement | OperatorElement | ArrowElement | TextElement | DrawingElement | LegendIconElement;


// Stan Konva Stage
export interface KonvaStageState {
    x: number;
    y: number;
    scale: number;
}

// Główny interfejs stanu mapy
export interface MapState {
  mapId: string | null;
  elementsByFloor: { [floorIndex: number]: MapElement[] };
  currentTool: Tool;
  selectedColor: string;
  selectedOperator: OperatorConfig | null;
  selectedLegendItem: LegendItemConfig | null;
  legendItems: LegendItemConfig[];
  stageState: KonvaStageState;
  history: {
    elementsByFloor: { [floorIndex: number]: MapElement[] }[];
    stageState: KonvaStageState[];
  };
}

// Typy dla akcji reducera (Discriminated Union)
export type MapAction =
  | { type: 'SET_MAP_ID'; payload: string | null }
  | { type: 'SET_TOOL'; payload: Tool }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_OPERATOR'; payload: OperatorConfig | null }
  | { type: 'SET_LEGEND_ITEM'; payload: LegendItemConfig | null }
  | { type: 'ADD_ELEMENT'; payload: { floor: number; element: MapElement } }
  | { type: 'REMOVE_ELEMENT'; payload: { floor: number; id: number } }
  | { type: 'UPDATE_ELEMENT'; payload: { floor: number; id: number; updates: Partial<MapElement> } }
  | { type: 'SET_STAGE_STATE'; payload: Partial<KonvaStageState> }
  | { type: 'LOAD_STATE'; payload: Partial<MapState> }
  | { type: 'CLEAR_CANVAS'; payload?: { floor?: number } }
  | { type: 'UNDO' }
  ;