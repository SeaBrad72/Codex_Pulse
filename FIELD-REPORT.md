# Field Report — Codex probe certification failure

## Stamp

| Field | Value |
|-------|-------|
| **Kit version** | 3.119.0 |
| **Vehicle** | codex-probe (`commitlint-lite`) |
| **Harness** | codex |
| **Track** | solo |
| **Period** | 2026-07-11 → 2026-07-11 |
| **Feedback log** | [`KIT-FEEDBACK.md`](KIT-FEEDBACK.md) |
| **Acceptance evidence** | [`docs/evidence/acceptance-matrix.md`](docs/evidence/acceptance-matrix.md) |
| **Public vehicle** | [`SeaBrad72/Codex_Pulse`](https://github.com/SeaBrad72/Codex_Pulse) |

## 1. Verdict

The kit did not earn Codex certification: AC1 and AC3 passed, AC2 was not exercised and therefore fails certification, and AC4 and AC5 failed. The strongest result was an honest floor disclosure plus a non-vacuous pre-push refusal; the largest gap was that an exported baseline could not produce green live CI because its retained kit surface triggered 22 pre-existing Semgrep findings. The Codex adapter remains `experimental`, with no tier flip.

## 2. Prioritized harvest

Three root causes explain most of the findings. Repository-boundary detection was too weak (K1, K2, K4); the exported distribution and its control-plane contracts drifted apart (K3, K7, K9); and proof setup did not initially guarantee a meaningful event (K10). Final security review also found an unbounded stdin boundary (K11) and terminal-control reflection (K12); both product defects were resolved without changing the certification result. K5 and K6 are narrower runtime/tooling integration mismatches, while K8 is a capability-discovery issue.

| Rank | K-id(s) | Finding | Severity | Proposed backlog item |
|------|---------|---------|----------|-----------------------|
| 1 | K9 | A clean exported baseline's whole-repository Semgrep gate reports 22 blocking findings, preventing the first green live CI run. | blocker | Remediate or explicitly baseline the shipped SAST findings, then repeat certification from a fresh export. |
| 2 | K11 | Stdin validation waited for EOF and retained unbounded input although only the first 73 header characters can affect the result. | high | Keep the direct-stream regressions and use the bounded, early-return reader as the profile scaffold pattern. |
| 3 | K1, K2, K4 | Export, preflight, and inception accept a kit nested in another worktree without proving that the current directory owns the Git root. | blocker / high | Require kit root = Git toplevel, verify tracked kit sentinels, and refuse inception when the destination does not own `.git`. |
| 4 | K3 | The exporter required a backlog declaration absent from the supplied v3.119.0 bundle and left a partial destination. | blocker | Align the bundle with the exporter contract and make failed export cleanup transactional. |
| 5 | K7 | A non-DB export retained DR artifacts and emitted a workflow that failed an aggregate selftest. | high | Make profile pruning and proportional-gate generation internally consistent; add a clean-export aggregate fixture. |
| 6 | K10 | The first history proof was vacuous because no `main` ref update existed for the hook to inspect. | high | Add a canonical non-vacuous negative-proof recipe that asserts the fixture parent, pending ref update, refusal, and unchanged remote SHA. |
| 7 | K5 | The original `node >=20` range admitted Node 20 minors rejected by locked dependencies. | medium | Derive the scaffold engine floor from the locked toolchain and check runtime compatibility during inception. |
| 8 | K6 | Spawned compiled-process coverage did not contribute to Vitest parent-process function coverage. | low | Document subprocess coverage limits and provide a directly injectable CLI I/O seam in the profile scaffold. |
| 9 | K8 | The recommended GitHub connector did not expose repository creation or branch-protection operations. | low | Publish connector capability boundaries and the authenticated `gh` fallback before remote-evidence tasks begin. |
| 10 | K12 | Usage failures reflected terminal control bytes from unknown or positional arguments. | low | Retain generic diagnostics and direct plus compiled tests that reject raw control-byte reflection. |

## 3. What the review / guardrail layer caught

- The inception gate exposed the missing product-local pre-push hook after inception mistakenly reused the parent worktree. Independent review then caught and drove owner-approved cleanup of the out-of-scope parent hook.
- Clone dry-runs prevented the Task 4 workflow patch from being applied when aggregate conformance was already red.
- Live CI failed closed on the Semgrep baseline rather than allowing a partial green result to count as AC4.
- The AC3 evidence review rejected the initial `Everything up-to-date` transcript as vacuous. A fixture directly atop remote `main` made the rerun meaningful, and the hook refused it.
- Final security review caught the stdin wait/memory boundary and terminal-control reflection. Witnessed TDD resolved both while leaving every acceptance outcome and the failed-certification verdict unchanged.

## 4. What never ran

- AC2's unauthorized control-plane edit was never exercised: there is no protected-branch `action_required` artifact.
- The approved CI patch was not applied, and branch protection was not configured.
- No green feature-CI run exists for AC4.
- AC5's tier-flip diff and self-demonstrating ratification PR were not created because AC1–AC5 did not all pass.
- No native Codex inline interception ran. The AMBER path depended on scratchpad, clone proof, and recorded owner GO; the universal history floor depended on the Git hook.
- The kit's unrelated database, DR-in-anger, deployment, operations, and agentic-product paths were outside this non-DB CLI vehicle and remain unproven here.

## 5. Wins to keep

- Inception disclosed the Codex ceiling precisely: no inline command guard and no `PreToolUse` claim.
- The running feedback log captured K1–K12, including the agent lapse, its owner-approved correction, and final security findings, rather than reconstructing a flattering narrative after the run.
- The hook proof retained both the failed vacuous attempt and the passing non-vacuous rerun, with exact local and remote SHAs.
- Task 4 stopped before protection or workflow mutation when registration CI was red; PR #1 remains open and unmerged for auditability.
- The CLI carrier itself remained deterministic and locally green while certification failure was reported independently of product correctness.
