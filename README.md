# GGSA Teacher Pathway Prototype

This prototype adapts the decoupled portal pattern into a Good to Great Schools Australia Teacher Pathway product.

It keeps the existing frontend design-system workspace intact and uses a headless WordPress implementation with a LearnDash-style domain model.

## What It Demonstrates

- Headless WordPress REST API for teacher learning plans.
- LearnDash-style pathway data: prerequisites, core modules, electives, evidence portfolio and certification readiness.
- Next.js frontend using the existing design-system packages.
- Next.js API route handlers proxying requests to the WordPress REST API.
- Separate Docker build artifacts for the WordPress backend and Next.js frontend.
- Seeded frontend data when the WordPress API is unavailable.

## Local URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| WordPress | `http://localhost:8080` |
| WordPress admin | `http://localhost:8080/wp-admin` |
| Next.js API | `http://localhost:5173/api/teacher-pathway-submissions` |
| WordPress API | `http://localhost:8080/wp-json/ggsa/v1/teacher-pathway-submissions` |

## Commands

Use Node.js 20 or newer for local frontend commands. The Docker frontend image uses Node 22.

```sh
pnpm install
pnpm dev
pnpm build
pnpm test
docker compose build wordpress frontend
docker compose up -d mariadb wordpress wordpress-setup frontend
```

The backend image installs the `GGSA Teacher Pathway Headless API` plugin into WordPress, and the `wordpress-setup` service installs WordPress, activates the plugin and flushes permalinks.

The frontend image builds the `@ggsa/portal` Next.js app and starts it with `next start` on port `5173`. Server-side route handlers call `@ggsa/services`, which owns `WORDPRESS_API_BASE_URL` and the WordPress REST endpoint details so the browser only sees same-origin Next.js routes.

Local admin credentials:

| Username | Password |
| --- | --- |
| `admin` | `admin` |
