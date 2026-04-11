import i18next from 'i18next';
import type { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { I18nConfig } from './types';

export const defaultI18nConfig: I18nConfig = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'pt-BR'],
  defaultNamespace: 'common',
  namespaces: ['common'],
};

export async function initI18n(config: Partial<I18nConfig> = {}, resources?: Resource) {
  const mergedConfig = { ...defaultI18nConfig, ...config };

  await i18next.use(initReactI18next).init({
    resources,
    lng: mergedConfig.defaultLanguage,
    fallbackLng: mergedConfig.defaultLanguage,
    supportedLngs: mergedConfig.supportedLanguages,
    defaultNS: mergedConfig.defaultNamespace,
    ns: mergedConfig.namespaces,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
}

export { i18next };
