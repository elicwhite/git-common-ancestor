#!/usr/bin/env node

'use strict';

var minimist = require('minimist');
var gitCommonAncestor = require('../');

var argv = minimist(process.argv.slice(2));

if (!argv.branch) {
  console.log('--branch is required'); // eslint-disable-line no-console
  process.exit(1); // eslint-disable-line no-process-exit
}

// gitCommonAncestor.ofShaAndBranch((argv, Cli.reporter);


var Cli = {
  reporter: function (result) {
    result.error.forEach(function (dep) {
      console.log(dep);
    });

    if (result.error.length > 0) {
      process.exit(1); // eslint-disable-line no-process-exit
    }
  },
};





module.exports = Cli;
