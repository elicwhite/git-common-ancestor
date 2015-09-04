'use strict';

var assert = require('chai').assert;
var gitCommonAncestor = require('../../');

describe('module/index', function() {
  describe('#ofShaAndBranch', function() {
    it('should return branching point', function() {
      var sha = '92ce1d58080270ffc87b63a90cba18866f29ba9f';
      var branch = 'master';
      var expected = 'f7d7655f237486d52e8b71a8bb701e63121bec9b';

      return gitCommonAncestor.ofShaAndBranch(sha, branch)
      .then(function(result) {
        assert.strictEqual(result, expected);
      });
    });
  });

  describe('#getShaHistory', function() {
    var getShaHistory;

    beforeEach(function() {
      getShaHistory = gitCommonAncestor.__get__('getShaHistory');
    });

    it('should return expected', function() {
      var expected = [
        '92ce1d58080270ffc87b63a90cba18866f29ba9f',
        'f7d7655f237486d52e8b71a8bb701e63121bec9b'
      ];

      return getShaHistory('92ce1d58080270ffc87b63a90cba18866f29ba9f')
      .then(function(result) {
        assert.deepEqual(result, expected);
      });
    });
  });

  describe('#getBranchHistory', function() {
    var getBranchHistory;

    beforeEach(function() {
      getBranchHistory = gitCommonAncestor.__get__('getBranchHistory');
    });

    it('should return expected', function() {
      var expected = [
        '8379add59b1c2450c3a67157bdb7b3002dfc6ecf',
        'b8dd3cee9c81ad85600c559a9e0c933646023792',
        'f7d7655f237486d52e8b71a8bb701e63121bec9b'
      ];

      return getBranchHistory('8379add59b1c2450c3a67157bdb7b3002dfc6ecf')
      .then(function(result) {
        assert.deepEqual(result, expected);
      });
    });
  });

  describe('#getFirstCommonSha', function() {
    var getFirstCommonSha;

    beforeEach(function() {
      getFirstCommonSha = gitCommonAncestor.__get__('getFirstCommonSha');
    });

    it('should be null with empty arrays', function() {
      var result = getFirstCommonSha([], []);
      assert.isNull(result);
    });

    it('with one thing in history should be one thing', function() {
      var result = getFirstCommonSha(['a'], ['a']);
      assert.strictEqual(result, 'a');
    });

    it('should be last one that is the same from end', function() {
      var result = getFirstCommonSha(
        ['a', 'b', 'c'],
        ['d', 'b', 'c']
      );
      assert.strictEqual(result, 'b');
    });

    it('should be first common sha even with other diffs', function() {
      var result = getFirstCommonSha(
        ['a', 'c', 'b', 'f'],
        ['d', 'b', 'h']
      );
      assert.strictEqual(result, 'b');
    });

    it('should be null if nothing common', function() {
      var result = getFirstCommonSha(['a', 'b'], ['c', 'd']);
      assert.isNull(result);
    });
  });
});
