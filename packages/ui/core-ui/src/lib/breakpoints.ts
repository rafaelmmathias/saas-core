// Keep these values in sync with packages/config/tailwind/tailwind.config.ts → theme.extend.screens
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;
