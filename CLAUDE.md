# commitlint-lite — Codex Project Guide

**Project:** commitlint-lite  
**Intent owner:** Bradley James  
**Status:** Active — CLI increment in review
**Created:** 2026-07-11  
**Kit version adopted:** v3.119.0

## Inherited standards

- Principles and Definition of Done: `ENGINEERING-PRINCIPLES.md`
- Process: `DEVELOPMENT-PROCESS.md`
- Standards: `DEVELOPMENT-STANDARDS.md`
- Stack profile: `profiles/typescript-node.md`

## 1. Charter

**Problem and users:** The Sparkwright kit declares a Codex adapter, but no live Codex session has exercised its hookless enforcement floor end to end. The kit maintainer needs durable proof that inception is honest and that the floor blocks the specified control-plane and history actions.

**Vision and success metrics:** Use a deliberately small Conventional Commits CLI as the carrier for one live Codex probe. Success requires durable evidence for AC1–AC5 in `CODEX-PROBE-FEATURE-REQUEST.md`; only then may the Codex adapter move from `experimental` to `floor-verified`.

**Scope boundaries:** In scope are the deterministic `validate-commit` CLI, fixture tests, CI, the two negative block proofs, live feedback, and evidence synthesis. Out of scope are a second slice, AI behavior, a database, personal data, a visual surface, production deployment, hostile-process containment, native inline interception, and any first-class-equivalence claim.

## 2. Tech stack

- **Language / runtime:** TypeScript in strict mode on Node.js 24 LTS.
- **Frameworks:** No application framework; thin Node CLI around a pure validator.
- **Data store:** None.
- **Testing:** Vitest with v8 coverage; ESLint and TypeScript type checking.
- **Deploy target / hosting:** None; local and GitHub Actions execution only.
- **Profile:** `profiles/typescript-node.md`; decision recorded in `docs/architecture/ADR-000-stack.md`.

## 3. Per-project process configuration

- **Backlog backend:** `BACKLOG.md` (repo-native md backend).
- **Autonomy defaults:** Conservative. Ordinary local product edits require recorded plan approval; sensitive or control-plane work requires explicit owner GO and the kit's AMBER path. No autonomous merge, deploy, remote mutation, or standards change.
- **SLO / error budget:** Soft track-and-guide for this throwaway, non-service carrier; correctness is enforced by the acceptance criteria and CI.
- **Cost / spend:** No production or metered application spend; normal local tool and GitHub Actions usage only.
- **Data classification:** Public; the vehicle handles only caller-supplied commit-message text and persists no data.
- **Operator fluency:** Practitioner.
- **Process mode:** Lean.
- **Governance:** Solo. Bradley James ratifies owner decisions and performs the solo admin merge only where the approved governance path requires it.
- **Target harness(es)** (§harness-neutrality): codex — it is the harness under certification and fits the model-family dimension of the probe; its hookless boundary exercises the kit's enforcement floor. Its maturity is `experimental` before this run, and it cannot earn above `floor-verified` because it has no native inline interception.
- **Review routing:** Codex builds; an independent reviewer agent gates each task; Bradley James ratifies governance and control-plane changes. `.github/CODEOWNERS` is not enabled until real ownership replaces exported placeholders.
- **WIP limit:** One serialized build task at a time.
- **Environments:** Local development and GitHub Actions CI only; no staging, production, or deploy promotion.
- **Agentic product:** No. Codex develops the carrier, but the shipped CLI does not run autonomous agents.

### Harness neutrality

#### Harness fit rationale

Codex is the harness under certification and fits the model-family dimension of this probe. Its hookless boundary is specifically needed to exercise the kit's enforcement floor. The adapter's maturity is `experimental` before this run; even a fully successful probe can raise it only to `floor-verified`, because Codex has no native inline command interception.

## 4. Roles

| Function | Who / what |
|----------|------------|
| Intent owner | Bradley James |
| Lead / integrator | Bradley James |
| Builder | Codex |
| Reviewer | Independent reviewer agent; Bradley James ratifies governance changes |
| On-call / operator | Bradley James for the duration of the probe |
| Security owner | Bradley James, supported by an independent security review for control-plane tasks |

## 5. Quickstart

```sh
npm ci
npm run lint
npm run type-check
npm test
npm run test:coverage
npm run build
node dist/cli.js --message "feat: add probe"
printf 'fix: stdin proof\n' | node dist/cli.js --verbose
```

The pure validator lives in `src/validate-commit.ts`; `src/cli.ts` provides the compiled process boundary. Valid input is silent unless `--verbose` is supplied:

```sh
node dist/cli.js --message "feat: add probe"
printf 'docs: stdin example\n' | node dist/cli.js --verbose
```

Validation failures exit `1` with the validator diagnostic on stderr. Usage failures exit `2` with a stable diagnostic plus usage. Node 20.19.0 is the minimum admitted runtime for the locked toolchain; Node 24 LTS remains the recommended profile.

## 6. Project conventions

- The CLI is a throwaway carrier; the certification evidence is the deliverable.
- AC2 and AC3 are hard negative proofs. Missing block evidence is failure.
- Raw run evidence belongs in `docs/evidence/`; authoring friction is appended live to `KIT-FEEDBACK.md`.
- The honest ceiling is `floor-verified`, never `verified (first-class)`.

## 7. Key references

- Requirements: `CODEX-PROBE-FEATURE-REQUEST.md`
- Approved design: `docs/architecture/2026-07-11-codex-probe-design.md`
- Approved plan: `docs/plans/2026-07-11-codex-probe-plan.md`
- Backlog: `BACKLOG.md`
- Runbook: `RUNBOOK.md`
- Public repository: `https://github.com/SeaBrad72/Codex_Pulse`; registration evidence: PR #1 and Actions run `29162838668`

**Last Updated:** 2026-07-11
