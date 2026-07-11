# commitlint-lite — RUNBOOK

**Project:** commitlint-lite  
**Last Updated:** 2026-07-11

## 1. Local setup

- Prerequisites: Node.js 24 LTS and npm.
- Install exact dependencies: `npm ci`.
- Environment: no secrets or application environment variables are required. The inception-generated `.env.example` contains only a non-secret starter placeholder and is not required by the CLI.
- Run the current local starter before the CLI task: `npm run dev`.
- After Task 3, build and use the CLI: `npm run build && node dist/cli.js --message "feat: add probe"`.
- Stdin form after Task 3: `printf '%s\n' 'feat: add probe' | node dist/cli.js`.

## 2. Test and build

- Lint: `npm run lint`.
- Type-check: `npm run type-check`.
- Tests: `npm test`.
- Coverage: `npm run test:coverage` (at least 80% overall; critical validator branches and lines at 100%).
- Build: `npm run build`.
- Local gate sequence: `npm run lint`, `npm run type-check`, `npm test`, `npm run test:coverage`, then `npm run build`.
- Test data: fixed synthetic commit-message fixtures only; never production data.
- Data handling: Public, process-local strings; no persistence or retention.

## 3. Environment variables

None required. Do not add or commit secrets. If local tooling later needs configuration, document placeholders in `.env.example` and keep real values in ignored local environment files.

## 4. Deploy

N/A. This is a throwaway local/CI carrier with no production service, hosting target, preview environment, deployment credentials, network egress requirement, or promotion path. GitHub Actions is a verification environment, not a deploy target. This no-deploy topology is documented and fully exercised by local commands plus the required CI evidence; no platform maturity claim applies.

#### Deploy-target fit rationale

N/A — the workload is a short-lived, stateless CLI used locally and in CI. It has no traffic, availability, regional, statefulness, or operational-hosting requirement that would justify a deployment platform.

#### Maturity acknowledged

N/A — no platform or deployment topology is selected, so there is no deploy-target maturity tier to claim.

## 5. Rollback

- Fastest and only path: revert the offending Git commit.
- Command: `git revert <commit-sha>`.
- No redeploy follows because there is no deployed runtime.

## 6. Disaster recovery

N/A. The CLI is stateless and stores no data, so RPO, RTO, backups, restore drills, and a BIA do not apply. Source and evidence recovery use Git history.

## 7. Test accounts and credentials

None. GitHub authentication is introduced only during the separately approved remote evidence task and must remain outside the repository.

## 8. Monitoring and alerting

N/A. There is no live service, health endpoint, on-call alert, autonomous production agent, or operational telemetry surface. CI status and captured terminal transcripts are the probe's evidence surfaces.

## 9. Known issues / technical debt

- The inception-generated starter service is temporary and will be replaced by the planned CLI through Task 2 and Task 3 TDD.
- Codex has no native inline command interception; the enforcement claim is limited to the hook-plus-CI floor.

**Resume check:** A cold-resuming engineer should read `CODEX-PROBE-FEATURE-REQUEST.md`, `docs/architecture/2026-07-11-codex-probe-design.md`, `docs/plans/2026-07-11-codex-probe-plan.md`, `BUILD-LEDGER.md`, and this runbook.
