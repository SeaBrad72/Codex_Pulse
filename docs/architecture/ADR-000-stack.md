# ADR-000: TypeScript / Node.js for commitlint-lite

**Status:** Accepted  
**Date:** 2026-07-11  
**Deciders:** Bradley James (intent owner and lead)

## Context

The project needs a deliberately small, deterministic command-line carrier for a live Codex enforcement-floor probe. The stack must support strict typing, fast fixture-driven tests, process-level CLI integration tests, and GitHub Actions without adding a database, deployment surface, or unrelated stack risk.

## Decision

Use TypeScript in strict mode on Node.js 24 LTS, with the selected `profiles/typescript-node.md` profile. Use Vitest with v8 coverage, ESLint, and the TypeScript compiler for the local and CI quality gates.

## Fit rationale

The workload is a short-lived, I/O-light CLI with a pure string validator. TypeScript provides explicit result types and stable error-code modeling, while Node exposes stdin, argv, and child-process integration behavior directly. The shipped profile already maps install, lint, type-check, test, coverage, and build commands to GitHub Actions, keeping the harness—not stack setup—as the variable under test.

## Maturity acknowledged

The kit classifies the TypeScript/Node profile as verified. That maturity is intentionally selected to isolate Codex harness behavior. It does not imply that the Codex adapter is verified: Codex begins this probe at `experimental` and can earn at most `floor-verified` from AC1–AC5.

## Alternatives considered

1. **Python CLI** — concise parsing and testing, but its less-exercised kit path would introduce a second maturity variable.
2. **Rust CLI** — strong type and binary guarantees, but unnecessary compile/toolchain cost for a throwaway string validator and a less-exercised profile.

## Consequences

- Profile in effect: `profiles/typescript-node.md` (selected).
- Easier: deterministic unit tests, spawned CLI tests, strict result modeling, and CI parity through standard npm scripts.
- Harder: Node remains a runtime dependency and emitted JavaScript must be built before integration testing.
- Accepted trade-off: the CLI carrier optimizes probe clarity rather than distribution as a standalone binary.

## Follow-up

- [x] Profile selected and incepted.
- [ ] CI baseline verified on GitHub during the separately approved evidence task.
- [x] `.env.example` emitted by inception; the CLI itself requires no secrets or runtime configuration.
