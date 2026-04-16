# SaaS Core Monorepo

## Overview

A pnpm monorepo powered by Turborepo for building SaaS applications. `packages/` contains shared code organized in dependency layers. `apps/` contains the actual applications — `playground` is a development sandbox, production apps live alongside it.

## Tech Stack

- **Runtime**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, CSS custom properties for theming
- **Components**: shadcn/ui (New York style)
- **Forms**: react-hook-form + zod validation
- **i18n**: i18next + react-i18next (file-based JSON resources)
- **Build**: Vite (apps), `tsc --noEmit` (packages — source-first, no compile step)
- **Monorepo**: pnpm workspaces + Turborepo

## Project Structure

```
saas-core/
├── apps/
│   ├── playground/          # Dev sandbox — component showcase, NOT a production app
│   └── <your-app>/          # Production apps go here alongside playground
└── packages/
    ├── config/              # Layer 0 — tooling only, zero runtime deps
    │   ├── eslint/          # Shared ESLint flat configs + custom rules
    │   ├── tailwind/        # Shared Tailwind preset
    │   └── ts/              # Shared TypeScript configs
    ├── core/                # Layer 1 — universal runtime primitives
    │   ├── theme/           # ThemeProvider, live switching, persistence
    │   ├── i18n/            # i18next setup, typed namespaces
    │   ├── currency/        # Multi-currency formatting
    │   └── helpers/         # Shared utilities (cn, etc.)
    ├── ui/                  # Layer 2 — universal UI components
    │   └── core-ui/         # shadcn components + form wrappers
    ├── features/            # Layer 3 — domain features shared across SOME apps
    │   └── (empty)          # e.g. features/auth, features/billing
    └── modules/             # Layer 4 — compositions of features shared across 2+ apps
        └── (not yet needed) # Only create when the same feature composition
                             # is required by multiple apps simultaneously
```

## Dependency Layers

Packages can only import **downward**. Imports at the same level or upward are forbidden and enforced by ESLint.

```
apps          →  can import from any layer
modules/      →  features, ui, core, config
features/     →  ui, core, config  (never another features/)
ui/           →  core, config
core/         →  config
config/       →  nothing (tooling only)
```

### When to use each layer

| Layer       | Use when                                           | Example                   |
| ----------- | -------------------------------------------------- | ------------------------- |
| `config/`   | Build tooling, zero runtime code                   | ESLint rules, TS configs  |
| `core/`     | Universal runtime util needed by all apps          | theme, i18n, currency     |
| `ui/`       | Universal UI component needed by all apps          | shadcn, form wrappers     |
| `features/` | Domain logic shared by **some** apps               | auth, billing, analytics  |
| `modules/`  | Same **composition** of features needed in 2+ apps | checkout (auth + billing) |

### Horizontal imports are always a design problem

If `features/auth` needs to import `features/billing`, something belongs in a lower layer. Extract the shared primitive to `core/` or `ui/`.

If a composition of features is needed only by one app, it lives in the app itself — not in `modules/`. Only extract to `modules/` when two or more apps need the exact same composition.

## Commands

- `pnpm dev` — Start all apps in dev mode
- `pnpm build` — Build all packages and apps
- `pnpm lint` — Lint all packages
- `pnpm format` — Format all files with Prettier
- `pnpm typecheck` — Type-check all packages

## Package Names

Folder structure communicates layers. Package names stay flat for clean imports:

| Folder                      | Package name                 |
| --------------------------- | ---------------------------- |
| `packages/config/eslint/`   | `@saas-core/config-eslint`   |
| `packages/config/tailwind/` | `@saas-core/config-tailwind` |
| `packages/config/ts/`       | `@saas-core/config-ts`       |
| `packages/core/`            | `@saas-core/core`            |
| `packages/ui/core-ui/`      | `@saas-core/core-ui`         |

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

- All shadcn components live in `packages/ui/core-ui/src/components/ui/`
- Add new shadcn components via CLI from `packages/ui/core-ui/`: `npx shadcn@latest add <component> --yes`
- Form wrappers go in `packages/ui/core-ui/src/form/`
- Custom non-shadcn components use `tv()` from tailwind-variants (when added)

### Theming

- Theme tokens are CSS custom properties (HSL values without `hsl()`)
- ThemeProvider reads/writes to localStorage
- Use `useTheme()` hook to access/modify theme
- Dark mode via `.dark` class on `<html>`
- Each app owns its theme **values** (CSS variable overrides); `core/` owns the **mechanism**

### i18n

- Translation files: `locales/{lang}/{namespace}.json`
- Default namespace: `common`
- Supported languages: `en`, `pt-BR`
- Use `useTranslation()` hook, access keys via `t('namespace.key')`

## ESLint Architecture

### Configs in `packages/config/eslint/`

| Config          | Use for                                           |
| --------------- | ------------------------------------------------- |
| `base`          | Non-React TypeScript packages                     |
| `react`         | React apps                                        |
| `library`       | Packages without JSX (`core`)                     |
| `library-react` | Packages with JSX (`core-ui`, future UI packages) |

### Custom Rule: `saas-core/no-top-level-side-effects`

Applied via `library` and `library-react` configs. Flags bare top-level function calls and assignments — these break tree-shaking when `sideEffects: false` is set.

```ts
// ERROR — bare call at module top-level
i18next.use(plugin);

// OK — inside a function
export function init() {
  i18next.use(plugin);
}

// OK — variable declaration
export const config = createConfig();
```

If a file intentionally has top-level side effects, list it in the `sideEffects` array in `package.json`.

### Root `eslint.config.mjs`

Single config used by VSCode (runs from workspace root). Scopes rules by file pattern and enforces layer boundaries via `import-x/no-restricted-paths`. The CLI uses per-package configs via Turborepo.

## Tree-Shaking

All packages declare `"sideEffects": false`. The `saas-core/no-top-level-side-effects` ESLint rule prevents accidental violations at the source level.

## Adding a New App

1. Create folder in `apps/<name>/`
2. Add `package.json` with workspace deps
3. Extend `@saas-core/config-ts/react` in `tsconfig.json`; add `"types": ["node"]` and `"vite.config.ts"` to `include`
4. Use `@saas-core/config-eslint/react` in `eslint.config.mjs`
5. Wrap root with `ThemeProvider` + `CurrencyProvider` from `@saas-core/core`
6. Copy `VENDOR_CHUNKS` pattern from playground's `vite.config.ts`

## Adding a New Package

1. Decide which layer it belongs to — place it in the correct `packages/<layer>/` folder
2. Add `package.json` with `"sideEffects": false` and `"type": "module"`
3. Use the right ESLint config:
   - No JSX → `@saas-core/config-eslint/library`
   - With JSX → `@saas-core/config-eslint/library-react`
4. Add `turbo.json` with `{ "extends": ["//"], "tasks": { "build": { "outputs": [] } } }` if build doesn't emit files
5. Register the new glob pattern in `pnpm-workspace.yaml` if adding a new layer folder

## Codebase Research

Before reading files or directories to understand how something works, run `pnpm rag:query "<question>"` and use the retrieved context as your starting point. Use Grep/Read only for targeted lookups of known symbols or file paths (e.g. finding a specific function, reading a file you already know exists).
