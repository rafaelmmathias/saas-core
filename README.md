# saas-core

A pnpm monorepo powered by Turborepo for building SaaS applications.

## Tech Stack

- **Runtime**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, CSS custom properties for theming
- **Components**: shadcn/ui (New York style)
- **Forms**: react-hook-form + zod
- **i18n**: i18next + react-i18next
- **Build**: Vite (apps), `tsc --noEmit` (packages)
- **Monorepo**: pnpm workspaces + Turborepo

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Or run a specific app
pnpm play          # playground
pnpm planner:dev   # planner
```

## Project Structure

```
saas-core/
├── apps/
│   ├── playground/     # Dev sandbox — component showcase
│   └── planner/        # Task planner app
├── packages/
│   ├── config/         # Layer 0 — tooling only (eslint, tailwind, ts)
│   ├── core/           # Layer 1 — universal runtime primitives
│   ├── ui/core-ui/     # Layer 2 — shadcn components + form wrappers
│   ├── features/       # Layer 3 — domain features shared across some apps
│   └── modules/        # Layer 4 — compositions of features shared across 2+ apps
└── tools/
    └── rag/            # Local RAG tool for codebase querying
```

## Dependency Layers

Packages can only import **downward**. Horizontal or upward imports are forbidden and enforced by ESLint.

```
apps      →  any layer
modules/  →  features, ui, core, config
features/ →  ui, core, config
ui/       →  core, config
core/     →  config
config/   →  nothing
```

## Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint everything
pnpm format           # Format with Prettier
pnpm typecheck        # Type-check all packages
pnpm check-all        # format:check + lint + typecheck + test
pnpm fix-all          # format + lint:fix + check-all
```

### App-specific

```bash
pnpm play             # Run playground app
pnpm planner:dev      # Run planner app
pnpm planner:build    # Build planner app
```

### RAG (codebase search)

```bash
pnpm rag:index                           # Index the repo into the vector store
pnpm rag:query "how does theming work?"  # Query the index, writes context.md
```

The query command writes retrieved chunks to `tools/rag/data/context.md`. Reference it in Claude Code with `@tools/rag/data/context.md`.

## Package Names

| Folder                      | Package name                 |
| --------------------------- | ---------------------------- |
| `packages/config/eslint/`   | `@saas-core/config-eslint`   |
| `packages/config/tailwind/` | `@saas-core/config-tailwind` |
| `packages/config/ts/`       | `@saas-core/config-ts`       |
| `packages/core/`            | `@saas-core/core`            |
| `packages/ui/core-ui/`      | `@saas-core/core-ui`         |

## Requirements

- Node.js 24+
- pnpm 10.33+
