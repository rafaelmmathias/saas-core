# @saas-core/playground

Vite + React demo app showcasing the SaaS core design system.

## Routes
- `/` — Home with overview cards
- `/components` — Component gallery (buttons, inputs, feedback, overlays)
- `/forms` — Form examples with react-hook-form + zod
- `/theming` — Live theme editor (mode, presets, custom colors)
- `/i18n` — Language switcher + currency demo

## Adding a New Route
1. Create component in `src/app/routes/`
2. Add route in `src/app/layout.tsx` Routes
3. Add nav link in `Navigation` component
4. Add translation keys in `locales/en/common.json` and `locales/pt-BR/common.json`

## i18n Setup
- Config: `src/config/i18n.ts`
- Resources loaded synchronously at app init
- Supported: en, pt-BR
