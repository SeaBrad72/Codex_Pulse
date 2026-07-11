# Conditional obligations (process mode: lean)

These gates are **enforced automatically when their trigger appears** — you do not opt in or out.
Your project starts on the floor; each below activates the moment you add its trigger.

| Control | Applies IF | Enforced by |
|---|---|---|
| Threat model / privacy review | you declare Confidential/Restricted data (CLAUDE.md §3) | conformance/privacy-ready.sh |
| Eval gate + AI System Card | you add an `evals/` dir or declare `AI feature: yes` | conformance/eval-ready.sh |
| Agent-ops trace posture | you declare `Agentic: yes` | conformance/agentops-ready.sh |
| Accessibility sign-off | you ship a user-facing UI | a11y gate (DEVELOPMENT-STANDARDS §14) |
| Deployable / resilience / DR | you add a Dockerfile or deploy workflow / durable data | deployable-ready, resilience-ready, dr-ready |
| Container supply-chain (image SBOM + provenance) | you add a Dockerfile | conformance/container-supply-chain.sh |

The floor (lint · type · test+coverage · build · secret-scan · deps · SBOM · branch-protection · builder≠reviewer) applies in EVERY mode and is never waived.

Ask *why* any of these matters: `sparkwright explain <control>` (or see docs/why-gates.md).
