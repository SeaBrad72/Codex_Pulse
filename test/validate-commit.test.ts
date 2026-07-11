import { describe, expect, it } from 'vitest';

import { validateCommitHeader } from '../src/validate-commit.js';

describe('validateCommitHeader', () => {
  it.each([
    { name: 'an empty message', message: '' },
    { name: 'a whitespace-only first line', message: '   \nbody' },
  ])('rejects $name', ({ message }) => {
    expect(validateCommitHeader(message)).toEqual({
      ok: false,
      code: 'empty',
      message: 'commit message is empty',
    });
  });

  it.each([
    {
      name: 'a 73-character header',
      message: `feat: ${'a'.repeat(67)}`,
      expected: {
        ok: false,
        code: 'too-long',
        message: 'header must be 72 characters or fewer',
      },
    },
    {
      name: 'an exactly 72-character header',
      message: `feat: ${'a'.repeat(66)}`,
      expected: { ok: true },
    },
  ])('validates the length boundary for $name', ({ message, expected }) => {
    expect(validateCommitHeader(message)).toEqual(expected);
  });

  it.each([
    { name: 'a missing delimiter', message: 'feat add probe' },
    { name: 'a delimiter without its required space', message: 'feat:add probe' },
    { name: 'an empty scope', message: 'feat(): add probe' },
    { name: 'a nested scope', message: 'feat(api(v2)): add probe' },
    { name: 'an unclosed scope', message: 'feat(api: add probe' },
    { name: 'an uppercase type token', message: 'Feat: add probe' },
  ])('rejects $name as malformed', ({ message }) => {
    expect(validateCommitHeader(message)).toEqual({
      ok: false,
      code: 'format',
      message: 'header must match type(scope)?: subject',
    });
  });

  it('returns the actual unsupported lowercase type', () => {
    expect(validateCommitHeader('style: align output')).toEqual({
      ok: false,
      code: 'type',
      message: 'type "style" is not allowed',
    });
  });

  it.each([
    { name: 'an empty subject', message: 'feat: ' },
    { name: 'a whitespace-only subject', message: 'feat:   ' },
  ])('rejects $name', ({ message }) => {
    expect(validateCommitHeader(message)).toEqual({
      ok: false,
      code: 'subject',
      message: 'subject must not be empty',
    });
  });

  it.each([
    { name: 'an unscoped header', message: 'feat: add probe' },
    { name: 'a scoped header', message: 'fix(parser): accept scopes' },
  ])('accepts $name', ({ message }) => {
    expect(validateCommitHeader(message)).toEqual({ ok: true });
  });

  it.each(['feat', 'fix', 'docs', 'chore', 'refactor', 'test', 'perf', 'build', 'ci'])(
    'accepts the allowed type %s',
    (type) => {
      expect(validateCommitHeader(`${type}: add probe`)).toEqual({ ok: true });
    },
  );

  it.each([
    { name: 'LF', separator: '\n' },
    { name: 'CRLF', separator: '\r\n' },
  ])('validates only the first header line in a $name message', ({ separator }) => {
    const header = `feat: ${'a'.repeat(66)}`;
    const body = 'b'.repeat(100);

    expect(validateCommitHeader(`${header}${separator}${body}`)).toEqual({ ok: true });
  });
});
