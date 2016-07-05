/* eslint-env mocha */

'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.config.includeStack = true;

const sinon = require('sinon');
require('sinon-as-promised');
sinon.assert.expose(chai.assert, {
  prefix: ''
});

global.assert = chai.assert;

const sinonSandbox = require('sinon-sandbox');

afterEach(() => {
  if (sinonSandbox.clock) {
    sinonSandbox.clock.restore();
  }

  sinonSandbox.restore();
});

require('rewire-global').enable();
