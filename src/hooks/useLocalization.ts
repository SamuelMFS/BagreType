import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language);
    // Update URL to include language prefix
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(pt-BR|en)/, '');
    const newPath = `/${language}${pathWithoutLang}`;
    window.history.replaceState({}, '', newPath);
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n.language]);

  const isPortuguese = useCallback(() => {
    return i18n.language === 'pt-BR';
  }, [i18n.language]);

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isPortuguese,
    currentLanguage: i18n.language
  };
};

