import { useUserStore } from '../stores';
import { TRANSLATIONS, Language, getLocalizedPlaceName, getLocalizedCategoryName } from '../constants/translations';

export function useTranslation(overrideLang?: string) {
  const { language } = useUserStore();
  const currentLang = ((overrideLang || language || 'en') as Language);
  const langData = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const t = (path: string, params?: Record<string, string | number>): any => {
    const keys = path.split('.');
    let current: any = langData;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = TRANSLATIONS.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current === 'string' && params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        const safeKey = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return acc.replace(new RegExp(`\\{${safeKey}\\}`, 'g'), () => String(v));
      }, current);
    }

    return current;
  };

  return {
    t,
    language: currentLang,
    isHindi: currentLang === 'hi',
    isGujarati: currentLang === 'gu',
    getPlaceName: (place: any) => getLocalizedPlaceName(place, currentLang),
    getCategoryName: (cat: string) => getLocalizedCategoryName(cat, currentLang),
  };
}
