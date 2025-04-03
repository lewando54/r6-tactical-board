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

export interface LegendItemConfig {
    id: string;
    symbol: string; // Symbol lub ikona
    color: string;
    nameKey: string; // Klucz i18n dla opisu
}

export interface CalloutConfig {
    nameKey: string; // Klucz i18n
    x: number;
    y: number;
}

export interface AdminMapConfig {
    floors: {
      callouts?: CalloutConfig[];
    }[]; // Tablica obiektów z indeksem piętra i opcjonalnymi calloutami
    // Można dodać inne predefiniowane elementy: kamery, wzmocnienia itp.
    // predefinedElements?: MapElement[];
}



// --- Stan Mapy i Elementy ---

export type Tool = 'select' | 'tempMarker' | 'permMarker' | 'operator' | 'arrow' | 'text' | 'draw' | 'erase';

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

// Discriminated Union dla wszystkich możliwych elementów mapy
export type MapElement = PermMarkerElement | OperatorElement | ArrowElement | TextElement | DrawingElement;


// Stan Konva Stage
export interface KonvaStageState {
    x: number;
    y: number;
    scale: number;
}

// Główny interfejs stanu mapy
export interface MapState {
  mapId: string | null;
  // Zamiast pojedynczej tablicy elementów, przechowujemy mapę z elementami dla poszczególnych pięter
  elementsByFloor: { [floorIndex: number]: MapElement[] };
  currentTool: Tool;
  selectedColor: string;
  selectedOperator: OperatorConfig | null;
  stageState: KonvaStageState;
  history: {
    elementsByFloor: { [floorIndex: number]: MapElement[] }[];
    stageState: KonvaStageState[];
  };
  // Można dodać inne stany, np.:
  // isDrawing: boolean;
  // selectedElementId: number | null;
}

// Typy dla akcji reducera (Discriminated Union)
export type MapAction =
  | { type: 'SET_MAP_ID'; payload: string | null }
  | { type: 'SET_TOOL'; payload: Tool }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_OPERATOR'; payload: OperatorConfig | null }
  | { type: 'ADD_ELEMENT'; payload: { floor: number; element: MapElement } } // Dodajemy informację o piętrze
  | { type: 'REMOVE_ELEMENT'; payload: { floor: number; id: number } } // Dodajemy informację o piętrze
  | { type: 'UPDATE_ELEMENT'; payload: { floor: number; id: number; updates: Partial<MapElement> } } // Dodajemy informację o piętrze
  | { type: 'SET_STAGE_STATE'; payload: Partial<KonvaStageState> }
  | { type: 'LOAD_STATE'; payload: Partial<MapState> }
  | { type: 'CLEAR_CANVAS'; payload?: { floor?: number } } // Opcjonalnie można wyczyścić tylko konkretne piętro
  | { type: 'UNDO' }
  // | { type: 'START_DRAWING' }
  // | { type: 'UPDATE_DRAWING_POINTS'; payload: number[] }
  // | { type: 'FINISH_DRAWING'; payload: DrawingElement } // Przekaż gotowy element
  ;