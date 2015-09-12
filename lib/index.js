'use strict';

var childProcess = require('child_process');
var gitRev = require('git-rev');

function readStreamData(spawnResult) {
  return new Promise(function(resolve, reject) {
    var input = '';
    var error = '';

    spawnResult.stdout.on('data', function(data) {
      input += data.toString();
    });

    spawnResult.stderr.on('data', function(data) {
      error += data.toString();
    });

    spawnResult.on('close', function(code) {
      if (code !== 0) {
        return reject(new Error(error));
      }

      return resolve(input);
    });
  });
}

function parseRevListOutput(input) {
  input = input.trim();
  var shas = input.split('\n');

  return shas;
}

function getBranchHistory(branch) {
  var result = childProcess.spawn('git', ['rev-list', branch, '--first-parent']);

  return readStreamData(result)
  .then(parseRevListOutput);
}

function getShaHistory(sha) {
  var result = childProcess.spawn('git', ['rev-list', sha]);

  return readStreamData(result)
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
  },

  fromBranch: function(baseBranch) {
    return new Promise(gitRev.long)
    .then((function(sha) {
      return this.ofShaAndBranch(sha, baseBranch);
    }).bind(this));
  }
};

module.exports = GitCommonAncestor;
