import base from './base.js';
import noTopLevelSideEffects from './rules/no-top-level-side-effects.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  {
    plugins: {
      'saas-core': {
        rules: {
          'no-top-level-side-effects': noTopLevelSideEffects,
        },
      },
    },
    rules: {
      'saas-core/no-top-level-side-effects': 'error',
    },
  },
  {
    // Test files use top-level describe/it/jest.mock() by design — the rule
    // does not apply inside __tests__ directories.
    files: ['**/__tests__/**'],
    rules: {
      'saas-core/no-top-level-side-effects': 'off',
    },
  },
];
