'use strict';

const { createBaseConfig } = require('./base.cjs');

function createReactConfig(packageDir) {
  return createBaseConfig(packageDir);
}

module.exports = { createReactConfig };
