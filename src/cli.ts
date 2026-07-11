#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';

import { validateCommitHeader } from './validate-commit.js';

const USAGE = 'usage: validate-commit [--message <message>] [--verbose]\n';

export interface CliIo {
  readStdin(): Promise<string>;
  writeStdout(output: string): void;
  writeStderr(output: string): void;
}

interface ProcessBindings {
  stdin: AsyncIterable<string> & { setEncoding(encoding: BufferEncoding): unknown };
  stdout: { write(output: string): unknown };
  stderr: { write(output: string): unknown };
}

export function createProcessIo(bindings: ProcessBindings): CliIo {
  return {
    readStdin: async () => {
      let input = '';
      bindings.stdin.setEncoding('utf8');
      for await (const chunk of bindings.stdin) {
        input += chunk;
      }
      return input;
    },
    writeStdout: (output) => {
      bindings.stdout.write(output);
    },
    writeStderr: (output) => {
      bindings.stderr.write(output);
    },
  };
}

export async function runCli(args: string[], io: CliIo): Promise<number> {
  let message: string | undefined;
  let verbose = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') {
      io.writeStdout(USAGE);
      return 0;
    }
    if (argument === '--verbose') {
      verbose = true;
      continue;
    }
    if (argument === '--message') {
      if (message !== undefined) {
        return usageFailure('error: --message may only be specified once', io);
      }
      const value = args[index + 1];
      if (value === undefined || value.startsWith('--')) {
        return usageFailure('error: --message requires a value', io);
      }
      message = value;
      index += 1;
      continue;
    }
    if (argument?.startsWith('-')) {
      return usageFailure(`error: unknown option: ${argument}`, io);
    }
    return usageFailure(`error: unexpected argument: ${argument}`, io);
  }

  message ??= await io.readStdin();
  const result = validateCommitHeader(message);
  if (!result.ok) {
    io.writeStderr(`${result.message}\n`);
    return 1;
  }

  if (verbose) {
    io.writeStdout('OK\n');
  }
  return 0;
}

function usageFailure(diagnostic: string, io: CliIo): number {
  io.writeStderr(`${diagnostic}\n${USAGE}`);
  return 2;
}

const isMain =
  process.argv[1] !== undefined &&
  realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
if (isMain) {
  let outputPipeClosed = false;
  const handleOutputError = (error: Error): void => {
    if ((error as NodeJS.ErrnoException).code === 'EPIPE') {
      outputPipeClosed = true;
      process.exitCode = 0;
      return;
    }
    throw error;
  };
  process.stdout.on('error', handleOutputError);
  process.stderr.on('error', handleOutputError);

  const exitCode = await runCli(process.argv.slice(2), createProcessIo(process));
  if (!outputPipeClosed) {
    process.exitCode = exitCode;
  }
}
