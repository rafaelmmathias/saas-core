import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { defaultPreset } from './presets';
import { loadThemeConfig, saveThemeConfig } from './storage';
import type { ThemeConfig, ThemeContextValue, ThemePreset, ThemeTokens } from './types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function escapeAttributeValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function serializeTokenDeclarations(tokens: Partial<ThemeTokens>): string {
  return Object.entries(tokens)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('');
}

function buildPresetStyles(presets: ThemePreset[]): string {
  return presets
    .map((preset) => {
      const presetName = escapeAttributeValue(preset.name);

      return [
        `:root[data-theme-preset="${presetName}"] {${serializeTokenDeclarations(preset.tokens.light)}}`,
        `:root.dark[data-theme-preset="${presetName}"] {${serializeTokenDeclarations(preset.tokens.dark)}}`,
      ].join('\n');
    })
    .join('\n');
}

function buildCustomTokenStyles(customTokens?: Partial<ThemeTokens>): string {
  if (!customTokens || Object.keys(customTokens).length === 0) {
    return '';
  }

  return `:root[data-theme-preset] {${serializeTokenDeclarations(customTokens)}}`;
}

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeRuntimeStyles({
  presets,
  customTokens,
}: {
  presets: ThemePreset[];
  customTokens?: Partial<ThemeTokens>;
}) {
  const presetStyles = useMemo(() => buildPresetStyles(presets), [presets]);
  const customTokenStyles = useMemo(() => buildCustomTokenStyles(customTokens), [customTokens]);

  return (
    <>
      <style data-saas-core-theme="presets">{presetStyles}</style>
      {customTokenStyles ? (
        <style data-saas-core-theme="overrides">{customTokenStyles}</style>
      ) : null}
    </>
  );
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
    return { ...defaultConfig, ...loaded };
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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedMode === 'dark');
    root.dataset.themePreset = config.activePreset;
  }, [config.activePreset, resolvedMode]);

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

  return (
    <ThemeContext.Provider value={value}>
      <ThemeRuntimeStyles customTokens={config.customTokens} presets={allPresets} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
