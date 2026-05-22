# GGSA Teacher Pathway Portal

## Overview

This repository contains a full-stack Teacher Pathway portal for Good to Great Schools Australia professional learning operations.

The application supports learning plan intake, pathway readiness review, evidence capture, WordPress administration visibility, local Docker runtime parity and automated frontend validation.

The solution is implemented as a decoupled Next.js frontend and headless WordPress backend. The frontend keeps the existing design-system workspace intact, while WordPress owns submitted learning plans, LearnDash-style pathway data and editorial administration.

## Screenshot

### Frontend portal

![Frontend portal](docs/screenshots/frontend-smoke.png)

## Delivered Capabilities

### Frontend

- Next.js App Router application built with React 18 and TypeScript.
- Learning plan register for reviewing submitted teacher pathway records.
- Teacher learning plan intake for school, teacher, career stage, prerequisite, module, evidence and support data.
- Pathway readiness view for certification, RPL and coach follow-up decisions.
- Same-origin API route handlers over the WordPress REST API.
- Seeded fallback data when the WordPress API is unavailable.
- Vitest and Playwright-ready validation coverage.

### Backend

- WordPress runtime with the custom `GGSA Teacher Pathway Headless API` plugin.
- Custom `ggsa_learning_plan` post type for submitted learning plans.
- REST endpoints for learning plan creation, retrieval and evidence upload.
- MariaDB-backed persistence through WordPress.
- WordPress administration visibility for submitted learning plans and workflow status updates.
- Docker bootstrap for WordPress installation, plugin activation and permalink setup.

### Test Automation

- Unit coverage for shared readiness logic and reusable UI components.
- Playwright smoke coverage for the portal journey.
- TypeScript, linting and production build commands for the frontend workspace.

## Technology Summary

- Frontend: Next.js 15, React 18, TypeScript, Sass, Zustand.
- Backend: WordPress, PHP, custom REST routes and custom post types.
- Database: MariaDB.
- Runtime: Docker and Docker Compose.
- Testing: Vitest and Playwright.
- Package manager: pnpm 10.18.3 through Corepack.

## Runtime Requirements

- Docker Desktop, Docker and Docker Compose for the complete local stack.
- Node.js 20 or newer for local frontend commands. The Docker frontend image uses Node 22.
- pnpm 10.18.3, managed through Corepack and the `packageManager` fields.
- Playwright Chromium dependencies for local browser tests.

## Repository Structure

```txt
frontend/   Next.js portal app, shared services, UI packages and frontend tests
backend/    WordPress runtime, custom GGSA plugin and backend Docker image
docs/       Architecture and handover notes
```

## Information Architecture

The portal IA is intentionally small and operational:

| Route | Purpose | Primary users |
| --- | --- | --- |
| `/register` | Learning plan register and workflow overview | GGSA coaches, school leaders |
| `/pathway-readiness` | Certification, RPL and support readiness review | GGSA coaches, school leaders |
| `/learning-plan` | Teacher learning plan creation and evidence capture | Teachers, school leaders |
| `/about` | Architecture, pathway model and operating model handover | Delivery and support teams |

The browser consumes same-origin Next.js routes only:

```txt
GET  /api/teacher-pathway-submissions
POST /api/teacher-pathway-submissions
POST /api/teacher-pathway-submissions/evidence
```

Those route handlers call `@ggsa/services`, which owns the WordPress REST base URL and upstream endpoint details.

## Quick Start With Docker

Run from the repository root.

```bash
corepack enable
corepack prepare pnpm@10.18.3 --activate

# Build images and start WordPress, MariaDB, setup and frontend containers.
pnpm docker:build
pnpm docker:up
```

The stack starts both application surfaces:

- Frontend: `http://localhost:5173`
- WordPress backend: `http://localhost:8080`

Useful Docker commands:

```bash
pnpm docker:logs
pnpm docker:down
pnpm docker:reset
```

## Local Access

