# CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`.

## Jobs

- `frontend-quality`: install, format, lint, typecheck, unit tests, build.
- `backend-quality`: Composer install, PHP syntax, PHPCS, PHPStan, REST contracts.
- `playwright-smoke`: mocked Playwright accessibility/workflow checks.
- `real-backend-playwright`: local PHP/SQLite WordPress plus Playwright.
- `docker-build`: WordPress and frontend image build.

## Local Parity

Fast checks:

```bash
pnpm ci:quick
```

Real local backend:

```bash
pnpm ci:real
```

Docker build:

```bash
pnpm ci:docker
```

Expanded command list:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm php:quality
pnpm test:e2e
pnpm test:e2e:local:real
pnpm docker:build
```

## DigitalOcean Review Deployment

Current review links:

- Frontend: https://ggsa-teacher-pathway-frontend-zj7zd.ondigitalocean.app
- Backend REST base: shared privately with reviewers
- WordPress admin: shared privately with authorized reviewers only

Deployment shape:

- GitHub Actions validates `main`.
- DigitalOcean App Platform builds the frontend from `frontend/Dockerfile`.
- The WordPress backend is a DigitalOcean WordPress Droplet in `syd1`.
- The frontend talks to WordPress through same-origin Next.js API routes, with `WORDPRESS_API_BASE_URL` and `GGSA_TEACHER_PATHWAY_API_TOKEN` configured as App Platform environment variables.

Useful deployment checks:

```bash
doctl apps get <app-id>
doctl apps create-deployment <app-id> --force-rebuild
curl -s https://ggsa-teacher-pathway-frontend-zj7zd.ondigitalocean.app/status
curl -i https://<backend-host>/wp-json/ggsa/v1/teacher-pathway-submissions
```

Expected behavior:

- frontend `/status` returns `{"status":"UP"}`;
- unauthenticated backend submission requests are rejected;
- frontend API routes can read and write records using the server-side token;
- the token is never exposed to browser-side JavaScript.

## Future Production Gates

- Dependency, licence, secret and container scanning.
- Deployment smoke tests.
- Production authentication/authorization tests.
- Evidence storage and malware scanning tests.
