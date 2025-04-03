import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapCanvas from '../features/map/components/MapCanvas';
import Toolbar from '../features/map/components/Toolbar';
import FloorSwitcher from '../features/map/components/FloorSwitcher';
import Legend from '../features/map/components/Legend';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { availableMaps, getMapImageUrl, loadAdminConfig, loadAvailableMaps } from '../lib/mapConfig';
import { MapStateProvider } from '../features/map/contexts/MapStateContext';
import { MapConfig, AdminMapConfig } from '../features/map/types';

// Definiowanie typu dla parametrów URL
interface MapPageParams extends Record<string, string | undefined> {
    mapId: string;
}

const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const { mapId } = useParams<MapPageParams>();
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminMapConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMap = async () => {
      setIsLoading(true);
      setError(null);

      if (!mapId) {
        setError(t('errors.mapIdMissing', "Map ID is missing in the URL"));
        setIsLoading(false);
        return;
      }

      try {
        // Najpierw załaduj dostępne mapy
        await loadAvailableMaps();
        
        const foundMap = availableMaps.find(m => m.id === mapId);
        if (foundMap) {
          setMapConfig(foundMap);
          setCurrentFloor(foundMap.floors[0]?.floorNumber ?? 0);
          
          // Załaduj konfigurację admina
          const adminConfig = await loadAdminConfig(foundMap.id);
          setAdminConfig(adminConfig);
        } else {
          setError(t('errors.mapNotFound', "Map not found: {{mapId}}", { mapId }));
        }
      } catch (err) {
        console.error("Error loading map:", err);
        setError(t('errors.mapLoadError', "Error loading map: {{error}}", { error: err instanceof Error ? err.message : String(err) }));
      } finally {
        setIsLoading(false);
      }
    };

    loadMap();
  }, [mapId, t]);

  const handleFloorChange = useCallback((floorNumber: number) => {
    setCurrentFloor(floorNumber);
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">{t('common.loading', "Loading map data...")}</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 p-4">
        <p>{error}</p>
        <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
          {t('common.goBack', "Go back to menu")}
        </Link>
      </div>
    );
  }

  if (!mapConfig || !mapId) {
    return null;
  }

  const mapImageUrl = getMapImageUrl(mapConfig.id, currentFloor);
  const mapName = t(mapConfig.nameKey);

  return (
    <MapStateProvider initialMapId={mapId}>
      <div className="map-page flex flex-col h-screen bg-gray-800 text-white relative">
        <div className="flex justify-between items-center p-2 bg-gray-900 shadow-md flex-shrink-0">
          <Link to="/" className="text-blue-400 hover:text-blue-300">← {t('menu.selectMap')}</Link>
          <h1 className="text-xl font-[ScoutCondWGL-Bold] truncate px-2">{t('map.title', { mapName: mapName })}</h1>
          <LanguageSwitcher />
        </div>

        <div className="flex flex-grow overflow-hidden">
          <Toolbar currentFloor={currentFloor} />

          <div className="flex-grow relative bg-gray-700 overflow-hidden">
            <MapCanvas
              mapImageUrl={mapImageUrl}
              currentFloor={currentFloor}
              adminConfig={adminConfig}
            />
            <FloorSwitcher
              floors={mapConfig.floors}
              currentFloor={currentFloor}
              onFloorChange={handleFloorChange}
            />
            <Legend />
          </div>
        </div>
      </div>
    </MapStateProvider>
  );
};

export default MapPage;