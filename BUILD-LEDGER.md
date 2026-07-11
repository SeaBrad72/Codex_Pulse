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
| 5 — History protection proof | Complete | Evidence commit `8081b73`; non-vacuous exact push refused with exit 1; remote main unchanged; hook selftest and independent review APPROVE. |
| 6 — Evidence and tier flip | Complete | Final correctness/evidence and security reviews APPROVE with no findings after K11's Unicode-safe bound and K12's terminal-safe diagnostics. Fresh Node 22.13.1: 76/76 tests; coverage 81.6% statements, 81.13% branches, 87.5% functions, 81.39% lines; validator 100%; all required local gates PASS. Reports/matrix/logs synchronized. AC1 PASS; AC2 NOT EXERCISED / certification FAIL; AC3 PASS; AC4 FAIL; AC5 FAIL. Backlog remains Blocked; maturity remains `experimental`; no tier flip. |
