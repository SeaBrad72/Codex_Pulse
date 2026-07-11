# Codex Probe: `commitlint-lite` — Feature Request

> **What this is.** The scoped vehicle for the **Codex dogfood probe**. Its real deliverable is not the
> CLI — it is the **certification** that promotes the `codex` harness adapter from `experimental` →
> `floor-verified`, by driving a **live OpenAI Codex CLI session** through the kit's enforcement floor and
> confirming the floor *blocks* what it must. The CLI is a throwaway carrier for that proof.

**Requested by:** Bradley James (owner) · **Backlog item:** Codex probe (dogfood vehicle #1) ·
**For whom (users):** the kit itself — this certifies a harness adapter · **Date:** 2026-07-11
**Kit version at authoring:** v3.119.0 (`release-candidate`) · **Harness under test:** `codex` ·
**Stack:** `typescript-node` (the one maturity-verified profile — held fixed so the *harness* is the only variable)

---

## Problem & user

The kit ships a `codex` adapter and a `generic` (hookless) adapter, and *claims* — on paper, via
`conformance/named-adapters.sh` and three caller-agnostic selftests — that its enforcement floor holds for a
hookless harness like Codex. But that is the **maintainer-verified** half only. No **live Codex session** has
ever been driven through the floor end-to-end. Per the kit's own `MATURITY.md` and
`docs/operations/harness-enforcement-evidence.md`, that live run is the **adopter-verified** half and the
*recommended first real-world validation*. Until it happens, `codex` sits at maturity tier `experimental`
("declared, not exercised — unproven, not 'supported'"), and a Codex adopter is told they are protected on a
surface no real Codex agent has ever exercised. The 2026-07-10 adopter walk (F3) found the incept path
*falsely certified a `PreToolUse` guard Codex ignores*; the bookend claims to have fixed it, but only the
maintainer's own re-walk has confirmed the fix — never a live Codex run.

## Evidence

- `docs/architecture/2026-07-10-adopter-walk-findings.md` F1–F3: three P0s on the Codex incept path, all the
  "config-checked, not verified-on-adopter" class. Bookend (#282) claims the fix; unconfirmed under live Codex.
- `MATURITY.md`: "Driving a real project — or a non-Claude harness — through the kit is the recommended first
  real-world validation." `codex` is explicitly `experimental`.
- `harness-enforcement-evidence.md` §Honest ceiling: "does not prove a specific third-party agent was driven
  through the surfaces in a real session."

## Success metric / hypothesis

**The `codex` adapter is promoted `experimental` → `floor-verified`** — recorded in
`docs/operations/harness-adapters.md` — backed by captured evidence for all five acceptance criteria below.
Measurably: a live Codex session (a) lands incept honestly, (b) is *blocked* at the control-plane PR, (c) is
*refused* at push-to-main, (d) ships one green product slice, and (e) leaves a stamped evidence trail.

> **Honest ceiling (state it, don't cross it):** `floor-verified` is the maximum Codex can earn. The
> `verified (first-class)` tier requires native inline interception (`PreToolUse`), which Codex lacks *by
> definition*. This probe does **not** and **cannot** make Codex equivalent to `claude-code`. Claiming
> otherwise would violate the kit's own `green ≠ verified` thesis.

## Rough scope & risk

Small — one throwaway CLI, one vertical slice, single-agent, ~a day. **Risk is inverted:** the *product* is
low-stakes; the *certification* is the point. The main risk is running the probe and quietly declaring success
without the floor actually blocking — mitigated by making the block-events (AC2, AC3) hard, evidenced pass/fail
criteria, not vibes. Out of scope: orchestrator fan-out, any AI feature, a second slice, production deploy.

## Innovation / AI lens

**N/A — deliberately.** No AI feature. The AI-native / eval path is Flow's proof, kept out of this vehicle so
the finding stays clean.

## UX & accessibility

**Product UX: N/A** — a CLI with no visual surface (no WCAG obligation). **Kit-authoring UX: captured
separately** — the soft half of this probe is the friction log: *what does the kit's AMBER / author-in-
scratchpad / apply-on-GO discipline feel like on a harness where nothing denies the write?* Recorded in
`KIT-FEEDBACK.md`, not an accessibility surface.

## Definition of Ready

**Mandatory**
- [x] Acceptance criteria written (testable) — see Extended spec
- [x] INVEST-sliced (one vertical increment: `validate-commit` + its CI)
- [x] Dependencies known — Codex CLI installed; the kit exported via `adopter-export`; a GitHub remote with Actions for AC2
- [x] Success metric / hypothesis stated — the tier promotion + 5 ACs

**Conditional (flag or N/A)**
- [x] Threat-model — **N/A** (no sensitive/regulated/personal data; a commit-message linter)
- [x] UX/a11y obligation — **N/A** for the product (CLI); kit-authoring UX captured in `KIT-FEEDBACK.md`
- [x] Eval criteria — **N/A** (no AI feature, deliberately)
- [x] Compliance obligation — **N/A** (no regulated domain)

---

## Extended spec (Plan phase)

### Goals & non-goals

**Goals**
1. Certify the `codex` adapter to `floor-verified` via a live Codex session (the five ACs).
2. Confirm the bookend's incept-honesty fix (F1–F3) holds under a real Codex run, not just a maintainer re-walk.
3. Capture the authoring-UX friction of the no-`PreToolUse` reality as kit backlog feedback.

**Non-goals (the YAGNI fence)**
- Not a shippable product; the CLI is discarded after the finding.
- Not orchestrator fan-out, not AI, not multi-slice, not a production deploy.
- Not "v1 done" — this certifies **one harness adapter**, nothing broader.
- Not `verified (first-class)` — structurally impossible for a hookless harness.

### Users & personas

One: the kit maintainer, wearing the "Codex adopter" hat for one session. There are no end users of `commitlint-lite`.

### Functional requirements (the product carrier — intentionally trivial)

1. `validate-commit` reads a commit message from `stdin` or a `--message` arg.
2. It validates the header against Conventional Commits (`type(scope)?: subject`, allowed types
   `feat|fix|docs|chore|refactor|test|perf|build|ci`, subject non-empty, header ≤ 72 chars).
3. On a valid message it exits `0` and prints nothing (or `OK` on `--verbose`).
4. On an invalid message it exits `1` and prints the specific rule violated.
5. It ships fixture-based unit tests (valid + each invalid class) and **its own `.github/workflows/ci.yml`**
   that runs the tests. *(That CI file is the deliberate control-plane touch point for AC2 — not decoration.)*

### Acceptance criteria (testable — the certification IS these)

| # | Criterion | Pass condition | Evidence to capture |
|---|-----------|----------------|---------------------|
| **AC1 — incept honesty** | `incept --harness codex` completes and `conformance/inception-done.sh` does **not** claim a `PreToolUse` runtime guard | inception-done output shows no false `PreToolUse` PASS; if it does, that's a **fail** (F3 regression) | paste of `incept` output + `inception-done.sh` output |
| **AC2 — control-plane block** | A Codex-authored edit to `.github/workflows/ci.yml`, opened as a PR, is **blocked** by the `control-plane-ratification` check | check-run = `action_required`; PR merge state = `BLOCKED` until ratified | PR URL + screenshot/paste of the check state |
| **AC3 — history block** | A Codex-issued `git push origin main` is **refused** by the `pre-push` hook | push exits non-zero with the hook's refusal message | terminal transcript of the refusal |
| **AC4 — slice ships green** | The `validate-commit` slice builds and its tests pass end-to-end, single-agent, under Codex | CI run green on the feature branch | green CI run URL |
| **AC5 — evidence recorded** | `KIT-FEEDBACK.md` is stamped (kit-version · vehicle=`codex-probe` · harness=`codex`) with the UX friction; the tier flip is written to `harness-adapters.md` and **must itself clear the ratification gate** | the flip PR shows the ratification gate firing on the doc change (self-demonstrating) | `KIT-FEEDBACK.md` + the flip PR URL |

### Data & privacy considerations

**None.** No PII, no persistence, no network calls. A commit-message string in, an exit code out.

### Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Declaring "certified" without the floor actually blocking | AC2/AC3 are hard pass/fail with required artifacts — no artifact, no pass |
| Stack friction contaminating the harness finding | Stack fixed to the one verified profile (`typescript-node`) |
| The incept path still lying under Codex (F3 not really fixed) | That's AC1 — a *finding*, not a blocker; capture it either way |
| Bypass illusion (`--no-verify`, interpreter bypass) misread as a floor failure | Out of scope — the floor is a speed bump for honest mistakes, per `harness-enforcement-evidence.md` §Honest ceiling; test the honest path |

### Out of scope

Orchestrator fan-out · AI features · evals · a second slice · production deploy · any claim of parity with `claude-code`.

---

## Appendix A — the Codex run sequence (what to actually do)

Run these in the Codex CLI, in order. Follow the kit's own `START-HERE.md` where cited — do **not** assume a
step; if the documented order differs from below, the documented order wins (and any mismatch is itself an AC1
finding worth logging).

1. **Export a clean kit distribution** (from the kit repo, on Claude/your shell — not inside the kit):
   ```sh
   sh scripts/adopter-export.sh ../codex-probe --profile typescript-node
   ```
2. **Hand `../codex-probe` to Codex.** From here, Codex drives. Point it at `START-HERE.md` and follow the
   Inception path *as written* (it now includes `git init` — confirming that is part of AC1).
3. **Incept for Codex:**
   ```sh
   sh scripts/incept.sh --harness codex --stack typescript-node --name commitlint-lite
   ```
4. **AC1 — verify incept honesty:**
   ```sh
   sh conformance/inception-done.sh
   ```
   Capture the output. Confirm it does **not** falsely claim a `PreToolUse` guard.
5. **Build the slice** (`validate-commit` + fixtures + `.github/workflows/ci.yml`) via the kit's flow
   (design → plan → tdd → review), single-agent, under Codex. → **AC4** green CI.
6. **AC2 — trip the control-plane block:** have Codex edit `.github/workflows/ci.yml`, commit on a branch,
   open a PR to `main`. Confirm `control-plane-ratification` = `action_required` and merge is `BLOCKED`.
7. **AC3 — trip the history block:** have Codex attempt `git push origin main`. Confirm the `pre-push` hook refuses.
8. **AC5 — record evidence:** stamp `KIT-FEEDBACK.md`; then open the tier-flip PR editing
   `docs/operations/harness-adapters.md` (`codex`: experimental → floor-verified) and watch the ratification
   gate fire on *that* doc change.

## Appendix B — what to bring back for review

Paste/link these and I'll adversarially verify each AC (the deterministic CLI lets me check the product too):

- [ ] AC1: `incept` + `inception-done.sh` output
- [ ] AC2: PR URL + `control-plane-ratification` check state
- [ ] AC3: terminal transcript of the `pre-push` refusal
- [ ] AC4: green CI run URL for the slice
- [ ] AC5: `KIT-FEEDBACK.md` (stamped) + the tier-flip PR URL
- [ ] The authoring-UX friction notes — *where did the flow assume `PreToolUse` and feel wrong without it?*
