import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

const cliPath = fileURLToPath(new URL('../dist/cli.js', import.meta.url));
const usage = 'usage: validate-commit [--message <message>] [--verbose]\n';

function expectTerminalSafe(output: string): void {
  const unexpectedControls = [...output.replaceAll('\n', '')].filter((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  expect(unexpectedControls).toEqual([]);
}

function runWithOutputError(stream: 'stdout' | 'stderr', code: string) {
  const args = stream === 'stdout' ? ['--help'] : ['--message', 'bad message'];
  const script = `
    const cliPath = ${JSON.stringify(cliPath)};
    process.argv = [process.execPath, cliPath, ...${JSON.stringify(args)}];
    process[${JSON.stringify(stream)}].write = function () {
      const error = Object.assign(new Error('broken output pipe'), { code: ${JSON.stringify(code)} });
      this.emit('error', error);
      return false;
    };
    await import(${JSON.stringify(pathToFileURL(cliPath).href)});
  `;

  return spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    encoding: 'utf8',
  });
}

describe('compiled validate-commit CLI', () => {
  it('accepts a valid --message silently', () => {
    const result = spawnSync(process.execPath, [cliPath, '--message', 'feat: add probe'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
  });

  it('accepts a valid message from stdin silently', () => {
    const result = spawnSync(process.execPath, [cliPath], {
      encoding: 'utf8',
      input: 'feat: stdin proof\n',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
  });

  it.each([
    {
      name: 'argv',
      args: ['--message', 'feat: add probe', '--verbose'],
      input: undefined,
    },
    { name: 'stdin', args: ['--verbose'], input: 'feat: stdin proof\n' },
  ])('prints OK for valid $name input in verbose mode', ({ args, input }) => {
    const result = spawnSync(process.execPath, [cliPath, ...args], {
      encoding: 'utf8',
      input,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('OK\n');
    expect(result.stderr).toBe('');
  });

  it.each([
    { code: 'empty', message: '', diagnostic: 'commit message is empty' },
    {
      code: 'too-long',
      message: `feat: ${'a'.repeat(67)}`,
      diagnostic: 'header must be 72 characters or fewer',
    },
    {
      code: 'format',
      message: 'bad message',
      diagnostic: 'header must match type(scope)?: subject',
    },
    {
      code: 'type',
      message: 'style: align output',
      diagnostic: 'type "style" is not allowed',
    },
    { code: 'subject', message: 'feat: ', diagnostic: 'subject must not be empty' },
  ])('reports validator code $code through the process boundary', ({ message, diagnostic }) => {
    const result = spawnSync(process.execPath, [cliPath, '--message', message], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`${diagnostic}\n`);
  });

  it.each(['--help', '-h'])('prints help for %s', (option) => {
    const result = spawnSync(process.execPath, [cliPath, option], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe(usage);
    expect(result.stderr).toBe('');
  });

  it.each(['stdout', 'stderr'] as const)(
    'exits quietly when the %s consumer closes the pipe',
    (stream) => {
      const result = runWithOutputError(stream, 'EPIPE');

      expect(result.status).toBe(0);
      expect(result.stdout).toBe('');
      expect(result.stderr).toBe('');
    },
  );

  it.each(['stdout', 'stderr'] as const)(
    'keeps non-EPIPE %s errors visible and nonzero',
    (stream) => {
      const result = runWithOutputError(stream, 'EIO');

      expect(result.status).toBe(1);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain('Error: broken output pipe');
      expect(result.stderr).toContain("code: 'EIO'");
    },
  );

  it.each([
    {
      name: 'a missing --message value',
      args: ['--message'],
      diagnostic: 'error: --message requires a value',
    },
    {
      name: 'an option-shaped --message value',
      args: ['--message', '--verbose'],
      diagnostic: 'error: --message requires a value',
    },
    {
      name: 'a duplicate --message',
      args: ['--message', 'feat: one', '--message', 'fix: two'],
      diagnostic: 'error: --message may only be specified once',
    },
    {
      name: 'an unknown option',
      args: ['--wat'],
      diagnostic: 'error: unknown option',
    },
    {
      name: 'an unknown short option',
      args: ['-x'],
      diagnostic: 'error: unknown option',
    },
    {
      name: 'an unexpected positional argument',
      args: ['feat: add probe'],
      diagnostic: 'error: unexpected argument',
    },
  ])('reports $name as a usage failure', ({ args, diagnostic }) => {
    const result = spawnSync(process.execPath, [cliPath, ...args], { encoding: 'utf8' });

    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`${diagnostic}\n${usage}`);
  });

  it.each([
    ['unknown option', `--bad\u001b\u0007\n\rvalue`, 'error: unknown option'],
    ['positional argument', `bad\u001b\u0007\n\rvalue`, 'error: unexpected argument'],
  ])('does not reflect control bytes from an %s', (_name, argument, diagnostic) => {
    const result = spawnSync(process.execPath, [cliPath, argument], { encoding: 'utf8' });

    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`${diagnostic}\n${usage}`);
    expectTerminalSafe(result.stderr);
  });

  it('validates only the first line of a multiline --message argument', () => {
    const result = spawnSync(
      process.execPath,
      [cliPath, '--message', 'feat: valid header\nthis body is not a conventional header'],
      { encoding: 'utf8' },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
  });

  it('runs when the package bin resolves through a symlink', () => {
    const directory = mkdtempSync(join(tmpdir(), 'validate-commit-'));
    const linkedCliPath = join(directory, 'validate-commit');
    symlinkSync(cliPath, linkedCliPath);

    try {
      const result = spawnSync(
        process.execPath,
        [linkedCliPath, '--message', 'feat: linked bin', '--verbose'],
        { encoding: 'utf8' },
      );

      expect(result.status).toBe(0);
      expect(result.stdout).toBe('OK\n');
      expect(result.stderr).toBe('');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
