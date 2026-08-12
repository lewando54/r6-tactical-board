import { z } from 'zod';

export const floorSchema = z.object({
  nameKey: z.string().min(1),
  floorNumber: z.number().int(),
  image: z.string().min(1),
});

export const mapConfigSchema = z.object({
  id: z.string().min(1),
  nameKey: z.string().min(1),
  floors: z.array(floorSchema).min(1),
  menuImage: z.string().min(1),
});

export const mapsIndexSchema = z.object({
  maps: z.array(mapConfigSchema),
});

export const calloutConfigSchema = z.object({
  nameKey: z.string().min(1),
  x: z.number(),
  y: z.number(),
});

export const mapIconConfigSchema = z.object({
  legendId: z.string().min(1),
  x: z.number(),
  y: z.number(),
});

export const adminFloorSchema = z.object({
  floorNumber: z.number().int(),
  callouts: z.array(calloutConfigSchema).optional(),
  icons: z.array(mapIconConfigSchema).optional(),
});

export const adminMapConfigSchema = z.object({
  floors: z.array(adminFloorSchema),
});

export type Floor = z.infer<typeof floorSchema>;
export type MapConfig = z.infer<typeof mapConfigSchema>;
export type MapsIndex = z.infer<typeof mapsIndexSchema>;
export type CalloutConfig = z.infer<typeof calloutConfigSchema>;
export type MapIconConfig = z.infer<typeof mapIconConfigSchema>;
export type AdminFloorConfig = z.infer<typeof adminFloorSchema>;
export type AdminMapConfig = z.infer<typeof adminMapConfigSchema>;
