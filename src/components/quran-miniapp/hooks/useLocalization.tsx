import { useTheme } from './useTheme';
import { locales, LocaleKey } from '../locales';

export const useLocalization = () => {
  const { settings } = useTheme();
  
  const t = (key: LocaleKey): string => {
    const lang = settings.language || 'id';
    return locales[lang][key] || locales['en'][key] || key;
  };

  return { t, currentLanguage: settings.language };
};
