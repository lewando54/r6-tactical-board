import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapCanvas from '../features/map/components/canvas/MapCanvas';
import Toolbar from '../features/map/components/Toolbar';
import FloorSwitcher from '../features/map/components/FloorSwitcher';
import Legend from '../features/map/components/Legend';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getFloorImageUrl, loadAdminConfig, loadAvailableMaps } from '../lib/maps';
import { MapStateProvider } from '../features/map/state/MapStateContext';
import type { AdminMapConfig, MapConfig } from '../features/map/types';

export default function MapPage() {
  const { t } = useTranslation();
  const { mapId } = useParams();
  const [currentFloor, setCurrentFloor] = useState(0);
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminMapConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMap = async () => {
      setIsLoading(true);
      setError(null);

      if (!mapId) {
        setError(t('errors.mapIdMissing'));
        setIsLoading(false);
        return;
      }

      try {
        const maps = await loadAvailableMaps();
        const foundMap = maps.find((map) => map.id === mapId);
        if (!foundMap) {
          setError(t('errors.mapNotFound', { mapId }));
          return;
        }
        setMapConfig(foundMap);
        setCurrentFloor(foundMap.floors[0]?.floorNumber ?? 0);
        setAdminConfig(await loadAdminConfig(foundMap.id));
      } catch (err) {
        setError(t('errors.mapLoadError', { error: err instanceof Error ? err.message : String(err) }));
      } finally {
        setIsLoading(false);
      }
    };

    void loadMap();
  }, [mapId, t]);

  const handleFloorChange = useCallback((floorNumber: number) => {
    setCurrentFloor(floorNumber);
  }, []);

  if (isLoading) {
    return <div className="mt-10 text-center">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="mt-10 p-4 text-center text-red-500">
        <p>{error}</p>
        <Link to="/" className="mt-2 inline-block text-blue-500 hover:underline">
          {t('common.goBack')}
        </Link>
      </div>
    );
  }

  if (!mapConfig || !mapId) {
    return null;
  }

  const mapImageUrl = getFloorImageUrl(mapConfig, currentFloor);
  const mapName = t(mapConfig.nameKey);

  return (
    <MapStateProvider initialMapId={mapId}>
      <div className="map-page relative flex h-screen flex-col bg-gray-800 text-white">
        <div className="flex flex-shrink-0 items-center justify-between bg-gray-900 p-2 shadow-md">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← {t('menu.selectMap')}
          </Link>
          <h1 className="truncate px-2 text-xl font-[ScoutCondWGL-Bold]">{t('map.title', { mapName })}</h1>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-grow overflow-hidden">
          <Toolbar currentFloor={currentFloor} />
          <div className="relative flex-grow overflow-hidden bg-gray-700">
            {mapImageUrl ? (
              <MapCanvas mapImageUrl={mapImageUrl} currentFloor={currentFloor} adminConfig={adminConfig} />
            ) : null}
            <FloorSwitcher floors={mapConfig.floors} currentFloor={currentFloor} onFloorChange={handleFloorChange} />
            <Legend />
          </div>
        </div>
      </div>
    </MapStateProvider>
  );
}
