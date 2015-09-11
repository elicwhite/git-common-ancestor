/* eslint-env mocha */

'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
chai.config.includeStack = true;

var sinon = require('sinon');
require('sinon-as-promised');
sinon.assert.expose(chai.assert, {
  prefix: ''
});

global.assert = chai.assert;

var sinonSandbox = require('sinon-sandbox');

afterEach(function() {
  if (sinonSandbox.clock) {
    sinonSandbox.clock.restore();
  }

  sinonSandbox.restore();
});

require('rewire-global').enable();
