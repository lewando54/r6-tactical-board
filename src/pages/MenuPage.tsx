import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getMapMenuImageUrl, loadAvailableMaps } from '../lib/maps';
import type { MapConfig } from '../features/map/types';

export default function MenuPage() {
  const { t } = useTranslation();
  const [availableMaps, setAvailableMaps] = useState<MapConfig[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableMaps()
      .then(setAvailableMaps)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      });
  }, []);

  return (
    <div className="menu-page flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="mb-8 text-4xl font-[ScoutCondWGL-Bold]">{t('menu.title')}</h1>
      <h2 className="mb-4 text-2xl">{t('menu.selectMap')}</h2>
      {error ? <p className="text-red-500">{error}</p> : null}
      <ul className="grid list-none grid-cols-1 p-0 md:grid-cols-2 lg:grid-cols-4">
        {availableMaps.map((map) => (
          <li key={map.id} className="relative m-4 bg-stone-300 transition hover:scale-110 hover:cursor-pointer hover:bg-teal-400">
            <Link to={`/map/${map.id}`} className="text-4xl font-[ScoutCond-Italic] text-zinc-900 hover:underline">
              <div className="text-center">
                <img src={getMapMenuImageUrl(map)} alt={t(map.nameKey)} />
                <div className="py-2">
                  <p className="uppercase text-zinc-900">{t(map.nameKey)}</p>
                </div>
              </div>
              <div className="pointer-events-auto absolute top-0 h-full w-full hover:bg-linear-to-t hover:from-[#00ffe680] hover:to-transparent" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
