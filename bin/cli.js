#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

var minimist = require('minimist');
var gitCommonAncestor = require('../');

var argv = minimist(process.argv.slice(2));

if (!argv.branch) {
  console.log('--branch is required');
  process.exit(1); // eslint-disable-line no-process-exit
}

if (argv.sha) {
  gitCommonAncestor.ofShaAndBranch(argv.sha, argv.branch)
  .then(reporter)
  .catch(error);
} else {
  gitCommonAncestor.fromBranch(argv.branch)
  .then(reporter)
  .catch(error);
}

function reporter(output) {
  console.log(output);
}

function error(error) {
  console.error('An error occurred');
  console.error(error);
}
