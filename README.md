# git-common-ancestor

[![Build Status](https://travis-ci.org/TheSavior/git-common-ancestor.svg)](https://travis-ci.org/TheSavior/git-common-ancestor)
[![devDependency Status](https://david-dm.org/TheSavior/git-common-ancestor.svg)](https://david-dm.org/TheSavior/git-common-ancestor#info=devDependencies)
[![devDependency Status](https://david-dm.org/TheSavior/git-common-ancestor/dev-status.svg)](https://david-dm.org/TheSavior/git-common-ancestor#info=devDependencies)


## Installation

```sh
$ npm install git-common-ancestor --save-dev
```

## Usage
![Git Graph](/resources/git_graph.png?raw=true)

### #ofShaAndBranch(string sha, string branch) -> Promise(string sha)

```
var gitCommonAncestor = require('git-common-ancestor');
var sha = '70d708aacad0dcc40346cb15fd05ddb14e8e5f29';

gitCommonAncestor.ofShaAndBranch(sha, 'master')
.then(function(branchPoint) {
  assert.strictEqual(branchPoint, '0b256cbf19f306e4fc4090b0b4bec096d1bfd5eb')
});

```

### #fromBranch(string branch) -> Promise(string sha)
Calls `ofShaAndBranch` passing in the current sha and diffing against the given branch.

```
var gitCommonAncestor = require('git-common-ancestor');
gitCommonAncestor.fromBranch('master')
.then(function(branchPoint) {
  // Where the current sha branched from master
})
```
