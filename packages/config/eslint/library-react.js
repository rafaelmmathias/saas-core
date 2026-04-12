import react from './react.js';
import noTopLevelSideEffects from './rules/no-top-level-side-effects.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...react,
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
];
