import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { defaultPreset } from './presets';
import { loadThemeConfig, saveThemeConfig } from './storage';
import type { ThemeConfig, ThemeContextValue, ThemePreset, ThemeTokens } from './types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTokensToDOM(tokens: ThemeTokens): void {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeProviderProps {
  children: React.ReactNode;
  presets?: ThemePreset[];
  defaultConfig?: Partial<ThemeConfig>;
}

export function ThemeProvider({
  children,
  presets: extraPresets = [],
  defaultConfig,
}: ThemeProviderProps) {
  const allPresets = useMemo(() => [defaultPreset, ...extraPresets], [extraPresets]);

  const [config, setConfig] = useState<ThemeConfig>(() => {
    const loaded = loadThemeConfig();
    return { ...loaded, ...defaultConfig };
  });

  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(getSystemMode);

  const resolvedMode = config.mode === 'system' ? systemMode : config.mode;

  const activePreset = useMemo(
    () => allPresets.find((p) => p.name === config.activePreset) ?? defaultPreset,
    [allPresets, config.activePreset],
  );

  const tokens = useMemo<ThemeTokens>(() => {
    const baseTokens = activePreset.tokens[resolvedMode];
    return { ...baseTokens, ...config.customTokens };
  }, [activePreset, resolvedMode, config.customTokens]);

  // Apply tokens to DOM
  useEffect(() => {
    applyTokensToDOM(tokens);
    document.documentElement.classList.toggle('dark', resolvedMode === 'dark');
  }, [tokens, resolvedMode]);

  // Listen for system theme changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemMode(e.matches ? 'dark' : 'light');
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Persist config changes
  useEffect(() => {
    saveThemeConfig(config);
  }, [config]);

  const setMode = useCallback((mode: ThemeConfig['mode']) => {
    setConfig((prev) => ({ ...prev, mode }));
  }, []);

  const setPreset = useCallback((presetName: string) => {
    setConfig((prev) => ({ ...prev, activePreset: presetName, customTokens: undefined }));
  }, []);

  const setCustomTokens = useCallback((customTokens: Partial<ThemeTokens>) => {
    setConfig((prev) => ({
      ...prev,
      customTokens: { ...prev.customTokens, ...customTokens },
    }));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      config,
      tokens,
      mode: resolvedMode,
      setMode,
      setPreset,
      setCustomTokens,
      presets: allPresets,
    }),
    [config, tokens, resolvedMode, setMode, setPreset, setCustomTokens, allPresets],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
