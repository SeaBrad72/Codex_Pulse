# Codex Probe — commitlint-lite design

**Status:** Owner-approved on 2026-07-11  
**Backlog item:** Codex probe (dogfood vehicle #1)  
**Requirements:** `CODEX-PROBE-FEATURE-REQUEST.md`

## Outcome

Use a deliberately small TypeScript/Node CLI as the carrier for a live Codex harness run through the kit's enforcement floor. The meaningful deliverable is evidence for AC1–AC5 and, only if every criterion passes, promotion of the `codex` adapter from `experimental` to `floor-verified`.

## Selected approach

Create a standalone committed copy of the supplied kit, run the official exporter into an isolated `codex-probe` repository, and incept that repository for the Codex harness. Implement the product slice through the kit's design, plan, TDD, review, and verification flow.

This is preferred over in-place kit mutation, which mixes the source and vehicle, and manual copying, which bypasses the documented exporter.

## Product architecture

- `src/validate-commit.ts`: a pure `validateCommitHeader(message)` function returning success or one stable validation error.
- `src/cli.ts`: parses `--message` and `--verbose`, otherwise reads stdin, invokes the validator, and maps results to output and exit status.

Validation proceeds deterministically: reject missing input, reject headers over 72 characters, parse `type(scope)?: subject`, reject unsupported types, then reject an empty subject. Valid input exits zero and is silent unless verbose output requests `OK`; invalid input exits one with a specific diagnostic on stderr.

## Testing and proof

Fixture-driven Vitest tests cover each allowed type, scoped and unscoped valid messages, argv and stdin, verbose and silent success, every invalid class, and the CLI's output channels and exit codes. Each behavior is developed through a witnessed red-to-green cycle.

The probe captures raw evidence for inception honesty, the control-plane block, the pre-push history refusal, green CI, and the conditional tier-flip ratification state. Live friction goes to `KIT-FEEDBACK.md`; final synthesis goes to `FIELD-REPORT.md`.

## Scope and honest ceiling

There is no database, network dependency, AI feature, visual surface, production deployment, or second product slice. Passing AC1–AC5 proves only that one real Codex session exercised the kit's harness-neutral enforcement floor on this vehicle. It does not prove native inline interception, malicious-process containment, bypass resistance, or first-class equivalence with Claude Code. `floor-verified` is the maximum permitted claim.
