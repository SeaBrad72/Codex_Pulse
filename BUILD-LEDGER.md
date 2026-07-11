# Codex Probe build ledger

**Plan:** `docs/plans/2026-07-11-codex-probe-plan.md`  
**Backlog item:** Codex probe (dogfood vehicle #1)

| Task | State | Evidence / notes |
|------|-------|------------------|
| 0 — Restore exporter precondition | Complete | Commit `8cc0b1f`; export 436 files; re-review APPROVE after ambiguity fix; final patch `6651f1f6…8849240`. |
| 1 — Incept and capture AC1 | Complete | Inception commit `48418ea`; first inception-done exit 1 preserved in `docs/evidence/ac1-inception.txt`; standalone Git/branch/local-hook repair completed; reviewer fix removed the mistakenly installed parent hook under explicit owner approval after exact SHA-256 verification; final inception-done exit 0; narrow AC1 honesty PASS unchanged; repair evidence and K4/process-lapse log recorded in this documentation commit. |
| 2 — Pure validator via TDD | Complete | Commits `f59d063` + `6f4b887`; 26 tests, 100% validator coverage, stale starter cleanup; independent re-review APPROVE. |
| 3 — CLI adapter via TDD | Complete | Commits `ce05ddd` + `1f8837f`; 60/60 tests, all-source ≥80%, validator 100%, packaged-bin and EPIPE regressions; independent re-review APPROVE. |
| 4 — CI and GitHub evidence | Failed | Registration PR #1 custom ratification check succeeded, but live `ci` failed on 22 pre-existing Semgrep findings (K9); stopped before protection/patch. AC4 failed, so certification cannot pass. |
| 5 — History protection proof | In review | AC3 failed honestly: exact `git push origin main` exited 0 with `Everything up-to-date` because local and remote main were identical, so no ref update reached the hook; remote main remained `39c58724…e8`. Transcript in `docs/evidence/ac3-pre-push.txt`. |
| 6 — Evidence and tier flip | Not started | Conditional on AC1–AC5. |
