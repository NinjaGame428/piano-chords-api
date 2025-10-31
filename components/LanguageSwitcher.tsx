'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-white text-blue-600'
            : 'text-white hover:bg-blue-700/50'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-white text-blue-600'
            : 'text-white hover:bg-blue-700/50'
        }`}
        aria-label="Switch to French"
      >
        FR
      </button>
    </div>
  );
}

