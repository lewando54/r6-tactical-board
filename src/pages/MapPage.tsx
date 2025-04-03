import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapCanvas from '../features/map/components/MapCanvas';
import Toolbar from '../features/map/components/Toolbar';
import FloorSwitcher from '../features/map/components/FloorSwitcher';
import Legend from '../features/map/components/Legend';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { availableMaps, getMapImageUrl, loadAdminConfig } from '../lib/mapConfig';
import { MapStateProvider } from '../features/map/contexts/MapStateContext';
import { MapConfig, AdminMapConfig } from '../features/map/types'; // Importuj typy

// Definiowanie typu dla parametrów URL
interface MapPageParams extends Record<string, string | undefined> {
    mapId: string;
}

const MapPage: React.FC = () => {
  const { t } = useTranslation();
  // Użyj zdefiniowanego typu dla useParams
  const { mapId } = useParams<MapPageParams>();
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminMapConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapId) {
        setError(t('errors.mapIdMissing', "Map ID is missing in the URL")); // Dodaj klucz i18n
        setMapConfig(null);
        return;
    }

    const foundMap = availableMaps.find(m => m.id === mapId);
    if (foundMap) {
      setMapConfig(foundMap);
      setCurrentFloor(0);
      setError(null);
      loadAdminConfig(foundMap.id)
        .then(setAdminConfig)
        .catch(err => {
            console.error("Failed to load admin config:", err);
            setAdminConfig(null); // Ustaw na null w razie błędu
        });
    } else {
      setError(t('errors.mapNotFound', "Map not found: {{mapId}}", { mapId })); // Dodaj klucz i18n
      setMapConfig(null);
    }
  }, [mapId, t]); // Dodaj t jako zależność, jeśli używasz go wewnątrz setError

  // Użyj useCallback dla funkcji przekazywanej jako prop, jeśli jest używana w useEffect w komponencie potomnym
  const handleFloorChange = useCallback((floor: number) => {
    setCurrentFloor(floor);
  }, []);

  if (error) {
    return (
        <div className="text-red-500 text-center mt-10 p-4">
            <p>{error}</p>
            <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
                {t('common.goBack', "Go back to menu")} {/* Dodaj klucz i18n */}
            </Link>
        </div>
    );
  }

  if (!mapConfig || !mapId) { // Dodatkowe sprawdzenie mapId dla pewności TypeScrpt
    return <div className="text-center mt-10">{t('common.loading', "Loading map data...")}</div>; // Dodaj klucz i18n
  }

  const mapImageUrl = getMapImageUrl(mapConfig.id, currentFloor);
  const mapName = t(mapConfig.nameKey);

  return (
    // Przekaż initialMapId do Providera
    <MapStateProvider initialMapId={mapId}>
        <div className="map-page flex flex-col h-screen bg-gray-800 text-white relative">
          {/* Górny Pasek */}
          <div className="flex justify-between items-center p-2 bg-gray-900 shadow-md flex-shrink-0">
            <Link to="/" className="text-blue-400 hover:text-blue-300">← {t('menu.selectMap')}</Link>
            <h1 className="text-xl font-[ScoutCondWGL-Bold] truncate px-2">{t('map.title', { mapName: mapName })}</h1>
            <LanguageSwitcher />
          </div>

          {/* Główny Kontener */}
          <div className="flex flex-grow overflow-hidden">
            {/* Toolbar */}
            <Toolbar currentFloor={currentFloor} />

            {/* Kontener Mapy */}
            <div className="flex-grow relative bg-gray-700 overflow-hidden"> {/* Dodaj overflow-hidden */}
              <MapCanvas
                mapImageUrl={mapImageUrl}
                currentFloor={currentFloor}
                adminConfig={adminConfig}
              />
              {/* Przełącznik Pięter */}
              <FloorSwitcher
                floorCount={mapConfig.floors}
                currentFloor={currentFloor}
                onFloorChange={handleFloorChange} // Użyj opakowanej funkcji
              />
              {/* Legenda */}
              <Legend />
            </div>
          </div>
        </div>
    </MapStateProvider>
  );
}

export default MapPage;