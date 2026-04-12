/**
 * Root ESLint config — used by VSCode (runs ESLint from the workspace root).
 * The CLI uses per-package configs invoked by Turborepo from each package dir.
 *
 * Each config block is scoped to its package via `files` so rules don't
 * bleed across packages (e.g. no-top-level-side-effects must not fire in apps).
 */
import library from './packages/config/eslint/library.js';
import libraryReact from './packages/config/eslint/library-react.js';
import react from './packages/config/eslint/react.js';

/**
 * Scope a flat-config array to specific file globs.
 * Global-ignore entries (sole key is `ignores`) are kept as-is — adding
 * `files` to them would turn them into local ignores, breaking their intent.
 */
function forFiles(configs, files) {
  return configs.map((cfg) => {
    const keys = Object.keys(cfg);
    if (keys.length === 1 && keys[0] === 'ignores') return cfg;
    return { ...cfg, files };
  });
}

/**
 * Layer enforcement via import/no-restricted-paths.
 *
 * Dependency direction (can only import downward):
 *   apps  →  modules  →  features  →  ui  →  core  →  config
 *
 * Horizontal imports (same layer) are forbidden.
 */
const layerEnforcement = {
  plugins: {
    'import-x': (await import('eslint-plugin-import-x')).default,
  },
  rules: {
    'import-x/no-restricted-paths': [
      'error',
      {
        zones: [
          // config/ → cannot import from runtime layers
          {
            target: './packages/config',
            from: ['./packages/core', './packages/ui', './packages/features', './packages/modules'],
            message: '[Layer violation] config/ is tooling-only — no runtime deps allowed.',
          },
          // core/ → cannot import from ui/ or above
          {
            target: './packages/core',
            from: ['./packages/ui', './packages/features', './packages/modules'],
            message: '[Layer violation] core/ cannot depend on ui/ or higher layers.',
          },
          // ui/ → cannot import from features/ or modules/
          {
            target: './packages/ui',
            from: ['./packages/features', './packages/modules'],
            message: '[Layer violation] ui/ cannot depend on features/ or modules/.',
          },
          // features/ → cannot import other features/ (horizontal)
          {
            target: './packages/features',
            from: './packages/features',
            message: '[Layer violation] features/ cannot import other features/ — extract shared logic to ui/ or core/.',
          },
          // features/ → cannot import modules/
          {
            target: './packages/features',
            from: './packages/modules',
            message: '[Layer violation] features/ cannot depend on modules/.',
          },
          // modules/ → cannot import other modules/ (horizontal)
          {
            target: './packages/modules',
            from: './packages/modules',
            message: '[Layer violation] modules/ cannot import other modules/ — if shared, move up to a new layer.',
          },
        ],
      },
    ],
  },
};

export default [
  // Library packages: .ts files (no JSX) — library rules + no-top-level-side-effects
  ...forFiles(library, ['packages/**/src/**/*.ts']),
  // Library packages: .tsx files (JSX) — same + React hooks rules
  ...forFiles(libraryReact, ['packages/**/src/**/*.tsx']),
  // Apps: all TS/TSX — React rules, no side-effects restriction (apps can have top-level calls)
  ...forFiles(react, ['apps/**/src/**/*.{ts,tsx}']),
  // Layer enforcement — applies to all packages
  {
    ...layerEnforcement,
    files: ['packages/**/*.{ts,tsx}'],
  },
];
