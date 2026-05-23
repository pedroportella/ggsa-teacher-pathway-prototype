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

## Future Production Gates

- Dependency, licence, secret and container scanning.
- Deployment smoke tests.
- Production authentication/authorization tests.
- Evidence storage and malware scanning tests.
