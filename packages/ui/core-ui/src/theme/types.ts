export interface ThemeTokens {
  // Colors (HSL values without hsl() wrapper, e.g. "240 10% 3.9%")
  background: string;
  foreground: string;

  // Primary (semantic)
  primary: string;
  'primary-foreground': string;
  'primary-bg': string;
  'primary-text': string;
  'primary-light': string;

  // Secondary
  secondary: string;
  'secondary-foreground': string;

  // Destructive / danger (alias)
  destructive: string;
  'destructive-foreground': string;
  danger: string;
  'danger-foreground': string;
  'danger-bg': string;
  'danger-text': string;

  // Success
  success: string;
  'success-foreground': string;
  'success-bg': string;
  'success-text': string;

  // Warning
  warning: string;
  'warning-foreground': string;
  'warning-bg': string;
  'warning-text': string;

  // Accent extras (from skill palette)
  purple: string;
  'purple-bg': string;
  'purple-text': string;
  cyan: string;
  'cyan-bg': string;
  pink: string;
  lime: string;

  // Muted / neutral
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

  // Chart palette (8 colors per skill)
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
  'chart-6': string;
  'chart-7': string;
  'chart-8': string;

  // Sidebar
  'sidebar-background': string;
  'sidebar-foreground': string;
  'sidebar-primary': string;
  'sidebar-primary-foreground': string;
  'sidebar-accent': string;
  'sidebar-accent-foreground': string;
  'sidebar-border': string;
  'sidebar-ring': string;

  // Shadows (raw CSS values, not HSL)
  'shadow-card': string;
  'shadow-card-hover': string;
  'shadow-tooltip': string;

  // Fonts
  'font-sans': string;
  'font-mono': string;
}

export interface ThemePreset {
  name: string;
  label: string;
  tokens: {
    light: Partial<ThemeTokens>;
    dark: Partial<ThemeTokens>;
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
