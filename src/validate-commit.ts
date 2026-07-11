export type ValidationErrorCode = 'empty' | 'too-long' | 'format' | 'type' | 'subject';

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: ValidationErrorCode; message: string };

const ALLOWED_TYPES = new Set([
  'feat',
  'fix',
  'docs',
  'chore',
  'refactor',
  'test',
  'perf',
  'build',
  'ci',
]);

export function validateCommitHeader(message: string): ValidationResult {
  const [header = ''] = message.split(/\r?\n/, 1);

  if (header.trim().length === 0) {
    return { ok: false, code: 'empty', message: 'commit message is empty' };
  }

  if (header.length > 72) {
    return {
      ok: false,
      code: 'too-long',
      message: 'header must be 72 characters or fewer',
    };
  }

  const match = /^([a-z]+)(?:\(([^()]+)\))?: (.*)$/.exec(header);
  if (match === null) {
    return {
      ok: false,
      code: 'format',
      message: 'header must match type(scope)?: subject',
    };
  }

  const type = match[1];
  if (!ALLOWED_TYPES.has(type)) {
    return {
      ok: false,
      code: 'type',
      message: `type "${type}" is not allowed`,
    };
  }

  const subject = match[3];
  if (subject.trim().length === 0) {
    return {
      ok: false,
      code: 'subject',
      message: 'subject must not be empty',
    };
  }

  return { ok: true };
}
