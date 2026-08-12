import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="language-switcher p-2">
      <button
        type="button"
        onClick={() => {
          void i18n.changeLanguage('en');
        }}
        disabled={currentLanguage.startsWith('en')}
        className="mr-2 rounded border p-1 disabled:opacity-50"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => {
          void i18n.changeLanguage('pl');
        }}
        disabled={currentLanguage.startsWith('pl')}
        className="rounded border p-1 disabled:opacity-50"
      >
        PL
      </button>
    </div>
  );
}

export default LanguageSwitcher;
