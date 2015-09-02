'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
chai.config.includeStack = true;

global.assert = chai.assert;

require('rewire-global').enable();
