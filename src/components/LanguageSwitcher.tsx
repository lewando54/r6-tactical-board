import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher p-2">
      {/* Prosty przykład, można ulepszyć */}
      <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'} className="mr-2 p-1 border rounded disabled:opacity-50">EN</button>
      <button onClick={() => changeLanguage('pl')} disabled={i18n.language === 'pl'} className="p-1 border rounded disabled:opacity-50">PL</button>
    </div>
  );
}

export default LanguageSwitcher;