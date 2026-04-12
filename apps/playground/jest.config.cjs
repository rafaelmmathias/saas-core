'use strict';

const path = require('path');
const { createReactConfig } = require('@saas-core/config-jest/react');

const base = createReactConfig(__dirname);
const coreUiSrc = path.resolve(__dirname, '../../packages/ui/core-ui/src');

module.exports = {
  ...base,
  setupFilesAfterEnv: [path.resolve(__dirname, 'src/app/routes/__tests__/setup.ts')],
  // lucide-react ships ESM-only via its exports field — transform it through ts-jest
  // so the ESM import syntax gets converted to CJS at test time.
  transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
  moduleNameMapper: {
    '^@/(.*)$': path.resolve(__dirname, 'src/$1'),
    '^@saas-core/core-ui/components/composite/(.*)$': `${coreUiSrc}/components/composite/$1.tsx`,
    '^@saas-core/core-ui/components/(.*)$': `${coreUiSrc}/components/ui/$1.tsx`,
    '^@saas-core/core-ui/form/(.*)$': `${coreUiSrc}/form/$1.tsx`,
    ...base.moduleNameMapper,
  },
};
