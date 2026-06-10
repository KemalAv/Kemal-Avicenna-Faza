import { useState, useCallback, useMemo } from 'react';
import { translations } from '../translations';
import { Language } from '../types';

export function useLocalization() {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  }, []);

  const t = useMemo(() => translations[language], [language]);

  const replaceParams = useCallback((text: string, params: Record<string, string | number>) => {
    let result = text;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, String(value));
    });
    return result;
  }, []);

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    replaceParams
  };
}
