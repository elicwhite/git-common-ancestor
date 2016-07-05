'use strict';

const childProcess = require('child_process');
const gitRev = require('git-rev');

function readStreamData(spawnResult) {
  return new Promise((resolve, reject) => {
    let input = '';
    let error = '';

    spawnResult.stdout.on('data', data => {
      input += data.toString();
    });

    spawnResult.stderr.on('data', data => {
      error += data.toString();
    });

    spawnResult.on('close', code => {
      if (code !== 0) {
        return reject(new Error(error));
      }

      return resolve(input);
    });
  });
}

function parseRevListOutput(input) {
  input = input.trim();
  const shas = input.split('\n');

  return shas;
}

function getBranchHistory(branch) {
  const result = childProcess.spawn('git', ['rev-list', branch, '--first-parent']);

  return readStreamData(result)
  .then(parseRevListOutput);
}

function getShaHistory(sha) {
  const result = childProcess.spawn('git', ['rev-list', sha]);

  return readStreamData(result)
  .then(parseRevListOutput);
}

function getFirstCommonSha(shas1, shas2) {
  if (!shas1.length || !shas2.length) {
    return null;
  }

  let smaller = shas1;
  let larger = shas2;

  if (shas2.length < shas1.length) {
    smaller = shas2;
    larger = shas1;
  }

  for (let i = 0; i < smaller.length; i++) {
    if (larger.indexOf(smaller[i]) !== -1) {
      return smaller[i];
    }
  }

  return null;
}

const GitCommonAncestor = {
  ofShaAndBranch(headSha, baseBranch) {
    const branchHistory = getBranchHistory(baseBranch);
    const shaHistory = getShaHistory(headSha);

    return Promise.all([shaHistory, branchHistory])
    .then(history => getFirstCommonSha(history[0], history[1]));
  },

  fromBranch(baseBranch) {
    return new Promise(gitRev.long)
    .then(sha => this.ofShaAndBranch(sha, baseBranch));
  }
};

module.exports = GitCommonAncestor;
