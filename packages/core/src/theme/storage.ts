import type { ThemeConfig } from './types';

const DEFAULT_CONFIG: ThemeConfig = {
  activePreset: 'default',
  mode: 'system',
};

const STORAGE_KEY = 'saas-core-theme';

export function loadThemeConfig(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }

  return DEFAULT_CONFIG;
}

export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}