| Area | URL | Notes |
| --- | --- | --- |
| Frontend | `http://localhost:5173` | GGSA Teacher Pathway portal |
| WordPress backend | `http://localhost:8080` | WordPress runtime |
| WordPress admin | `http://localhost:8080/wp-admin` | Login with `admin` / `admin` after local setup |
| Next.js API | `http://localhost:5173/api/teacher-pathway-submissions` | Same-origin frontend API contract |
| WordPress API | `http://localhost:8080/wp-json/ggsa/v1/teacher-pathway-submissions` | Learning plan REST endpoint |
| Evidence API | `http://localhost:8080/wp-json/ggsa/v1/teacher-pathway-submissions/evidence` | Evidence upload endpoint |
| MariaDB | `localhost:3307` | Local database exposed from Docker |

Local WordPress administrator credentials:

```txt
Username: admin
Password: admin
```

Submitted learning plans can be reviewed in WordPress under `Teacher Learning Plans`.

## Frontend-Only Development

Use this path when iterating on the Next.js workspace without the WordPress stack.

```bash
corepack enable
corepack prepare pnpm@10.18.3 --activate
pnpm --dir frontend install
pnpm --dir frontend dev
```

The frontend falls back to seeded local data when the backend is unavailable.

Useful frontend checks:

```bash
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend exec playwright install chromium
pnpm --dir frontend test:e2e
```

## Full Local Verification

Run these commands from the repository root for a clean local verification.

```bash
# Reset containers, networks and the local database volume.
pnpm docker:reset

# Build local Docker images and start the complete stack.
pnpm docker:build
pnpm docker:up

# Confirm container status.
docker compose ps

# Check the frontend health endpoint.
curl -i http://localhost:5173/status

# Check the same-origin API route.
curl -i http://localhost:5173/api/teacher-pathway-submissions

# Check the WordPress API directly.
curl -i http://localhost:8080/wp-json/ggsa/v1/teacher-pathway-submissions

# Install frontend dependencies for local quality checks.
pnpm --dir frontend install
pnpm --dir frontend exec playwright install chromium

# Run frontend validation.
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

## Daily Development Commands

Run from the repository root.

```bash
# Start the local stack in the background.
pnpm docker:up

# Confirm container status.
docker compose ps

# View service logs.
pnpm docker:logs

# Flush WordPress rewrites after route or permalink changes.
docker compose exec wordpress wp rewrite flush --hard --allow-root

# Run frontend checks.
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
```

## Configuration

The Next.js server reads one upstream environment variable:

| Variable | Local default | Docker value | Description |
| --- | --- | --- | --- |
| `WORDPRESS_API_BASE_URL` | `http://localhost:8080/wp-json/ggsa/v1` | `http://wordpress/wp-json/ggsa/v1` | WordPress REST base URL used by `@ggsa/services`. |

Docker database settings are configured in `docker-compose.yml`:

| Variable | Value |
| --- | --- |
| `WORDPRESS_DB_HOST` | `mariadb:3306` |
| `WORDPRESS_DB_NAME` | `ggsa_teacher_pathway` |
| `WORDPRESS_DB_USER` | `ggsa_teacher_pathway` |
| `WORDPRESS_DB_PASSWORD` | `ggsa_teacher_pathway` |

## Handover Notes

- Keep upstream WordPress API details inside `frontend/packages/services`; app routes should stay thin and same-origin.
- Keep reusable visual primitives in `frontend/packages/ui-library`, `ui-assets`, `ui-tokens` and `utils`.
- Keep application-specific teacher pathway composition in `frontend/apps/portal` or `frontend/packages/services`.
- Treat WordPress as the submitted learning-plan system of record once the backend is running.
- Use seeded frontend data for local resilience only, not as production persistence.
- Add authentication, role-based permissions, file storage policy and environment-specific secrets management before public deployment.

## Documentation

- `docs/architecture-overview.md`: system structure, IA, boundaries, runtime and verification guidance.
