'use strict';

const path = require('path');

const tsjestConfig = {
  tsconfig: {
    jsx: 'react-jsx',
    module: 'CommonJS',
    esModuleInterop: true,
    isolatedModules: true,
  },
  diagnostics: false,
};

function createBaseConfig(packageDir) {
  const coreRoot = path.resolve(packageDir, '../../packages/core/src');

  return {
    // Use require.resolve so jest finds these packages inside config-jest's
    // node_modules rather than the consuming package's node_modules.
    testEnvironment: require.resolve('jest-environment-jsdom'),
    // jsdom defaults to ['browser', 'require', 'default'] export conditions.
    // Several packages (lucide-react, radix-ui) map 'browser' → ESM builds,
    // which Jest can't require(). Drop 'browser' so the 'require' condition wins
    // and Jest gets the CJS build instead.
    testEnvironmentOptions: {
      customExportConditions: ['require', 'default', 'node'],
    },
    transform: {
      '^.+\\.tsx?$': [require.resolve('ts-jest'), tsjestConfig],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/__tests__/**/*.spec.[jt]s?(x)'],
    setupFilesAfterEnv: [path.resolve(__dirname, 'setup.cjs')],
    moduleNameMapper: {
      '^@saas-core/core/currency$': `${coreRoot}/currency/index.ts`,
      '^@saas-core/core/i18n$': `${coreRoot}/i18n/index.ts`,
      '^@saas-core/core/theme$': `${coreRoot}/theme/index.ts`,
      '^@saas-core/core/helpers$': `${coreRoot}/helpers/index.ts`,
      '\\.(css|less|scss|sass)$': path.resolve(__dirname, 'style-mock.cjs'),
      '\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$': path.resolve(__dirname, 'file-mock.cjs'),
    },
  };
}

module.exports = { createBaseConfig };
