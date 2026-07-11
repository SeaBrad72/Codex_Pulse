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

function expectTerminalSafe(output: string): void {
  const unexpectedControls = [...output.replaceAll('\n', '')].filter((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  expect(unexpectedControls).toEqual([]);
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

  it.each([
    ['unknown option', [`--bad\u001b\u0007\n\rvalue`], 'error: unknown option'],
    ['positional argument', [`bad\u001b\u0007\n\rvalue`], 'error: unexpected argument'],
  ])('does not reflect control bytes from an %s', async (_name, args, diagnostic) => {
    const harness = createIo();

    await expect(runCli(args, harness.io)).resolves.toBe(2);
    expect(harness.stderr).toEqual([
      `${diagnostic}\nusage: validate-commit [--message <message>] [--verbose]\n`,
    ]);
    expectTerminalSafe(harness.stderr[0] ?? '');
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

  function createOpenStdin(chunks: string[]): {
    stdin: AsyncIterable<string> & { setEncoding(encoding: BufferEncoding): unknown };
    returnIterator: ReturnType<typeof vi.fn<() => Promise<IteratorResult<string>>>>;
    blocked: Promise<void>;
  } {
    let index = 0;
    let markBlocked: () => void = () => undefined;
    const blocked = new Promise<void>((resolve) => {
      markBlocked = resolve;
    });
    const returnIterator = vi.fn<() => Promise<IteratorResult<string>>>(async () => ({
      done: true,
      value: undefined,
    }));
    const iterator: AsyncIterator<string> = {
      next: async () => {
        if (index < chunks.length) {
          const value = chunks[index];
          index += 1;
          return { done: false, value };
        }
        markBlocked();
        return new Promise<IteratorResult<string>>(() => undefined);
      },
      return: returnIterator,
    };
    return {
      stdin: {
        setEncoding: vi.fn(() => undefined),
        [Symbol.asyncIterator]: () => iterator,
      },
      returnIterator,
      blocked,
    };
  }

  function readOpenStdin(chunks: string[]) {
    const harness = createOpenStdin(chunks);
    const io = createProcessIo({
      stdin: harness.stdin,
      stdout: { write: vi.fn() },
      stderr: { write: vi.fn() },
    });
    return { ...harness, result: io.readStdin() };
  }

  it('resolves at LF without waiting for an open producer', async () => {
    const harness = readOpenStdin(['feat: complete header\n']);

    await expect(
      Promise.race([harness.result, harness.blocked.then(() => 'blocked')]),
    ).resolves.toBe('feat: complete header');
    expect(harness.returnIterator).toHaveBeenCalledOnce();
  });

  it('handles CRLF split across chunks without waiting for EOF', async () => {
    const header = 'x'.repeat(72);
    const harness = readOpenStdin([`${header}\r`, '\n']);

    await expect(
      Promise.race([harness.result, harness.blocked.then(() => 'blocked')]),
    ).resolves.toBe(header);
    expect(harness.returnIterator).toHaveBeenCalledOnce();
  });

  it.each([
    ['one huge chunk', ['x'.repeat(10_000)]],
    ['multiple huge chunks', ['x'.repeat(40), 'y'.repeat(10_000)]],
  ])('retains only 73 header characters from %s', async (_name, chunks) => {
    const harness = readOpenStdin(chunks);

    await expect(
      Promise.race([harness.result, harness.blocked.then(() => 'blocked')]),
    ).resolves.toHaveLength(73);
    expect(harness.returnIterator).toHaveBeenCalledOnce();
  });

  it('preserves exactly 72 characters at EOF', async () => {
    const input = 'x'.repeat(72);
    const stdin = {
      setEncoding: vi.fn(),
      async *[Symbol.asyncIterator](): AsyncGenerator<string> {
        yield input;
      },
    };
    const io = createProcessIo({
      stdin,
      stdout: { write: vi.fn() },
      stderr: { write: vi.fn() },
    });

    await expect(io.readStdin()).resolves.toBe(input);
  });

  it('resolves at 73 characters without waiting for an open producer', async () => {
    const harness = readOpenStdin(['x'.repeat(72), 'y']);

    await expect(
      Promise.race([harness.result, harness.blocked.then(() => 'blocked')]),
    ).resolves.toBe(`${'x'.repeat(72)}y`);
    expect(harness.returnIterator).toHaveBeenCalledOnce();
  });
});
