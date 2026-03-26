# @saas-core/core

Framework-agnostic (with React bindings) utility package providing:

- **theme/**: ThemeProvider, useTheme hook, CSS variable-based theming with presets and persistence
- **i18n/**: i18next initialization, typed namespace support
- **currency/**: CurrencyProvider, useCurrency hook, Intl.NumberFormat-based formatting
- **helpers/**: cn() utility for className merging

## Key Rules

- This package CAN include React code (providers, hooks) since all apps are React-based
- Theme persistence uses localStorage (key: `saas-core-theme`)
- Theme tokens are HSL values without the `hsl()` wrapper (e.g., `"240 5.9% 10%"`)
- i18n resources are JSON files loaded at init time
- Currency formatting uses `Intl.NumberFormat` — no external deps

## Exports

```ts
import { ThemeProvider, useTheme } from '@saas-core/core/theme';
import { initI18n } from '@saas-core/core/i18n';
import { CurrencyProvider, useCurrency } from '@saas-core/core/currency';
import { cn } from '@saas-core/core/helpers';
```
