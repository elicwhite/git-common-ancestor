'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
const sinon = require('sinon-sandbox');

describe('module/index', () => {
  let gitCommonAncestor;
  let longStub;

  beforeEach(() => {
    longStub = sinon.stub();

    gitCommonAncestor = proxyquire('../../', {
      'git-rev': {
        long: longStub
      }
    });
  });

  describe('#ofShaAndBranch', () => {
    it('should return branching point', () => {
      const sha = '92ce1d58080270ffc87b63a90cba18866f29ba9f';
      const branch = 'master';
      const expected = 'f7d7655f237486d52e8b71a8bb701e63121bec9b';

      return gitCommonAncestor.ofShaAndBranch(sha, branch)
        .then(result => {
          assert.strictEqual(result, expected);
        });
    });
  });

  describe('#fromBranch', () => {
    it('should call ofShaAndBranch with current git sha', () => {
      const expected = 'ancestor';

      longStub.callsArgWith(0, 'sha');
      const ofShaAndBranchStub = sinon.stub(gitCommonAncestor, 'ofShaAndBranch');
      ofShaAndBranchStub.withArgs('sha', 'master').resolves(expected);

      return gitCommonAncestor.fromBranch('master')
        .then(result => {
          assert.strictEqual(result, expected);
        });
    });
  });

  describe('#getShaHistory', () => {
    let getShaHistory;

    beforeEach(() => {
      getShaHistory = gitCommonAncestor.__get__('getShaHistory');
    });

    it('should return expected', () => {
      const expected = [
        '92ce1d58080270ffc87b63a90cba18866f29ba9f',
        'f7d7655f237486d52e8b71a8bb701e63121bec9b'
      ];

      return getShaHistory('92ce1d58080270ffc87b63a90cba18866f29ba9f')
        .then(result => {
          assert.deepEqual(result, expected);
        });
    });
  });

  describe('#getBranchHistory', () => {
    let getBranchHistory;

    beforeEach(() => {
      getBranchHistory = gitCommonAncestor.__get__('getBranchHistory');
    });

    it('should return expected', () => {
      const expected = [
        '8379add59b1c2450c3a67157bdb7b3002dfc6ecf',
        'b8dd3cee9c81ad85600c559a9e0c933646023792',
        'f7d7655f237486d52e8b71a8bb701e63121bec9b'
      ];

      return getBranchHistory('8379add59b1c2450c3a67157bdb7b3002dfc6ecf')
        .then(result => {
          assert.deepEqual(result, expected);
        });
    });
  });

  describe('#getFirstCommonSha', () => {
    let getFirstCommonSha;

    beforeEach(() => {
      getFirstCommonSha = gitCommonAncestor.__get__('getFirstCommonSha');
    });

    it('should be null with empty arrays', () => {
      const result = getFirstCommonSha([], []);
      assert.isNull(result);
    });

    it('with one thing in history should be one thing', () => {
      const result = getFirstCommonSha(['a'], ['a']);
      assert.strictEqual(result, 'a');
    });

    it('should be last one that is the same from end', () => {
      const result = getFirstCommonSha(
        ['a', 'b', 'c'],
        ['d', 'b', 'c']
      );
      assert.strictEqual(result, 'b');
    });

    it('should be first common sha even with other diffs', () => {
      const result = getFirstCommonSha(
        ['a', 'c', 'b', 'f'],
        ['d', 'b', 'h']
      );
      assert.strictEqual(result, 'b');
    });

    it('should be null if nothing common', () => {
      const result = getFirstCommonSha(['a', 'b'], ['c', 'd']);
      assert.isNull(result);
    });
  });
});
