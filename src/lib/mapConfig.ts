import { MapConfig, OperatorConfig, AdminMapConfig } from '../features/map/types';
import r6operators from 'r6operators';
import { legendItems } from '../features/map/config/legendConfig';

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
    { 
      id: 'bank', 
      nameKey: 'maps.bank', 
      floors: [
        { nameKey: 'maps.bank.basement', floorNumber: -1 },
        { nameKey: 'maps.bank.ground', floorNumber: 0 },
        { nameKey: 'maps.bank.first', floorNumber: 1 },
        { nameKey: 'maps.bank.second', floorNumber: 2 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'border', 
      nameKey: 'maps.border', 
      floors: [
        { nameKey: 'maps.border.ground', floorNumber: 0 },
        { nameKey: 'maps.border.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'chalet', 
      nameKey: 'maps.chalet', 
      floors: [
        { nameKey: 'maps.chalet.basement', floorNumber: -1 },
        { nameKey: 'maps.chalet.ground', floorNumber: 0 },
        { nameKey: 'maps.chalet.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'clubhouse', 
      nameKey: 'maps.clubhouse', 
      floors: [
        { nameKey: 'maps.clubhouse.basement', floorNumber: -1 },
        { nameKey: 'maps.clubhouse.ground', floorNumber: 0 },
        { nameKey: 'maps.clubhouse.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'coastline', 
      nameKey: 'maps.coastline', 
      floors: [
        { nameKey: 'maps.coastline.ground', floorNumber: 0 },
        { nameKey: 'maps.coastline.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'consulate', 
      nameKey: 'maps.consulate', 
      floors: [
        { nameKey: 'maps.consulate.basement', floorNumber: -1 },
        { nameKey: 'maps.consulate.ground', floorNumber: 0 },
        { nameKey: 'maps.consulate.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'emerald_plains', 
      nameKey: 'maps.emerald_plains', 
      floors: [
        { nameKey: 'maps.emerald_plains.ground', floorNumber: 0 },
        { nameKey: 'maps.emerald_plains.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'kafe_dostoyevsky', 
      nameKey: 'maps.kafe_dostoyevsky', 
      floors: [
        { nameKey: 'maps.kafe_dostoyevsky.ground', floorNumber: 0 },
        { nameKey: 'maps.kafe_dostoyevsky.first', floorNumber: 1 },
        { nameKey: 'maps.kafe_dostoyevsky.second', floorNumber: 2 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'kanal', 
      nameKey: 'maps.kanal', 
      floors: [
        { nameKey: 'maps.kanal.basement', floorNumber: -1 },
        { nameKey: 'maps.kanal.ground', floorNumber: 0 },
        { nameKey: 'maps.kanal.first', floorNumber: 1 },
        { nameKey: 'maps.kanal.second', floorNumber: 2 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'nighthaven_labs', 
      nameKey: 'maps.nighthaven_labs', 
      floors: [
        { nameKey: 'maps.nighthaven_labs.basement', floorNumber: -1 },
        { nameKey: 'maps.nighthaven_labs.ground', floorNumber: 0 },
        { nameKey: 'maps.nighthaven_labs.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'oregon', 
      nameKey: 'maps.oregon', 
      floors: [
        { nameKey: 'maps.oregon.basement', floorNumber: -1 },
        { nameKey: 'maps.oregon.ground', floorNumber: 0 },
        { nameKey: 'maps.oregon.first', floorNumber: 1 },
        { nameKey: 'maps.oregon.second', floorNumber: 2 },
        { nameKey: 'maps.oregon.third', floorNumber: 3 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'outback', 
      nameKey: 'maps.outback', 
      floors: [
        { nameKey: 'maps.outback.ground', floorNumber: 0 },
        { nameKey: 'maps.outback.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'skyscraper', 
      nameKey: 'maps.skyscraper', 
      floors: [
        { nameKey: 'maps.skyscraper.ground', floorNumber: 0 },
        { nameKey: 'maps.skyscraper.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'stadium_bravo', 
      nameKey: 'maps.stadium_bravo', 
      floors: [
        { nameKey: 'maps.stadium_bravo.ground', floorNumber: 0 },
        { nameKey: 'maps.stadium_bravo.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'theme_park', 
      nameKey: 'maps.theme_park', 
      floors: [
        { nameKey: 'maps.theme_park.ground', floorNumber: 0 },
        { nameKey: 'maps.theme_park.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    },
    { 
      id: 'villa', 
      nameKey: 'maps.villa', 
      floors: [
        { nameKey: 'maps.villa.basement', floorNumber: -1 },
        { nameKey: 'maps.villa.ground', floorNumber: 0 },
        { nameKey: 'maps.villa.first', floorNumber: 1 }
      ], 
      menuImage: '/maps/r6-maps-fallback.jpg' 
    }
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
export { legendItems };

// --- Helper Functions ---

/**
 * Generates the image URL for a specific map floor based on convention.
 * @param mapId - The ID of the map (e.g., 'coastline').
 * @param floorNumber - The number of the floor (e.g., -1 for basement, 0 for ground floor).
 * @returns The relative URL path to the map image.
 */
export const getMapImageUrl = (mapId: string, floorNumber: number): string => {
    // Konwencja nazewnictwa plików: /maps/{mapId}/r6-maps-{mapId}-blueprint-{floorIndex}.jpg
    // floorIndex jest 1-based, więc musimy znaleźć odpowiedni indeks dla danego piętra
    // Przykład dla Oregon:
    // -1 (piwnica) -> 1
    // 0 (parter) -> 2
    // 1 (1 piętro) -> 3
    // 2 (2 piętro) -> 4
    // 3 (3 piętro) -> 5
    const floorIndex = floorNumber + 2; // Przesunięcie o 2, aby piwnica (-1) dawała indeks 1
    return `/maps/${mapId}/r6-maps-${mapId}-blueprint-${floorIndex}.jpg`;
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