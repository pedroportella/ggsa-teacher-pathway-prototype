# CI/CD

## Overview

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` for repeatable frontend, browser and WordPress plugin validation.

## GitHub Actions workflow

The workflow runs on pushes to `main`, pull requests to `main` and manual dispatch.

## Delivered Capability

- Frontend dependency installation with frozen lockfile enforcement.
- Frontend linting, unit testing, typechecking and production build validation.
- Playwright browser smoke testing.
- Build and Playwright report artifact upload.
- WordPress plugin PHP syntax validation.

## Frontend Verification

Runs in the `frontend` workspace with Node.js 20.19.x from the repository `.node-version` file and Corepack-managed `pnpm@10.18.3`.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test:unit
pnpm typecheck
pnpm build
```

The job uploads the portal build from `frontend/apps/portal/.next`.

## Browser Verification

Runs after the frontend verification job on `ubuntu-22.04`.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

Playwright starts the portal with `pnpm --filter @ggsa/portal exec next dev -H 127.0.0.1 -p 5173` before running the smoke tests.

The job uploads `frontend/apps/portal/playwright-report` when available.

## Backend Validation

Runs with PHP 8.3 and validates the custom WordPress plugin syntax.

```bash
php -l backend/wp-content/plugins/ggsa-teacher-pathway/ggsa-teacher-pathway.php
```

This confirms the current WordPress backend scaffold can be parsed without requiring a database-backed WordPress install in CI.

## Local Parity Checks

Run these from the repository root before handing over a change.

```bash
volta install node@20.19.5 pnpm@10.18.3
export PATH="$HOME/.volta/bin:$PATH"
pnpm --dir frontend install
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend exec playwright install chromium
pnpm --dir frontend test:e2e
docker compose run --rm --entrypoint php wordpress -l wp-content/plugins/ggsa-teacher-pathway/ggsa-teacher-pathway.php
```

For an end-to-end local stack check:

```bash
pnpm docker:build
pnpm docker:up -- --refresh-register
curl -i http://localhost:5173/status
curl -i http://localhost:5173/api/teacher-pathway-submissions
curl -i -H 'X-GGSA-Portal-Token: local-teacher-pathway-portal-token' http://localhost:8080/wp-json/ggsa/v1/teacher-pathway-submissions
```

The `pnpm docker:up` shortcut starts MariaDB, WordPress, WordPress setup and the frontend. Add `-- --refresh-register` or use `pnpm docker:up:seed` when a test run needs the WordPress register replaced with known seed learning plans.

```bash
pnpm test:e2e:real
```

The real Playwright run verifies the seeded register, submits a random learning plan, reloads the portal, and confirms the new record is still served from WordPress.

If Docker Compose reports that it cannot connect to `unix:///Users/.../.docker/run/docker.sock`, start Docker Desktop and wait until the engine is running, then retry the command.

## Production Gates To Add

- WordPress coding standards and PHP static analysis.
- Plugin activation, route registration and permission checks in a disposable WordPress runtime.
- API contract tests between the Next.js portal and WordPress REST routes.
- Evidence upload policy, file storage and malware scanning validation.
- Accessibility checks for public, teacher and coach journeys.
- Dependency, container image, secret and licence scanning.
- Deployment smoke tests for the portal, same-origin API routes and WordPress REST endpoints.
