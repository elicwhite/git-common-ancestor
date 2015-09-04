'use strict';

var childProcess = require('child_process');
var promisify = require('es6-promisify');
var execAsync = promisify(childProcess.exec);

function parseRevListOutput(stdout) {
  var result = stdout[0].trim();
  var shas = result.split('\n');

  return shas;
}

function getBranchHistory(branch) {
  return execAsync('git rev-list ' + branch + ' --first-parent')
  .then(parseRevListOutput);
}

function getShaHistory(sha) {
  return execAsync('git rev-list ' + sha)
  .then(parseRevListOutput);
}

function getFirstCommonSha(shas1, shas2) {
  if (!shas1.length || !shas2.length) {
    return null;
  }

  var smaller = shas1;
  var larger = shas2;

  if (shas2.length < shas1.length) {
    smaller = shas2;
    larger = shas1;
  }

  for (var i = 0; i < smaller.length; i++) {
    if (larger.indexOf(smaller[i]) !== -1) {
      return smaller[i];
    }
  }

  return null;
}

var GitCommonAncestor = {
  ofShaAndBranch: function(headSha, baseBranch) {

    var branchHistory = getBranchHistory(baseBranch);
    var shaHistory = getShaHistory(headSha);

    return Promise.all([shaHistory, branchHistory])
    .then(function(history) {
      return getFirstCommonSha(history[0], history[1]);
    });
  }
};

module.exports = GitCommonAncestor;
