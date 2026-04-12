import type i18next from 'i18next';

import { defaultI18nConfig, initI18n } from '../config';

describe('defaultI18nConfig', () => {
  it('uses en as default language', () => {
    expect(defaultI18nConfig.defaultLanguage).toBe('en');
  });

  it('supports en and pt-BR', () => {
    expect(defaultI18nConfig.supportedLanguages).toContain('en');
    expect(defaultI18nConfig.supportedLanguages).toContain('pt-BR');
  });

  it('uses common as default namespace', () => {
    expect(defaultI18nConfig.defaultNamespace).toBe('common');
  });
});

describe('initI18n', () => {
  // i18next is a global singleton — initialize once and test all behaviors
  // against that single instance to avoid re-init being silently ignored.
  let instance: typeof i18next;

  beforeAll(async () => {
    instance = await initI18n(
      { defaultLanguage: 'en' },
      { en: { common: { greeting: 'Hello', farewell: 'Goodbye' } } },
    );
  });

  it('returns the i18next instance', () => {
    expect(instance).toBeDefined();
    expect(typeof instance.t).toBe('function');
  });

  it('sets the active language to the configured default', () => {
    expect(instance.language).toBe('en');
  });

  it('resolves translation keys from provided resources', () => {
    expect(instance.t('greeting', { ns: 'common' })).toBe('Hello');
  });

  it('resolves multiple translation keys', () => {
    expect(instance.t('farewell', { ns: 'common' })).toBe('Goodbye');
  });
});
