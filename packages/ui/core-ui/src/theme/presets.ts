import type { ThemePreset, ThemeTokens } from './types';

const lightTokens: ThemeTokens = {
  background: '0 0% 100%',
  foreground: '220 39% 11%',

  primary: '217 91% 60%',
  'primary-foreground': '0 0% 100%',
  'primary-bg': '214 100% 97%',
  'primary-text': '224 76% 48%',
  'primary-light': '213 94% 78%',

  secondary: '220 14% 96%',
  'secondary-foreground': '220 39% 11%',

  destructive: '0 84% 60%',
  'destructive-foreground': '0 0% 100%',
  danger: '0 84% 60%',
  'danger-foreground': '0 0% 100%',
  'danger-bg': '0 86% 97%',
  'danger-text': '0 74% 42%',

  success: '160 84% 39%',
  'success-foreground': '0 0% 100%',
  'success-bg': '143 85% 96%',
  'success-text': '142 72% 29%',

  warning: '38 92% 50%',
  'warning-foreground': '0 0% 100%',
  'warning-bg': '48 100% 96%',
  'warning-text': '32 81% 29%',

  purple: '258 90% 66%',
  'purple-bg': '270 100% 98%',
  'purple-text': '262 83% 58%',
  cyan: '189 94% 43%',
  'cyan-bg': '183 100% 96%',
  pink: '330 81% 60%',
  lime: '84 81% 44%',

  muted: '220 14% 96%',
  'muted-foreground': '220 9% 46%',
  accent: '220 14% 96%',
  'accent-foreground': '220 39% 11%',
  popover: '0 0% 100%',
  'popover-foreground': '220 39% 11%',
  card: '0 0% 100%',
  'card-foreground': '220 39% 11%',
  border: '220 13% 91%',
  input: '220 13% 91%',
  ring: '217 91% 60%',
  radius: '0.5rem',

  'chart-1': '217 91% 60%',
  'chart-2': '160 84% 39%',
  'chart-3': '38 92% 50%',
  'chart-4': '0 84% 60%',
  'chart-5': '258 90% 66%',
  'chart-6': '330 81% 60%',
  'chart-7': '189 94% 43%',
  'chart-8': '84 81% 44%',

  'sidebar-background': '0 0% 100%',
  'sidebar-foreground': '220 39% 11%',
  'sidebar-primary': '217 91% 60%',
  'sidebar-primary-foreground': '0 0% 100%',
  'sidebar-accent': '220 14% 96%',
  'sidebar-accent-foreground': '220 39% 11%',
  'sidebar-border': '220 13% 91%',
  'sidebar-ring': '217 91% 60%',

  'shadow-card': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'shadow-card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  'shadow-tooltip': '0 10px 15px -3px rgb(0 0 0 / 0.1)',

  'font-sans': 'system-ui, -apple-system, sans-serif',
  'font-mono': 'ui-monospace, SFMono-Regular, "JetBrains Mono", monospace',
};

const darkTokens: ThemeTokens = {
  background: '220 26% 8%',
  foreground: '220 9% 96%',

  primary: '213 94% 68%',
  'primary-foreground': '220 26% 8%',
  'primary-bg': '217 91% 18%',
  'primary-text': '213 94% 78%',
  'primary-light': '213 94% 78%',

  secondary: '220 14% 16%',
  'secondary-foreground': '220 9% 96%',

  destructive: '0 72% 51%',
  'destructive-foreground': '0 0% 98%',
  danger: '0 72% 51%',
  'danger-foreground': '0 0% 98%',
  'danger-bg': '0 63% 18%',
  'danger-text': '0 93% 82%',

  success: '160 84% 45%',
  'success-foreground': '160 84% 10%',
  'success-bg': '160 84% 14%',
  'success-text': '143 85% 76%',

  warning: '38 92% 58%',
  'warning-foreground': '38 92% 10%',
  'warning-bg': '32 81% 18%',
  'warning-text': '48 96% 80%',

  purple: '258 90% 72%',
  'purple-bg': '262 83% 20%',
  'purple-text': '270 100% 88%',
  cyan: '189 94% 55%',
  'cyan-bg': '189 94% 16%',
  pink: '330 81% 68%',
  lime: '84 81% 58%',

  muted: '220 14% 16%',
  'muted-foreground': '220 9% 64%',
  accent: '220 14% 16%',
  'accent-foreground': '220 9% 96%',
  popover: '220 26% 10%',
  'popover-foreground': '220 9% 96%',
  card: '220 26% 10%',
  'card-foreground': '220 9% 96%',
  border: '220 14% 20%',
  input: '220 14% 20%',
  ring: '213 94% 68%',
  radius: '0.5rem',

  'chart-1': '213 94% 68%',
  'chart-2': '160 84% 45%',
  'chart-3': '38 92% 58%',
  'chart-4': '0 72% 61%',
  'chart-5': '258 90% 72%',
  'chart-6': '330 81% 68%',
  'chart-7': '189 94% 55%',
  'chart-8': '84 81% 58%',

  'sidebar-background': '220 26% 10%',
  'sidebar-foreground': '220 9% 96%',
  'sidebar-primary': '213 94% 68%',
  'sidebar-primary-foreground': '220 26% 8%',
  'sidebar-accent': '220 14% 16%',
  'sidebar-accent-foreground': '220 9% 96%',
  'sidebar-border': '220 14% 20%',
  'sidebar-ring': '213 94% 68%',

  'shadow-card': '0 1px 2px 0 rgb(0 0 0 / 0.4)',
  'shadow-card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.5)',
  'shadow-tooltip': '0 10px 15px -3px rgb(0 0 0 / 0.5)',

  'font-sans': 'system-ui, -apple-system, sans-serif',
  'font-mono': 'ui-monospace, SFMono-Regular, "JetBrains Mono", monospace',
};

export const defaultPreset: ThemePreset = {
  name: 'default',
  label: 'Default',
  tokens: {
    light: lightTokens,
    dark: darkTokens,
  },
};

export const defaultLightTokens = lightTokens;
export const defaultDarkTokens = darkTokens;
