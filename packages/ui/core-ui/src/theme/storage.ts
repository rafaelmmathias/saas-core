import type { ThemeConfig } from './types';

const STORAGE_KEY = 'saas-core-theme';

export function loadThemeConfig(): Partial<ThemeConfig> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Partial<ThemeConfig>;
    }
  } catch {
    // Ignore parse errors
  }

  return {};
}

export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}
