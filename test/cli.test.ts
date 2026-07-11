import { describe, expect, it, vi } from 'vitest';

import { type CliIo, createProcessIo, runCli } from '../src/cli.js';

function createIo(stdin = ''): {
  io: CliIo;
  readStdin: ReturnType<typeof vi.fn<() => Promise<string>>>;
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const readStdin = vi.fn(async () => stdin);
  return {
    io: {
      readStdin,
      writeStdout: (output) => stdout.push(output),
      writeStderr: (output) => stderr.push(output),
    },
    readStdin,
    stdout,
    stderr,
  };
}

describe('runCli', () => {
  it('gives --message precedence without reading stdin', async () => {
    const harness = createIo('bad message');

    await expect(runCli(['--message', 'feat: argv wins'], harness.io)).resolves.toBe(0);
    expect(harness.readStdin).not.toHaveBeenCalled();
    expect(harness.stdout).toEqual([]);
    expect(harness.stderr).toEqual([]);
  });

  it('reads stdin when no message argument is supplied', async () => {
    const harness = createIo('feat: stdin wins');

    await expect(runCli([], harness.io)).resolves.toBe(0);
    expect(harness.readStdin).toHaveBeenCalledOnce();
  });

  it('writes a validator failure to stderr', async () => {
    const harness = createIo();

    await expect(runCli(['--message', 'bad message'], harness.io)).resolves.toBe(1);
    expect(harness.stderr).toEqual(['header must match type(scope)?: subject\n']);
  });

  it('writes verbose success to stdout', async () => {
    const harness = createIo();

    await expect(
      runCli(['--verbose', '--message', 'feat: visible success'], harness.io),
    ).resolves.toBe(0);
    expect(harness.stdout).toEqual(['OK\n']);
  });

  it.each([
    ['--help'],
    ['-h'],
  ])('writes help for %s', async (option) => {
    const harness = createIo();

    await expect(runCli([option], harness.io)).resolves.toBe(0);
    expect(harness.stdout).toEqual([
      'usage: validate-commit [--message <message>] [--verbose]\n',
    ]);
  });

  it.each([
    ['missing value', ['--message']],
    ['duplicate message', ['--message', 'feat: one', '--message', 'fix: two']],
    ['unknown option', ['--unknown']],
    ['positional argument', ['surprise']],
  ])('returns usage failure for %s', async (_name, args) => {
    const harness = createIo();

    await expect(runCli(args, harness.io)).resolves.toBe(2);
    expect(harness.stdout).toEqual([]);
    expect(harness.stderr[0]).toContain(
      'usage: validate-commit [--message <message>] [--verbose]\n',
    );
  });
});

describe('createProcessIo', () => {
  it('binds stdin, stdout, and stderr streams', async () => {
    const stdoutWrite = vi.fn();
    const stderrWrite = vi.fn();
    const setEncoding = vi.fn();
    const stdin = {
      setEncoding,
      async *[Symbol.asyncIterator](): AsyncGenerator<string> {
        yield 'feat: ';
        yield 'streamed input';
      },
    };
    const io = createProcessIo({
      stdin,
      stdout: { write: stdoutWrite },
      stderr: { write: stderrWrite },
    });

    await expect(io.readStdin()).resolves.toBe('feat: streamed input');
    io.writeStdout('OK\n');
    io.writeStderr('failure\n');

    expect(setEncoding).toHaveBeenCalledWith('utf8');
    expect(stdoutWrite).toHaveBeenCalledWith('OK\n');
    expect(stderrWrite).toHaveBeenCalledWith('failure\n');
  });
});
