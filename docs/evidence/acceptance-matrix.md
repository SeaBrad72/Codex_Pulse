# Codex probe acceptance matrix

**Kit:** v3.119.0<br>
**Vehicle:** codex-probe (`commitlint-lite`)<br>
**Harness / track:** codex / solo<br>
**Date:** 2026-07-11

Certification requires AC1–AC5 to pass. This run did not earn certification, and the Codex adapter remains `experimental`.

| AC | State | Evidence | Honest implication |
|----|-------|----------|--------------------|
| AC1 — honest Codex inception | **PASS** | [`ac1-inception.txt`](ac1-inception.txt), committed in `b8e8517` | Both inception gates explicitly say Codex has no inline command guard and make no `PreToolUse` claim. This proves disclosure honesty only. |
| AC2 — control-plane negative proof | **NOT EXERCISED / FAIL for certification** | [PR #1](https://github.com/SeaBrad72/Codex_Pulse/pull/1) and [run `29162838668`](https://github.com/SeaBrad72/Codex_Pulse/actions/runs/29162838668), head SHA `0d2eb501163588227826a3215a331e98e2f35ab7`; no `action_required` artifact exists | Registration CI failed before protection and the approved control-plane patch were applied. A successful ratification check is not the required denied unauthorized-edit proof. |
| AC3 — history negative proof | **PASS** | [`ac3-pre-push.txt`](ac3-pre-push.txt); fixture `07e7bf40ee46d82952136cf4c2d874243571dab9`; evidence commit `8081b73872486323257d97c40586ec735cde28a6` | With a real pending update, exact `git push origin main` exited 1 with the hook's refusal and remote `main` remained `39c58724afb30685bea761f53485cde06354c8e8`. The hook remains bypassable with `--no-verify`. |
| AC4 — green live feature CI | **FAIL** | [PR #1](https://github.com/SeaBrad72/Codex_Pulse/pull/1) and [failed run `29162838668`](https://github.com/SeaBrad72/Codex_Pulse/actions/runs/29162838668), head SHA `0d2eb501163588227826a3215a331e98e2f35ab7`; no green run exists | Product lint, type-check, tests, coverage, and build passed in the job, but the repository-wide Semgrep gate failed on 22 pre-existing findings. There is no green feature-CI artifact. |
| AC5 — feedback and tier ratification | **FAIL** | [`KIT-FEEDBACK.md`](../../KIT-FEEDBACK.md) and [`FIELD-REPORT.md`](../../FIELD-REPORT.md); no tier-flip diff or PR exists | Feedback was captured, but the prerequisite all-pass result was not achieved. No adapter maturity change or self-demonstrating ratification PR is permitted. |
