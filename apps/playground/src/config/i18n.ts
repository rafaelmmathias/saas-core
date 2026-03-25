import { initI18n } from '@saas-core/core/i18n';

import en from '@/locales/en/common.json';
import ptBR from '@/locales/pt-BR/common.json';

export async function setupI18n() {
  return initI18n(
    {
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'pt-BR'],
      defaultNamespace: 'common',
      namespaces: ['common'],
    },
    {
      en: { common: en },
      'pt-BR': { common: ptBR },
    },
  );
}
