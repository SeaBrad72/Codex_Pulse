# Codex Probe — build plan

**Goal:** Exercise a live Codex session through the kit's enforcement floor using `commitlint-lite`, and promote the adapter only if AC1–AC5 all have durable evidence.

**Architecture:** A pure TypeScript commit-header validator is wrapped by a thin Node CLI that reads `--message` or stdin and maps a structured result to output and exit status. The adopter project is produced through the kit's official exporter, incepted for `codex`, and verified locally and in GitHub Actions; the CI and later maturity-tier edits follow the AMBER control-plane path.

**Tech stack:** Node.js 24 LTS, TypeScript strict mode, Vitest with v8 coverage, ESLint, GitHub Actions, Sparkwright v3.119.0.

**Build model:** AMBER. Tasks 0, 4, and 6 touch the kit or project control plane. Their changes are authored as idempotent `scratchpad/apply.py` programs, clone-dry-run before application, and applied only on a recorded owner GO.

## Global constraints copied from the approved requirements

- The CLI is a throwaway carrier; the certification is the deliverable.
- The `codex` adapter may earn at most `floor-verified`; it cannot earn `verified (first-class)` because it has no native `PreToolUse` interception.
- Stack is fixed to `typescript-node` so the harness remains the variable under test.
- Single-agent product slice; no orchestrator fan-out, AI feature, second slice, database, or production deploy.
- AC2 and AC3 are hard negative proofs. Missing block evidence is failure, not an advisory.
- Kit authoring friction is recorded live in `KIT-FEEDBACK.md`; end-of-run synthesis is written to `FIELD-REPORT.md`.
- The backlog trace is “Codex probe (dogfood vehicle #1)” → `CODEX-PROBE-FEATURE-REQUEST.md` → approved design → this plan.

## File map

### Source-kit bootstrap

- `CLAUDE.md` — restore the single self-hosting backlog declaration required by the exporter contract; immediately carved from the adopter copy.
- `KIT-FEEDBACK.md` — live K1–K3 findings and later outcomes.
- `scratchpad/apply.py` — idempotent Task 0 AMBER repair; not silently applied.
- `docs/plans/2026-07-11-codex-probe-plan.md` — this cold-resumable execution plan.

### Exported `codex-probe` project

- `CLAUDE.md` — incepted project charter, Codex fit rationale, and governance configuration.
- `ENGINEERING-PRINCIPLES.md` — renamed kit principles.
- `BACKLOG.md` — live work item and PR/evidence state.
- `RUNBOOK.md` — local CLI setup, verification, release ceiling, and no-deploy rationale.
- `docs/architecture/ADR-000-stack.md` — TypeScript/Node fit and verified-maturity acknowledgement.
- `docs/architecture/2026-07-11-codex-probe-design.md` — approved product/certification design.
- `docs/plans/2026-07-11-codex-probe-plan.md` — exported execution plan.
- `docs/evidence/ac1-inception.txt` — captured inception and `inception-done` output.
- `docs/evidence/ac3-pre-push.txt` — captured refused push-to-main transcript.
- `src/validate-commit.ts` — pure parser/validator and stable error codes/messages.
- `src/cli.ts` — argv/stdin adapter and exit/output mapping.
- `test/validate-commit.test.ts` — fixture-driven pure behavior tests.
- `test/cli.test.ts` — spawned CLI integration tests for argv, stdin, output channels, and exit codes.
- `package.json`, `package-lock.json` — exact CLI scripts and dependencies.
- `tsconfig.json`, `tsconfig.build.json`, `eslint.config.js`, `vitest.config.ts` — strict build/lint/test configuration.
- `.github/workflows/ci.yml` — existing profile gates plus a compiled-CLI smoke step; AMBER/control-plane.
- `README.md` — carrier usage and certification scope.
- `KIT-FEEDBACK.md` — stamped live observations, wins, and lapses.
- `FIELD-REPORT.md` — final synthesis after AC1–AC5 resolve.
- `docs/operations/harness-adapters.md` — tier flip only after AC1–AC5 pass; separate AMBER task/PR.
- `scratchpad/task-briefs/*.md` and `BUILD-LEDGER.md` — durable build handoffs and status.

## Task 0 — Restore the exporter precondition (AMBER, serialized)

**Deliverable:** The official exporter completes from committed `HEAD` without weakening its fail-closed carve.

1. RED: run `sh scripts/adopter-export.sh ../codex-probe --profile typescript-node`; retain the witnessed zero-anchor failure and the 578-file partial destination as `../codex-probe.failed-export-k3`.
2. Author `scratchpad/apply.py` to insert exactly this idempotent source-only declaration before `## Roster authority` in `CLAUDE.md`:

   ```markdown
   ## Kit self-hosting configuration

   - **Backlog backend**: BACKLOG.md (repo-native)
   ```

   The program must refuse multiple declarations, no-op when the exact declaration already exists, and never edit the adopter destination.
3. Clone the source repository into a temporary tagless directory, copy `scratchpad/apply.py` into it, run the patch, commit, and execute `sh scripts/adopter-export.sh <temp>/out --profile typescript-node`.
4. Verify the exported `CLAUDE.md` has zero backlog declarations, the source clone has exactly one, and `sh conformance/adopter-export-wired.sh` passes.
5. On recorded GO only: run the patch in the source kit, commit `fix: restore adopter export precondition`, preserve the partial export by renaming it, and rerun the official export to `../codex-probe`.

**Honest ceiling:** This repairs recursive exportability of the supplied bundle; it does not retroactively prove that the supplied artifact was an upstream self-hosting checkout.

## Task 1 — Incept and capture AC1 (serialized after Task 0)

**Deliverable:** A standalone, incepted Codex adopter repository plus raw AC1 evidence.

1. Run inception non-interactively with explicit decisions:

   ```sh
   sh scripts/incept.sh --name commitlint-lite --intent-owner "Bradley James" \
     --stack typescript-node --team solo --backlog md --ci github \
     --harness codex --operator-fluency practitioner --mode lean --no-db --noninteractive
   ```

2. Capture combined stdout/stderr without hiding its exit code, then run `sh conformance/inception-done.sh` and append its combined output to `docs/evidence/ac1-inception.txt`.
3. Assert the evidence contains no claim that Codex has a `PreToolUse` runtime guard. A false claim marks AC1 failed and is logged immediately; it is not edited away.
4. Complete the incepted placeholders with:
   - harness fit: Codex is the harness under certification and exercises the hookless floor;
   - maturity: experimental before this probe;
   - stack fit: deterministic small CLI, verified profile chosen to isolate harness behavior;
   - deployment: N/A, throwaway local/CI carrier with no production deploy;
   - roles: Bradley James intent owner/ratifier; Codex builder; independent reviewer agent; solo owner admin-merge only where required.
5. Add the Codex probe row to `BACKLOG.md` as `In Progress`, linked to this plan.
6. Verify `git rev-parse --show-toplevel` equals the exported directory, the installed pre-push hook exists, and the tree has an initial inception commit.

**Honest ceiling:** AC1 proves the generated configuration and conformance output are honest on this run, not that every Codex command is intercepted.

## Task 2 — Pure validator via TDD (ordinary, serialized)

**Deliverable:** Tested `validateCommitHeader` behavior for the full grammar.

1. Create a fresh task brief at `scratchpad/task-briefs/task-2-validator.md`; set `BUILD-LEDGER.md` to `Task 2 — in progress`.
2. Remove the irrelevant greeting/service starter through a focused product diff and set the public result type:

   ```ts
   type ValidationResult =
     | { ok: true }
     | { ok: false; code: 'empty' | 'too-long' | 'format' | 'type' | 'subject'; message: string };
   export function validateCommitHeader(message: string): ValidationResult;
   ```

3. RED: add one fixture test for empty input; run `npm test -- --run test/validate-commit.test.ts` and confirm failure because the function is absent.
4. GREEN: add the smallest empty-input implementation; rerun and confirm pass.
5. Repeat witnessed RED→GREEN cycles for length >72, malformed header, unsupported type, empty subject, scoped valid input, unscoped valid input, and every allowed type.
6. REFACTOR only while green: centralize the allowed types and stable diagnostics.
7. Run `npm run lint`, `npm run type-check`, `npm test`, and `npm run test:coverage`; require zero warnings/failures and ≥80% overall with 100% branch/line coverage on `validate-commit.ts`.
8. Commit `feat: validate conventional commit headers`; independent reviewer gates the task before Task 3.

**Honest ceiling:** Unit tests prove deterministic header validation only; they do not prove CLI I/O or Git integration.

## Task 3 — CLI adapter via TDD (ordinary, serialized)

**Deliverable:** The executable satisfies stdin/argv/output/exit requirements.

1. Create `scratchpad/task-briefs/task-3-cli.md`; update the ledger.
2. RED: spawn the CLI with `--message "feat: add probe"`; assert exit `0` and empty stdout/stderr; observe failure before implementation.
3. GREEN: implement argument parsing and the silent success path minimally.
4. Repeat RED→GREEN for stdin input, `--verbose` → `OK\n`, each invalid result → exit `1` and its diagnostic on stderr, conflicting/missing `--message` values, and `--help`.
5. Build with `npm run build`; run the compiled `dist/cli.js` in integration tests so TypeScript-source-only behavior cannot satisfy the test.
6. Run lint, type-check, all tests, coverage, and build; commit `feat: add validate-commit CLI`; independent review before Task 4.

**Honest ceiling:** Spawned integration tests prove local Node process behavior, not CI execution or enforcement-floor behavior.

## Task 4 — CI and GitHub evidence (AMBER, serialized)

**Deliverable:** A control-plane PR whose tests are green and whose unratified state is blocked.

1. Create `scratchpad/task-briefs/task-4-ci.md`; update the ledger.
2. RED: demonstrate that the current workflow contains no compiled CLI smoke invocation.
3. Author an idempotent project `scratchpad/apply.py` adding a `gate-build` smoke command that runs a valid compiled header with `--verbose` and requires exactly `OK`.
4. Clone-dry-run the patch; YAML-parse `.github/workflows/ci.yml`; run `sh conformance/verify.sh --require`, `sh conformance/doc-budget.sh`, lint, types, tests, coverage, and build.
5. On a recorded GO, apply and commit the workflow change on a feature branch, push, and open the PR. Add its number to the backlog row before the backlog-presence gate evaluates.
6. Capture the GitHub URL, `control-plane-ratification=action_required`, and merge state `BLOCKED` as AC2 evidence. Do not ratify until the block state is captured.
7. Capture the green Actions run URL as AC4 evidence. A local pass is insufficient.

**Honest ceiling:** The PR proves GitHub's configured check blocks this repository; it does not prove hostile-process containment or other hosts.

## Task 5 — History protection negative proof (serialized)

**Deliverable:** AC3 refusal transcript from the real Codex-driven repository.

1. Create `scratchpad/task-briefs/task-5-history.md`; update the ledger.
2. From a non-main feature state, run the exact ordinary command `git push origin main` without `--no-verify`.
3. Capture command, stdout/stderr, and non-zero exit in `docs/evidence/ac3-pre-push.txt`.
4. Assert the transcript contains the hook's push-to-main refusal. If the push succeeds, mark AC3 failed immediately and stop tier promotion.

**Honest ceiling:** This proves the honest pre-push path refuses the action; `--no-verify` and other bypasses remain outside the stated floor.

## Task 6 — Evidence synthesis and conditional tier flip (AMBER, serialized)

**Deliverable:** A reviewable evidence package and, only if all criteria pass, a separate self-demonstrating tier-flip PR.

1. Complete `KIT-FEEDBACK.md` live observations, wins, and agent lapses; do not reconstruct missing events.
2. Create `FIELD-REPORT.md` from the template, retaining the v3.119.0/codex-probe/codex/solo stamp and ranking K1–K* findings.
3. Build an AC matrix linking every acceptance criterion to its transcript, URL, or file. Any missing artifact keeps the verdict failed/incomplete.
4. Run final whole-branch Reviewer and Security-Reviewer passes; resolve all Critical/Important findings and rerun verification.
5. If and only if AC1–AC5 pass, author an idempotent AMBER patch changing only the Codex maturity card in `docs/operations/harness-adapters.md` from `experimental` to `floor-verified`, with links to the captured evidence and the honest ceiling.
6. On recorded GO, open the separate tier-flip PR and capture its `control-plane-ratification=action_required` state before human ratification.
7. The solo human performs the one admin merge only after the promotion-readiness SHA receives GO; record and check the approved SHA through `scripts/promotion-verify.sh`.
8. Mark the backlog row `Done` only after evidence and merge state agree; otherwise leave it blocked with the failed AC named.

**Honest ceiling:** The tier change certifies one live floor exercise on one vehicle. It makes no first-class/native claim.

## Serialization and review map

All tasks serialize because each depends on artifacts or evidence produced by the previous task. There is no safe fan-out: Tasks 2–4 share package/build files, and Tasks 4–6 share PR/evidence state. A fresh executor receives each task brief; an independent reviewer gates each completed diff; Tasks 0, 4, and 6 also receive a security/control-plane review. The final branch receives a whole-branch review.

## Self-review against the requirements

- Functional requirements 1–4 map to Tasks 2–3.
- Functional requirement 5 maps to Task 4.
- AC1 maps to Task 1; AC2/AC4 to Task 4; AC3 to Task 5; AC5 to Task 6.
- Privacy, AI/eval, a11y, compliance, database, and production deployment are explicitly N/A for this vehicle.
- The plan contains no placeholder implementation steps; URLs and PR numbers remain runtime evidence, not design placeholders.
- The plan never promotes the adapter unless every hard artifact exists.
