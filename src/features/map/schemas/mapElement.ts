import { z } from 'zod';

const identifiedElementSchema = z.object({
  id: z.string().min(1),
});

const positionedElementSchema = identifiedElementSchema.extend({
  x: z.number(),
  y: z.number(),
});

const lineCapSchema = z.enum(['butt', 'round', 'square']);
const lineJoinSchema = z.enum(['round', 'bevel', 'miter']);

export const permMarkerElementSchema = positionedElementSchema.extend({
  type: z.literal('permMarker'),
  radius: z.number().positive(),
  fill: z.string().min(1),
});

export const operatorElementSchema = positionedElementSchema.extend({
  type: z.literal('operator'),
  operatorId: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const arrowElementSchema = identifiedElementSchema.extend({
  type: z.literal('arrow'),
  points: z.array(z.number()).length(4),
  stroke: z.string().min(1),
  fill: z.string().min(1),
  strokeWidth: z.number().positive(),
  pointerLength: z.number().positive(),
  pointerWidth: z.number().positive(),
});

export const textElementSchema = positionedElementSchema.extend({
  type: z.literal('text'),
  text: z.string().min(1),
  fill: z.string().min(1),
  fontSize: z.number().positive(),
});

export const drawingElementSchema = identifiedElementSchema.extend({
  type: z.literal('drawing'),
  points: z.array(z.number()).min(4),
  stroke: z.string().min(1),
  strokeWidth: z.number().positive(),
  tension: z.number().optional(),
  lineCap: lineCapSchema.optional(),
  lineJoin: lineJoinSchema.optional(),
});

export const eraserElementSchema = identifiedElementSchema.extend({
  type: z.literal('eraser'),
  points: z.array(z.number()).min(4),
  strokeWidth: z.number().positive(),
  lineCap: lineCapSchema.optional(),
  lineJoin: lineJoinSchema.optional(),
});

export const legendIconElementSchema = positionedElementSchema.extend({
  type: z.literal('legendIcon'),
  legendId: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const mapElementSchema = z.discriminatedUnion('type', [
  permMarkerElementSchema,
  operatorElementSchema,
  arrowElementSchema,
  textElementSchema,
  drawingElementSchema,
  eraserElementSchema,
  legendIconElementSchema,
]);

export const konvaStageStateSchema = z.object({
  x: z.number(),
  y: z.number(),
  scale: z.number().positive(),
});

const floorKeySchema = z.string().regex(/^-?\d+$/);

export const elementsByFloorSchema = z
  .record(floorKeySchema, z.array(mapElementSchema))
  .transform((record): Record<number, MapElement[]> => {
    const result: Record<number, MapElement[]> = {};
    for (const [key, elements] of Object.entries(record)) {
      result[Number(key)] = elements;
    }
    return result;
  });

export type PermMarkerElement = z.infer<typeof permMarkerElementSchema>;
export type OperatorElement = z.infer<typeof operatorElementSchema>;
export type ArrowElement = z.infer<typeof arrowElementSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type DrawingElement = z.infer<typeof drawingElementSchema>;
export type EraserElement = z.infer<typeof eraserElementSchema>;
export type LegendIconElement = z.infer<typeof legendIconElementSchema>;
export type MapElement = z.infer<typeof mapElementSchema>;
export type KonvaStageState = z.infer<typeof konvaStageStateSchema>;
export type ElementsByFloor = z.infer<typeof elementsByFloorSchema>;
