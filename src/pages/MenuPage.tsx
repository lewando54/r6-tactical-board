import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadAvailableMaps } from '../lib/mapConfig';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useEffect, useState } from 'react';
import { MapConfig } from '../features/map/types';

function MenuPage() {
  const { t } = useTranslation();
  const [availableMaps, setAvailableMaps] = useState<MapConfig[]>([]);

  useEffect(() => {
    loadAvailableMaps().then(setAvailableMaps);
  }, []);

  return (
    <div className="menu-page flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-4xl font-[ScoutCondWGL-Bold] mb-8">{t('menu.title')}</h1>
      <h2 className="text-2xl mb-4">{t('menu.selectMap')}</h2>
      <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {availableMaps.map(map => (
          <li key={map.id} className="m-4 hover:scale-110 transition bg-stone-300 hover:bg-teal-400 relative hover:cursor-pointer">
            <Link
              to={`/map/${map.id}`}
              className="text-4xl text-zinc-900 font-[ScoutCond-Italic] hover:underline"
            >
              <div className="text-center">
                <img src={`/maps/${map.id}/${map.menuImage}`} alt={`${t(map.nameKey)}`} />
                <div className="py-2">
                  <p className="uppercase text-zinc-900">{t(map.nameKey)}</p>
                </div>
              </div>
              <div className="pointer-events-auto absolute w-full h-full top-0 hover:bg-linear-to-t from-[#00ffe680] to-transparent" />
            </Link>
          </li>
        ))}
      </ul>
      {/* Możesz tu dodać link do strony "O aplikacji" itp. */}
    </div>
  );
}

export default MenuPage;