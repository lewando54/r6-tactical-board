import { z } from 'zod';
import { isRecord } from '../../../lib/isRecord';
import {
  elementsByFloorSchema,
  konvaStageStateSchema,
  type ElementsByFloor,
  type MapElement,
} from './mapElement';

export const STRATEGY_FILE_VERSION = 2;

export const strategyFileSchema = z.object({
  version: z.literal(STRATEGY_FILE_VERSION),
  mapId: z.string().min(1),
  elementsByFloor: elementsByFloorSchema,
  stageState: konvaStageStateSchema,
});

export type StrategyFile = z.infer<typeof strategyFileSchema>;

const legacyIdSchema = z.union([z.string(), z.number()]);

const legacyPermMarkerSchema = z.object({
  type: z.literal('permMarker'),
  id: legacyIdSchema,
  x: z.number(),
  y: z.number(),
  radius: z.number(),
  fill: z.string(),
});

const legacyOperatorSchema = z.object({
  type: z.literal('operator'),
  id: legacyIdSchema,
  x: z.number(),
  y: z.number(),
  operatorId: z.string(),
  width: z.number(),
  height: z.number(),
});

const legacyArrowSchema = z.object({
  type: z.literal('arrow'),
  id: legacyIdSchema,
  points: z.array(z.number()),
  stroke: z.string(),
  fill: z.string(),
  strokeWidth: z.number(),
  pointerLength: z.number(),
  pointerWidth: z.number(),
});

const legacyTextSchema = z.object({
  type: z.literal('text'),
  id: legacyIdSchema,
  x: z.number(),
  y: z.number(),
  text: z.string(),
  fill: z.string(),
  fontSize: z.number(),
});

const legacyDrawingSchema = z.object({
  type: z.literal('drawing'),
  id: legacyIdSchema,
  points: z.array(z.number()),
  stroke: z.string(),
  strokeWidth: z.number(),
  tension: z.number().optional(),
  lineCap: z.enum(['butt', 'round', 'square']).optional(),
  lineJoin: z.enum(['round', 'bevel', 'miter']).optional(),
  globalCompositeOperation: z.string().optional(),
});

const legacyLegendIconSchema = z.object({
  type: z.literal('legendIcon'),
  id: legacyIdSchema,
  x: z.number(),
  y: z.number(),
  legendId: z.string(),
  width: z.number(),
  height: z.number(),
});

const legacyElementSchema = z.discriminatedUnion('type', [
  legacyPermMarkerSchema,
  legacyOperatorSchema,
  legacyArrowSchema,
  legacyTextSchema,
  legacyDrawingSchema,
  legacyLegendIconSchema,
]);

const legacyStrategyFileSchema = z.object({
  mapId: z.string().optional(),
  elementsByFloor: z.record(z.string(), z.array(z.unknown())),
  stageState: konvaStageStateSchema.optional(),
});

function toElementId(id: string | number): string {
  return String(id);
}

function migrateLegacyElement(value: unknown): MapElement {
  const element = legacyElementSchema.parse(value);
  const id = toElementId(element.id);

  switch (element.type) {
    case 'permMarker':
      return {
        type: 'permMarker',
        id,
        x: element.x,
        y: element.y,
        radius: element.radius,
        fill: element.fill,
      };
    case 'operator':
      return {
        type: 'operator',
        id,
        x: element.x,
        y: element.y,
        operatorId: element.operatorId,
        width: element.width,
        height: element.height,
      };
    case 'arrow':
      return {
        type: 'arrow',
        id,
        points: element.points,
        stroke: element.stroke,
        fill: element.fill,
        strokeWidth: element.strokeWidth,
        pointerLength: element.pointerLength,
        pointerWidth: element.pointerWidth,
      };
    case 'text':
      return {
        type: 'text',
        id,
        x: element.x,
        y: element.y,
        text: element.text,
        fill: element.fill,
        fontSize: element.fontSize,
      };
    case 'drawing':
      if (element.globalCompositeOperation === 'destination-out') {
        return {
          type: 'eraser',
          id,
          points: element.points,
          strokeWidth: element.strokeWidth,
          lineCap: element.lineCap,
          lineJoin: element.lineJoin,
        };
      }
      return {
        type: 'drawing',
        id,
        points: element.points,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        tension: element.tension,
        lineCap: element.lineCap,
        lineJoin: element.lineJoin,
      };
    case 'legendIcon':
      return {
        type: 'legendIcon',
        id,
        x: element.x,
        y: element.y,
        legendId: element.legendId,
        width: element.width,
        height: element.height,
      };
  }
}

function serializeElementsByFloor(file: StrategyFile): unknown {
  const elementsByFloor: Record<string, MapElement[]> = {};
  for (const [floor, elements] of Object.entries(file.elementsByFloor)) {
    elementsByFloor[floor] = elements;
  }
  return {
    version: file.version,
    mapId: file.mapId,
    elementsByFloor,
    stageState: file.stageState,
  };
}

function migrateLegacyStrategyFile(json: unknown): StrategyFile {
  const legacy = legacyStrategyFileSchema.parse(json);
  const elementsByFloor: Record<string, MapElement[]> = {};

  for (const [key, elements] of Object.entries(legacy.elementsByFloor)) {
    if (!/^-?\d+$/.test(key)) {
      throw new Error(`Invalid floor key: ${key}`);
    }
    elementsByFloor[key] = elements.map(migrateLegacyElement);
  }

  return strategyFileSchema.parse({
    version: STRATEGY_FILE_VERSION,
    mapId: legacy.mapId ?? 'unknown',
    elementsByFloor,
    stageState: legacy.stageState ?? { x: 0, y: 0, scale: 1 },
  });
}

export function parseStrategyFile(json: unknown): StrategyFile {
  if (isRecord(json) && json.version === STRATEGY_FILE_VERSION) {
    return strategyFileSchema.parse(json);
  }
  return migrateLegacyStrategyFile(json);
}

export function serializeStrategyFile(file: StrategyFile): string {
  return JSON.stringify(serializeElementsByFloor(file), null, 2);
}

export function createStrategyFile(
  mapId: string,
  elementsByFloor: ElementsByFloor,
  stageState: StrategyFile['stageState'],
): StrategyFile {
  return {
    version: STRATEGY_FILE_VERSION,
    mapId,
    elementsByFloor,
    stageState,
  };
}
