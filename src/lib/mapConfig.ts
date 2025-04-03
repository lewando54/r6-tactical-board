import { MapConfig, OperatorConfig, LegendItemConfig, AdminMapConfig } from '../features/map/types';
import r6operators from 'r6operators';

// --- Map Configurations ---
// Będziemy ładować je dynamicznie z katalogu /maps
export let availableMaps: MapConfig[] = [];

// Funkcja do dynamicznego ładowania konfiguracji map z katalogu /maps
export const loadAvailableMaps = async (): Promise<MapConfig[]> => {
  try {
    // Pobierz listę katalogów map z serwera
    const response = await fetch('/maps/index.json');
    
    if (!response.ok) {
      // Jeśli plik index.json nie istnieje, zwróć statyczną listę map
      console.warn('Nie można załadować index.json, używam statycznej listy map.');
      return getStaticMapsList();
    }
    
    const mapsIndex = await response.json();
    availableMaps = mapsIndex.maps || [];
    
    return availableMaps;
  } catch (error) {
    console.error('Błąd podczas ładowania dostępnych map:', error);
    // W przypadku błędu zwróć statyczną listę map
    availableMaps = getStaticMapsList();
    return availableMaps;
  }
};

// Statyczna lista map jako fallback
const getStaticMapsList = (): MapConfig[] => {
  return [
    // Standard / Ranked Maps (przybliżona liczba pięter, może wymagać korekty)
    { id: 'bank', nameKey: 'maps.bank', floors: 4, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F, Roof
    { id: 'border', nameKey: 'maps.border', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F
    { id: 'chalet', nameKey: 'maps.chalet', floors: 3, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F
    { id: 'clubhouse', nameKey: 'maps.clubhouse', floors: 3, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F
    { id: 'coastline', nameKey: 'maps.coastline', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F
    { id: 'consulate', nameKey: 'maps.consulate', floors: 3, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F
    { id: 'emerald_plains', nameKey: 'maps.emerald_plains', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F
    { id: 'kafe_dostoyevsky', nameKey: 'maps.kafe_dostoyevsky', floors: 3, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F, 3F
    { id: 'kanal', nameKey: 'maps.kanal', floors: 4, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F, Roof Access (jako osobne piętra?) - Sprawdź strukturę map
    { id: 'nighthaven_labs', nameKey: 'maps.nighthaven_labs', floors: 3, menuImage: '/maps/r6-maps-fallback.jpg' }, // B, 1F, 2F - Do weryfikacji
    { id: 'oregon', nameKey: 'maps.oregon', floors: 5, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F
    { id: 'outback', nameKey: 'maps.outback', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F
    { id: 'skyscraper', nameKey: 'maps.skyscraper', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F
    { id: 'stadium_bravo', nameKey: 'maps.stadium_bravo', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F (Połączenie Oregon/Hereford?)
    { id: 'theme_park', nameKey: 'maps.theme_park', floors: 2, menuImage: '/maps/r6-maps-fallback.jpg' }, // 1F, 2F
    { id: 'villa', nameKey: 'maps.villa', floors: 3, menuImage: '/maps/r6-maps-fallback.jpg' }, // Basement, 1F, 2F
  ];
};

// --- Operator Configurations ---
// (Upewnij się, że ścieżki ikon są poprawne)
export const availableOperators: OperatorConfig[] = [
  // Attackers
  { id: 'sledge', nameKey: 'operators.sledge', icon: r6operators.sledge.toSVG({class: 'large'}) as string },
  { id: 'thatcher', nameKey: 'operators.thatcher', icon: r6operators.thatcher.toSVG({class: 'large'}) as string },
  { id: 'ash', nameKey: 'operators.ash', icon: r6operators.ash.toSVG({class: 'large'}) as string },
  { id: 'thermite', nameKey: 'operators.thermite', icon: r6operators.thermite.toSVG({class: 'large'}) as string },
  { id: 'twitch', nameKey: 'operators.twitch', icon: r6operators.twitch.toSVG({class: 'large'}) as string },
  { id: 'montagne', nameKey: 'operators.montagne', icon: r6operators.montagne.toSVG({class: 'large'}) as string },
  { id: 'glaz', nameKey: 'operators.glaz', icon: r6operators.glaz.toSVG({class: 'large'}) as string },
  { id: 'fuze', nameKey: 'operators.fuze', icon: r6operators.fuze.toSVG({class: 'large'}) as string },
  { id: 'blitz', nameKey: 'operators.blitz', icon: r6operators.blitz.toSVG({class: 'large'}) as string },
  { id: 'iq', nameKey: 'operators.iq', icon: r6operators.iq.toSVG({class: 'large'}) as string },
  { id: 'buck', nameKey: 'operators.buck', icon: r6operators.buck.toSVG({class: 'large'}) as string },
  { id: 'blackbeard', nameKey: 'operators.blackbeard', icon: r6operators.blackbeard.toSVG({class: 'large'}) as string },
  { id: 'capitao', nameKey: 'operators.capitao', icon: r6operators.capitao.toSVG({class: 'large'}) as string },
  { id: 'hibana', nameKey: 'operators.hibana', icon: r6operators.hibana.toSVG({class: 'large'}) as string },
  { id: 'jackal', nameKey: 'operators.jackal', icon: r6operators.jackal.toSVG({class: 'large'}) as string },
  { id: 'ying', nameKey: 'operators.ying', icon: r6operators.ying.toSVG({class: 'large'}) as string },
  { id: 'zofia', nameKey: 'operators.zofia', icon: r6operators.zofia.toSVG({class: 'large'}) as string },
  { id: 'dokkaebi', nameKey: 'operators.dokkaebi', icon: r6operators.dokkaebi.toSVG({class: 'large'}) as string },
  { id: 'lion', nameKey: 'operators.lion', icon: r6operators.lion.toSVG({class: 'large'}) as string },
  { id: 'finka', nameKey: 'operators.finka', icon: r6operators.finka.toSVG({class: 'large'}) as string },
  { id: 'maverick', nameKey: 'operators.maverick', icon: r6operators.maverick.toSVG({class: 'large'}) as string },
  { id: 'nomad', nameKey: 'operators.nomad', icon: r6operators.nomad.toSVG({class: 'large'}) as string },
  { id: 'gridlock', nameKey: 'operators.gridlock', icon: r6operators.gridlock.toSVG({class: 'large'}) as string },
  { id: 'nokk', nameKey: 'operators.nokk', icon: r6operators.nokk.toSVG({class: 'large'}) as string },
  { id: 'amaru', nameKey: 'operators.amaru', icon: r6operators.amaru.toSVG({class: 'large'}) as string },
  { id: 'kali', nameKey: 'operators.kali', icon: r6operators.kali.toSVG({class: 'large'}) as string },
  { id: 'iana', nameKey: 'operators.iana', icon: r6operators.iana.toSVG({class: 'large'}) as string },
  { id: 'ace', nameKey: 'operators.ace', icon: r6operators.ace.toSVG({class: 'large'}) as string },
  { id: 'zero', nameKey: 'operators.zero', icon: r6operators.zero.toSVG({class: 'large'}) as string },
  { id: 'flores', nameKey: 'operators.flores', icon: r6operators.flores.toSVG({class: 'large'}) as string },
  { id: 'osa', nameKey: 'operators.osa', icon: r6operators.osa.toSVG({class: 'large'}) as string },
  { id: 'sens', nameKey: 'operators.sens', icon: r6operators.sens.toSVG({class: 'large'}) as string },
  { id: 'grim', nameKey: 'operators.grim', icon: r6operators.grim.toSVG({class: 'large'}) as string },
  { id: 'brava', nameKey: 'operators.brava', icon: r6operators.brava.toSVG({class: 'large'}) as string },
  { id: 'ram', nameKey: 'operators.ram', icon: r6operators.ram.toSVG({class: 'large'}) as string },
  // Defenders
  { id: 'smoke', nameKey: 'operators.smoke', icon: r6operators.smoke.toSVG({class: 'large'}) as string },
  { id: 'mute', nameKey: 'operators.mute', icon: r6operators.mute.toSVG({class: 'large'}) as string },
  { id: 'castle', nameKey: 'operators.castle', icon: r6operators.castle.toSVG({class: 'large'}) as string },
  { id: 'pulse', nameKey: 'operators.pulse', icon: r6operators.pulse.toSVG({class: 'large'}) as string },
  { id: 'doc', nameKey: 'operators.doc', icon: r6operators.doc.toSVG({class: 'large'}) as string },
  { id: 'rook', nameKey: 'operators.rook', icon: r6operators.rook.toSVG({class: 'large'}) as string },
  { id: 'kapkan', nameKey: 'operators.kapkan', icon: r6operators.kapkan.toSVG({class: 'large'}) as string },
  { id: 'tachanka', nameKey: 'operators.tachanka', icon: r6operators.tachanka.toSVG({class: 'large'}) as string },
  { id: 'jager', nameKey: 'operators.jager', icon: r6operators.jager.toSVG({class: 'large'}) as string },
  { id: 'bandit', nameKey: 'operators.bandit', icon: r6operators.bandit.toSVG({class: 'large'}) as string },
  { id: 'frost', nameKey: 'operators.frost', icon: r6operators.frost.toSVG({class: 'large'}) as string },
  { id: 'valkyrie', nameKey: 'operators.valkyrie', icon: r6operators.valkyrie.toSVG({class: 'large'}) as string },
  { id: 'caveira', nameKey: 'operators.caveira', icon: r6operators.caveira.toSVG({class: 'large'}) as string },
  { id: 'echo', nameKey: 'operators.echo', icon: r6operators.echo.toSVG({class: 'large'}) as string },
  { id: 'mira', nameKey: 'operators.mira', icon: r6operators.mira.toSVG({class: 'large'}) as string },
  { id: 'lesion', nameKey: 'operators.lesion', icon: r6operators.lesion.toSVG({class: 'large'}) as string },
  { id: 'ela', nameKey: 'operators.ela', icon: r6operators.ela.toSVG({class: 'large'}) as string },
  { id: 'vigil', nameKey: 'operators.vigil', icon: r6operators.vigil.toSVG({class: 'large'}) as string },
  { id: 'maestro', nameKey: 'operators.maestro', icon: r6operators.maestro.toSVG({class: 'large'}) as string },
  { id: 'alibi', nameKey: 'operators.alibi', icon: r6operators.alibi.toSVG({class: 'large'}) as string },
  { id: 'clash', nameKey: 'operators.clash', icon: r6operators.clash.toSVG({class: 'large'}) as string },
  { id: 'kaid', nameKey: 'operators.kaid', icon: r6operators.kaid.toSVG({class: 'large'}) as string },
  { id: 'mozzie', nameKey: 'operators.mozzie', icon: r6operators.mozzie.toSVG({class: 'large'}) as string },
  { id: 'warden', nameKey: 'operators.warden', icon: r6operators.warden.toSVG({class: 'large'}) as string },
  { id: 'goyo', nameKey: 'operators.goyo', icon: r6operators.goyo.toSVG({class: 'large'}) as string },
  { id: 'wamai', nameKey: 'operators.wamai', icon: r6operators.wamai.toSVG({class: 'large'}) as string },
  { id: 'oryx', nameKey: 'operators.oryx', icon: r6operators.oryx.toSVG({class: 'large'}) as string },
  { id: 'melusi', nameKey: 'operators.melusi', icon: r6operators.melusi.toSVG({class: 'large'}) as string },
  { id: 'aruni', nameKey: 'operators.aruni', icon: r6operators.aruni.toSVG({class: 'large'}) as string },
  { id: 'thunderbird', nameKey: 'operators.thunderbird', icon: r6operators.thunderbird.toSVG({class: 'large'}) as string },
  { id: 'thorn', nameKey: 'operators.thorn', icon: r6operators.thorn.toSVG({class: 'large'}) as string },
  { id: 'azami', nameKey: 'operators.azami', icon: r6operators.azami.toSVG({class: 'large'}) as string },
  { id: 'solis', nameKey: 'operators.solis', icon: r6operators.solis.toSVG({class: 'large'}) as string },
  { id: 'fenrir', nameKey: 'operators.fenrir', icon: r6operators.fenrir.toSVG({class: 'large'}) as string },
  { id: 'tubarao', nameKey: 'operators.tubarao', icon: r6operators.tubarao.toSVG({class: 'large'}) as string },
];

// --- Legend Item Configurations ---
// (Dodaj więcej symboli według potrzeb)
export const legendItemsConfig: LegendItemConfig[] = [
    { id: 'attackerSpawn', symbol: 'A', color: '#4299e1', nameKey: 'legendItems.attackerSpawn' }, // Blue
    { id: 'defenderSpawn', symbol: 'D', color: '#f6ad55', nameKey: 'legendItems.defenderSpawn' }, // Orange
    { id: 'objective', symbol: '🎯', color: '#f56565', nameKey: 'legendItems.objective' },         // Red
    { id: 'camera', symbol: '📷', color: '#a0aec0', nameKey: 'legendItems.camera' },             // Gray
    { id: 'reinforcement', symbol: '🧱', color: '#718096', nameKey: 'legendItems.reinforcement' }, // Dark Gray
    { id: 'hatch', symbol: 'H', color: '#a0aec0', nameKey: 'legendItems.hatch' },                 // Gray
    { id: 'softWall', symbol: 'SW', color: '#fed7d7', nameKey: 'legendItems.softWall' },           // Light Red
    { id: 'breach', symbol: '💥', color: '#ed8936', nameKey: 'legendItems.breach' },             // Orange
    { id: 'droneHole', symbol: '>', color: '#cbd5e0', nameKey: 'legendItems.droneHole' },        // Light Gray
    { id: 'lineOfSight', symbol: '👁️', color: '#63b3ed', nameKey: 'legendItems.lineOfSight' },    // Light Blue
    // Można dodać więcej: default plant, rotate, shield placement etc.
];

// --- Helper Functions ---

/**
 * Generates the image URL for a specific map floor based on convention.
 * @param mapId - The ID of the map (e.g., 'coastline').
 * @param floorIndex - The 0-based index of the floor.
 * @returns The relative URL path to the map image.
 */
export const getMapImageUrl = (mapId: string, floorIndex: number): string => {
    // Example naming convention: /maps/{mapId}/r6-maps-{mapId}-blueprint-{floorIndex}.jpg
    return `/maps/${mapId}/r6-maps-${mapId}-blueprint-${floorIndex + 1}.jpg`;
}

/**
 * Asynchronously loads the administrator configuration file (e.g., callouts) for a map.
 * Assumes a 'callouts.json' or similar file exists in the map's public directory.
 * @param mapId - The ID of the map.
 * @returns A promise that resolves to the AdminMapConfig object or null if not found or on error.
 */
export const loadAdminConfig = async (mapId: string): Promise<AdminMapConfig | null> => {
    try {
        // Convention: Admin config is in /public/maps/{mapId}/config.json
        // You can change 'config.json' to 'callouts.json' or whatever you prefer.
        const response = await fetch(`/maps/${mapId}/config.json`);
        if (!response.ok) {
            // It's okay if a map doesn't have an admin config file.
            if (response.status === 404) {
                 console.log(`No admin config (config.json) found for map: ${mapId}. Proceeding without it.`);
            } else {
                 console.warn(`Failed to fetch admin config for map ${mapId}. Status: ${response.status}`);
            }
            return null;
        }
        // Parse the JSON data and assume it matches the AdminMapConfig type.
        // Add runtime validation here if needed (e.g., using Zod or io-ts).
        const data: AdminMapConfig = await response.json();
        return data;
    } catch (error) {
        console.error(`Error loading or parsing admin config for map ${mapId}:`, error);
        return null; // Return null on any error during fetch or parse.
    }
}