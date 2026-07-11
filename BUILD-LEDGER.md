# Codex Probe build ledger

**Plan:** `docs/plans/2026-07-11-codex-probe-plan.md`  
**Backlog item:** Codex probe (dogfood vehicle #1)

| Task | State | Evidence / notes |
|------|-------|------------------|
| 0 — Restore exporter precondition | Complete | Commit `8cc0b1f`; export 436 files; re-review APPROVE after ambiguity fix; final patch `6651f1f6…8849240`. |
| 1 — Incept and capture AC1 | Complete | Inception commit `48418ea`; first inception-done exit 1 preserved in `docs/evidence/ac1-inception.txt`; standalone Git/branch/local-hook repair completed; reviewer fix removed the mistakenly installed parent hook under explicit owner approval after exact SHA-256 verification; final inception-done exit 0; narrow AC1 honesty PASS unchanged; repair evidence and K4/process-lapse log recorded in this documentation commit. |
| 2 — Pure validator via TDD | Complete | Commits `f59d063` + `6f4b887`; 26 tests, 100% validator coverage, stale starter cleanup; independent re-review APPROVE. |
| 3 — CLI adapter via TDD | In review | Compiled argv/stdin/verbose/diagnostic/help/usage contracts implemented through witnessed TDD; 56/56 tests green; project coverage 96.72% statements, 94.28% branches, 100% functions, 96.66% lines with validator 100% in every dimension; fresh Node 22.13.1 verification complete; independent review pending. |
| 4 — CI and GitHub evidence | Not started | AMBER; separate GO required. |
| 5 — History protection proof | Not started | Blocked on GitHub remote. |
| 6 — Evidence and tier flip | Not started | Conditional on AC1–AC5. |
