# Portal Overview

The GGSA Teacher Pathway portal uses a decoupled production-oriented architecture:

- Next.js App Router frontend with the existing design-system packages.
- Next.js route handlers acting as a small backend-for-frontend over WordPress, while delegating upstream API details to `packages/services`.
- Headless WordPress backend exposed through custom REST routes.
- Adapter-ready content boundaries for LearnDash prerequisites, modules, progress and evidence.
- MariaDB persistence through WordPress.
- Docker for local parity.
- `backend/Dockerfile` builds the WordPress runtime with the custom pathway plugin installed.
- `frontend/Dockerfile` installs the PNPM workspace and runs the portal artifact.
- `wordpress-setup` installs WordPress, activates the custom plugin and prepares REST routing for local review.

## Portal Information Map

The information architecture is deliberately focused on the operational journey rather than broad marketing content.

| Surface | Route | Role in the pathway | Users |
| --- | --- | --- | --- |
| Learning plan register | `/register` | Shows submitted learning plans, workflow status, support level and review actions. | GGSA coaches, school leaders |
| Pathway readiness | `/pathway-readiness` | Summarises prerequisite, module, evidence, certification and RPL readiness. | GGSA coaches, school leaders |
| Teacher learning plan | `/learning-plan` | Captures school, teacher, career stage, learning intent, evidence and support needs. | Teachers, school leaders |
| About this Portal | `/about` | Explains what the portal does, the pathway model, content model and operating model for handover. | Delivery, support and governance teams |

This keeps the first navigation layer aligned to the real service workflow:

```text
Register -> Readiness review -> Learning plan intake -> About this Portal
```

The route model should remain compact unless a new surface has a distinct user job, permission model or operational owner.

The browser-facing frontend consumes same-origin Next.js API routes:

```text
GET  /api/teacher-pathway-submissions
POST /api/teacher-pathway-submissions
POST /api/teacher-pathway-submissions/evidence
```

Those route handlers proxy to WordPress:

```text
GET  /wp-json/ggsa/v1/teacher-pathway-submissions
POST /wp-json/ggsa/v1/teacher-pathway-submissions
POST /wp-json/ggsa/v1/teacher-pathway-submissions/evidence
```

WordPress owns editorial and administrative visibility through the `ggsa_learning_plan` custom post type.

## Implementation Patterns

These patterns are intentionally aligned with the RBDM implementation style and should guide future changes.

### App Boundary

The app should stay as an orchestration shell. Files under `frontend/apps/portal/src/app` own routing, layouts, providers, page composition and Next.js request/response adaptation.

The app should not know how to reach WordPress. Do not put `WORDPRESS_API_BASE_URL`, `wp-json` paths or raw upstream API construction in app routes, pages or components.

### Service Boundary

`frontend/packages/services` owns API visibility. This package contains:

- public browser-facing service functions, such as `listSubmissions`, `createSubmission` and `uploadEvidence`;
- server-side gateway functions, such as `requestTeacherPathwaySubmissions`, `submitTeacherPathwayRecord` and `submitTeacherPathwayEvidence`;
- environment resolution for upstream systems, currently `WORDPRESS_API_BASE_URL` and the server-side portal API token;
- domain types, seed data and workflow/readiness business logic.

If the frontend needs new data, add or update a named function in `packages/services` first. The app should import that function instead of building URLs or calling the upstream API directly.

### WordPress Integration Adapters

The custom WordPress plugin mirrors the same boundary style for upstream platform concepts:

- `GGSA_Teacher_Pathway_Membership_User_Gateway` resolves the current teacher profile and membership role.
- `GGSA_Teacher_Pathway_WooCommerce_Entitlement_Gateway` resolves product access, subscription or school entitlement state.
- `GGSA_Teacher_Pathway_LearnDash_Gateway` resolves assigned courses/modules, progress and certificates.

