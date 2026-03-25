export interface ThemeTokens {
  // Colors (HSL values without hsl() wrapper, e.g. "240 10% 3.9%")
  background: string;
  foreground: string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  popover: string;
  'popover-foreground': string;
  card: string;
  'card-foreground': string;
  border: string;
  input: string;
  ring: string;
  radius: string;
  // Chart colors
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
  // Sidebar
  'sidebar-background': string;
  'sidebar-foreground': string;
  'sidebar-primary': string;
  'sidebar-primary-foreground': string;
  'sidebar-accent': string;
  'sidebar-accent-foreground': string;
  'sidebar-border': string;
  'sidebar-ring': string;
  // Fonts
  'font-sans': string;
  'font-mono': string;
}

export interface ThemePreset {
  name: string;
  label: string;
  tokens: {
    light: ThemeTokens;
    dark: ThemeTokens;
  };
}

export interface ThemeConfig {
  activePreset: string;
  mode: 'light' | 'dark' | 'system';
  customTokens?: Partial<ThemeTokens>;
}

export interface ThemeContextValue {
  config: ThemeConfig;
  tokens: ThemeTokens;
  mode: 'light' | 'dark';
  setMode: (mode: ThemeConfig['mode']) => void;
  setPreset: (presetName: string) => void;
  setCustomTokens: (tokens: Partial<ThemeTokens>) => void;
  presets: ThemePreset[];
}
