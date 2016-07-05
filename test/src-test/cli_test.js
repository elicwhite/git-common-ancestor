'use strict';

const childProcess = require('child_process');
const path = require('path');

describe('spawned on this repo', () => {
  const cliPath = path.resolve(__dirname, '../../bin/cli.js');

  it('should print ancestor', done => {
    const child = childProcess.spawn(process.execPath, [
      cliPath,
      '--sha',
      '92ce1d58080270ffc87b63a90cba18866f29ba9f',
      '--branch',
      'master'
    ], {
      cwd: __dirname
    });

    child.on('exit', code => {
      assert.strictEqual(code, 0);
      const output = child.stdout.read().toString();
      assert.strictEqual(output, 'f7d7655f237486d52e8b71a8bb701e63121bec9b\n');
      done();
    });
  });

  it('should be failure when not given a branch', done => {
    const child = childProcess.spawn(process.execPath, [
      cliPath,
      '--sha',
      '92ce1d58080270ffc87b63a90cba18866f29ba9f'
    ], {
      cwd: __dirname
    });

    child.on('exit', code => {
      assert.strictEqual(code, 1);
      const output = child.stdout.read().toString();
      const message = '--branch is required\n';
      assert.strictEqual(output, message);
      done();
    });
  });
});
