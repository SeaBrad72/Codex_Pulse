# Kit Feedback — running friction log

> Kept **DURING** the build, not reconstructed after. Append one row the moment you hit friction — while the
> cause is legible. Raw capture; end-of-run synthesis goes in a field report. Relay's entire KW backlog exists
> only because this log was written live.

## Stamp

| Field | Value |
|-------|-------|
| **Kit version** | 3.119.0 |
| **Vehicle** | codex-probe (`commitlint-lite`) |
| **Harness** | codex |
| **Track** | solo |
| **Started** | 2026-07-11 |

## Findings (append live — one row per friction point)

K-style ids (`K1`, `K2`, …). Severity: blocker / high / medium / low.

| Id | What I expected | What happened | Severity | Where (file / step) | Notes |
|----|-----------------|---------------|----------|---------------------|-------|
| K1 | `scripts/adopter-export.sh ../codex-probe --profile typescript-node` would export this supplied kit copy into a clean vehicle. | The supplied kit is an untracked nested directory inside the unrelated `/Users/bradleyjames/Development` Git worktree. `adopter-export.sh` operates on committed `HEAD`, so running it here would archive the parent repository rather than this kit. | blocker | Appendix A step 1 / `scripts/adopter-export.sh` | The export script checks for a committed HEAD but does not verify that its computed kit root is the Git toplevel or that `VERSION` is tracked. Export deliberately not run to avoid producing a misleading vehicle. |
| K2 | `sh scripts/preflight.sh` would verify that this copy is ready for the documented adoption path. | Preflight passed while inheriting the unrelated parent GitHub remote and reported that repository as the adopter environment; it did not detect that the kit root and Git toplevel differ or that the kit files are untracked. | high | Before anything / `scripts/preflight.sh` | This makes the preflight green even though the next documented export step cannot safely produce the intended distribution. |
| K3 | After the standalone baseline made `HEAD` valid, `scripts/adopter-export.sh ../codex-probe --profile typescript-node` would produce the clean adopter vehicle. | Export failed closed because its mandatory `Backlog backend` carve found zero matching declarations in the supplied `CLAUDE.md`; it left a 578-file partial destination that cannot be reused. | blocker | Appendix A step 1 / `scripts/adopter-export.sh` | The script's own comment says the kit always ships exactly one declaration, but v3.119.0 as supplied ships none. This indicates bundle/version drift between `CLAUDE.md` and the exporter contract. Partial output preserved at `../codex-probe` as evidence; it has not been incepted. |
| K4 | Inception in the plain exported directory would initialize a standalone repository and install `.git/hooks/pre-push`, as documented. | Because the export directory is nested inside an unrelated parent Git worktree, `git rev-parse --is-inside-work-tree` returned true. Inception reused `/Users/bradleyjames/Development`, installed the hook at `../../.git/hooks/pre-push`, and the first local gate failed because this project had no `.git/hooks/pre-push`. | high | Task 1 / `scripts/incept.sh` repo detection | The script checks only whether it is anywhere inside a worktree, not whether the current directory is the repository root. Its success summary then claimed the local `.git/hooks/pre-push` guard even though the printed install path proved otherwise. Repair required standalone `git init`, branch and local-hook setup, plus manual removal of the out-of-scope parent hook after exact hash verification; the owner explicitly approved that cleanup. Raw output and the final passing gate are preserved in `docs/evidence/ac1-inception.txt`. |
| K5 | The incepted package's `node >=20` engine declaration would admit a runtime supported by its locked development dependencies. | On the default Node 20.10.0 runtime, `npm ci` completed with `EBADENGINE` warnings because `eslint-visitor-keys`, Vite, and Rolldown require at least Node 20.19.0; the declared project stack is Node 24 LTS, but that runtime is not installed in this environment. | medium | Task 2 / generated `package.json` and dependency install | The available Node 22.13.1 runtime satisfies the locked dependency engines and was selected for TDD and verification. The scaffold engine range should not advertise unsupported Node 20 minors; the inception/runtime prerequisite could also check the declared stack version before build. |

> Prefer a rough row now over a polished one later — an unwritten finding is a lost finding.

## The no-`PreToolUse` watch (the probe's core question — log these deliberately)

Where did the kit's flow *assume* a write would be intercepted before it landed, and feel wrong when nothing
denied it? (AMBER / author-in-scratchpad / apply-on-GO discipline on a harness with no keystroke guard.)

- `[obs 1 — step, what the flow expected, what actually happened when the write just… went through]`
- `[obs 2]`

## Wins (capture these too)

- The preflight's universal prerequisite checks and workflow validation ran cleanly; the only surfaced advisory was missing GitHub authentication.
- AC1's first `inception-done.sh` output was honest about Codex: it explicitly reported no inline command guard and made no `PreToolUse` claim.
- `[e.g. the pre-push hook refused push-to-main exactly as promised — AC3]`

## Agent lapses (process drift you had to correct)

- Inception was run before confirming that the exported adopter owned its Git root. That attached the run to the unrelated parent repository and installed an out-of-scope parent pre-push hook. Correcting the lapse required owner-approved manual hook removal after verifying the parent and product hooks had the expected identical SHA-256.
