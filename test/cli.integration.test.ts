import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const cliPath = fileURLToPath(new URL('../dist/cli.js', import.meta.url));
const usage = 'usage: validate-commit [--message <message>] [--verbose]\n';

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
      diagnostic: 'error: unknown option: --wat',
    },
    {
      name: 'an unknown short option',
      args: ['-x'],
      diagnostic: 'error: unknown option: -x',
    },
    {
      name: 'an unexpected positional argument',
      args: ['feat: add probe'],
      diagnostic: 'error: unexpected argument: feat: add probe',
    },
  ])('reports $name as a usage failure', ({ args, diagnostic }) => {
    const result = spawnSync(process.execPath, [cliPath, ...args], { encoding: 'utf8' });

    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`${diagnostic}\n${usage}`);
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
