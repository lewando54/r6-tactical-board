import { publicUrl } from './publicUrl';
import {
  adminMapConfigSchema,
  mapsIndexSchema,
  type AdminMapConfig,
  type MapConfig,
} from '../features/map/schemas/mapConfig';

export async function loadAvailableMaps(): Promise<MapConfig[]> {
  const response = await fetch(publicUrl('maps/index.json'));
  if (!response.ok) {
    throw new Error(`Failed to load maps index (${response.status})`);
  }
  const json: unknown = await response.json();
  return mapsIndexSchema.parse(json).maps;
}

export function getFloorImageUrl(map: MapConfig, floorNumber: number): string | null {
  const floor = map.floors.find((item) => item.floorNumber === floorNumber);
  if (!floor) {
    return null;
  }
  return publicUrl(`maps/${map.id}/${floor.image}`);
}

export function getMapMenuImageUrl(map: MapConfig): string {
  return publicUrl(`maps/${map.id}/${map.menuImage}`);
}

export async function loadAdminConfig(mapId: string): Promise<AdminMapConfig | null> {
  const response = await fetch(publicUrl(`maps/${mapId}/config.json`));
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to load admin config for ${mapId} (${response.status})`);
  }
  const json: unknown = await response.json();
  return adminMapConfigSchema.parse(json);
}
