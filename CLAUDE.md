# SaaS Core Monorepo

## Overview
A pnpm monorepo powered by Turborepo for building SaaS applications. Contains shared packages for UI components, theming, internationalization, and utilities.

## Tech Stack
- **Runtime**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, CSS custom properties for theming
- **Components**: shadcn/ui (New York style)
- **Forms**: react-hook-form + zod validation
- **i18n**: i18next + react-i18next (file-based JSON resources)
- **Build**: Vite (apps), tsup (packages)
- **Monorepo**: pnpm workspaces + Turborepo

## Project Structure
```
saas-core/
├── apps/
│   └── playground/              # Component showcase & demo app
├── packages/
│   ├── config-ts/               # Shared TypeScript configs
│   ├── config-eslint/           # Shared ESLint flat configs
│   ├── config-tailwind/         # Shared Tailwind preset
│   ├── core/                    # Framework-agnostic utilities
│   │   ├── theme/               # ThemeProvider, live switching, persistence
│   │   ├── i18n/                # i18next setup, typed namespaces
│   │   ├── currency/            # Multi-currency formatting
│   │   └── helpers/             # Shared utilities (cn, etc.)
│   └── core-ui/                 # React component library
│       ├── components/ui/       # shadcn components
│       ├── form/                # react-hook-form wrappers
│       ├── providers/           # Re-exported providers
│       └── hooks/               # Re-exported hooks
```

## Commands
- `pnpm dev` — Start all apps in dev mode
- `pnpm build` — Build all packages and apps
- `pnpm lint` — Lint all packages
- `pnpm format` — Format all files with Prettier
- `pnpm typecheck` — Type-check all packages

## Package Dependencies
```
config-ts ← (no deps)
config-eslint ← (no deps)
config-tailwind ← config-ts
core ← config-ts, config-eslint
core-ui ← core, config-ts, config-eslint, config-tailwind
playground ← core, core-ui, config-ts, config-eslint
```

## Conventions

### File Naming
- Components: PascalCase (`Button.tsx`) — shadcn uses kebab-case (`button.tsx`), keep shadcn's convention for UI components
- Hooks: camelCase prefixed with `use` (`useTheme.ts`)
- Utilities: camelCase (`cn.ts`)
- Types: PascalCase (`types.ts`)

### Imports
- Use `@/` alias for internal imports within each package/app
- Use `@saas-core/core` and `@saas-core/core-ui` for cross-package imports
- Import order: builtin → external → internal → relative (enforced by ESLint)
- Always use type imports: `import type { Foo } from './types'`

### Component Patterns
- All shadcn components live in `packages/core-ui/src/components/ui/`
- Add new shadcn components via CLI: `npx shadcn@latest add <component> --yes`
- Form wrappers go in `packages/core-ui/src/form/`
- Custom non-shadcn components use `tv()` from tailwind-variants (when added)

### Theming
- Theme tokens are CSS custom properties (HSL values without `hsl()`)
- ThemeProvider reads/writes to localStorage
- Use `useTheme()` hook to access/modify theme
- Dark mode via `.dark` class on `<html>`

### i18n
- Translation files: `locales/{lang}/{namespace}.json`
- Default namespace: `common`
- Supported languages: `en`, `pt-BR`
- Use `useTranslation()` hook, access keys via `t('namespace.key')`

### Adding a New App
1. Create folder in `apps/`
2. Add `package.json` with workspace deps
3. Extend `@saas-core/config-ts/react` in tsconfig
4. Import `@saas-core/config-eslint/react` in eslint config
5. Wrap root with `ThemeProvider` + `CurrencyProvider` from core
