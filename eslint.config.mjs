/**
 * Root ESLint config — used by VSCode (runs ESLint from the workspace root).
 * The CLI uses per-package configs invoked by Turborepo from each package dir.
 *
 * Each config block is scoped to its package via `files` so rules don't
 * bleed across packages (e.g. no-top-level-side-effects must not fire in apps).
 */
import library from './packages/config-eslint/library.js';
import libraryReact from './packages/config-eslint/library-react.js';
import react from './packages/config-eslint/react.js';

/**
 * Scope a flat-config array to specific file globs.
 * Global-ignore entries (sole key is `ignores`) are kept as-is — adding
 * `files` to them would turn them into local ignores, breaking their intent.
 */
function forFiles(configs, files) {
  return configs.map(cfg => {
    const keys = Object.keys(cfg);
    if (keys.length === 1 && keys[0] === 'ignores') return cfg;
    return { ...cfg, files };
  });
}

export default [
  // Library packages: .ts files (no JSX) — library rules + no-top-level-side-effects
  ...forFiles(library, ['packages/**/src/**/*.ts']),
  // Library packages: .tsx files (JSX) — same + React hooks rules
  ...forFiles(libraryReact, ['packages/**/src/**/*.tsx']),
  // Apps: all TS/TSX — React rules, no side-effects restriction (apps can have top-level calls)
  ...forFiles(react, ['apps/**/src/**/*.{ts,tsx}']),
];