These classes live under `backend/wp-content/plugins/ggsa-teacher-pathway/includes/Integrations`. They should be the only plugin code that knows about LearnDash, WooCommerce or membership-platform APIs. REST controllers may consume their normalized arrays, but should not call production plugin APIs directly.

### Route Handlers

Next.js route handlers are allowed as the same-origin browser contract:

```text
Browser -> /api/... -> @ggsa/services -> WordPress REST API
```

Their job is deliberately small:

- read the incoming `NextRequest`;
- call a named service or gateway function;
- translate the returned `Response` into `NextResponse`.

They should not contain upstream endpoint strings, WordPress base URLs, DTO mapping, validation policy or business workflow decisions.

### Client Components

Interactive route files use explicit client boundaries. Route-level client components should gather state from `PortalContext`, compose feature containers and call service functions through the provider layer.

Keep reusable display and form UI in component packages or feature containers. Avoid embedding API policy in presentational components.

### Domain And Workflow

Teacher Pathway records model an adapter-ready learning journey:

- prerequisites;
- core modules;
- evidence portfolio;
- RPL evidence readiness;
- workflow status;
- risk level.

WordPress is the system of record for submitted learning plans. The frontend may keep seed data for local resilience, but once WordPress is running, submissions and status review happen through the WordPress custom post type and REST API.

### Design System

Keep the existing design-system workspace intact. `frontend/packages/ui-library`, `ui-assets`, `ui-tokens` and `utils` should remain framework/API agnostic.

Application-specific composition belongs in `apps/portal` or `packages/services`; shared visual primitives belong in the UI packages only when they are genuinely reusable.

### Docker Runtime

The portal must continue to run as separate installable artifacts:

- `wordpress`: WordPress runtime with the custom GGSA Teacher Pathway plugin.
- `wordpress-setup`: local bootstrap for WordPress install, plugin activation and permalink flushing.
- `frontend`: Next.js production artifact built from the PNPM workspace.
- `mariadb`: WordPress persistence.

Use the repository shortcut to run the full local stack:

```sh
pnpm docker:up
```

Docker Desktop must be running before this command can reach the local Docker API socket.

Use the seed option when the WordPress register should be reset to known local data before manual checks or real-backend Playwright runs:

```sh
pnpm docker:up -- --refresh-register
# or
pnpm docker:up:seed
```

The frontend container reaches WordPress through server-side service code. Browser code should only call same-origin Next.js routes.

### Environment

Use `.env.local` for local frontend overrides when needed. Do not commit secrets or machine-specific values.

The default local WordPress API base is:

```text
http://localhost:8080/wp-json/ggsa/v1
```

Docker overrides this for container networking:

```text
http://wordpress/wp-json/ggsa/v1
```

Both URL values are resolved inside `packages/services`, not inside the app.

The local WordPress plugin also requires a portal API token for REST access outside an authenticated WordPress admin session:

```text
GGSA_TEACHER_PATHWAY_API_TOKEN=local-teacher-pathway-portal-token
```

Docker wires the same local token into the frontend and WordPress containers. Production environments should replace this value with an environment-specific secret and layer in user-level authentication and role-based authorization.

### Verification

For changes that affect the service boundary, API routes or Docker runtime, run the narrowest useful set of checks:

```sh
pnpm --filter @ggsa/services typecheck
pnpm --filter @ggsa/portal lint
pnpm --filter @ggsa/portal build
pnpm test:unit
docker compose build frontend
docker compose up -d frontend
```

Smoke-test the running artifact:

```sh
curl -s -w '\nHTTP %{http_code}\n' http://127.0.0.1:5173/status
curl -s -w '\nHTTP %{http_code}\n' http://127.0.0.1:5173/api/teacher-pathway-submissions
pnpm test:e2e:real
```

Continuous integration mirrors the same frontend quality gates in `.github/workflows/ci.yml` and adds Playwright smoke coverage plus PHP syntax validation for the WordPress plugin. See `docs/ci-cd.md` for the full workflow contract and local parity commands.
