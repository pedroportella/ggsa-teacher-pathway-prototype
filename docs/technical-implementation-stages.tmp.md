# Technical Implementation Stages

Temporary working plan for closing the remaining technical gaps between the prototype, the proposed Teacher Pathway domain and the senior full-stack WordPress position description.

This file is intentionally staged so we can implement one contained slice at a time without turning the project into one giant risky change.

## Current Baseline

Already completed:

- Reframed the prototype as adapter-ready rather than "LearnDash-style owns data".
- Added frontend service integration boundaries for LearnDash, WooCommerce and Membership concepts.
- Secured WordPress REST routes with admin capability or a shared server-side portal token.
- Updated UI copy so learning plans are enrolment-generated rather than manually invented.
- Renamed "Certification ready" to "RPL evidence ready".
- Added `docs/integration-alignment.md`.
- Added a no-Docker local WordPress runtime for fast FE+BE Playwright checks:
  - local WordPress in `backend/.wordpress`;
  - SQLite-backed local database;
  - custom GGSA plugin symlinked into the local runtime;
  - seeded pathway register;
  - `pnpm test:e2e:local:real` for real-backend Playwright.
- Refreshed Docker from scratch and verified:
  - lint;
  - typecheck;
  - build;
  - unit tests;
  - Playwright smoke tests;
  - real-backend Playwright tests;
  - PHP syntax lint.

## Stage 1: WordPress Plugin Structure - Done

Status: completed with local FE/BE checks.

Completed:

- Split the WordPress plugin bootstrap from implementation classes.
- Added `includes/Plugin.php`.
- Added `includes/PostTypes/LearningPlanPostType.php`.
- Added `includes/Rest/TeacherPathwayController.php`.
- Added `includes/Security/Permissions.php`.
- Added `includes/Support/MetaRepository.php`.
- Kept `ggsa_seed_learning_plan_register()` available for the existing seed script.

Validated locally:

- `php -l` on every plugin PHP file.
- `pnpm lint`.
- `pnpm typecheck`.
- `pnpm test`.

### Goal

Move the custom plugin from one large PHP file into a production-shaped structure that better demonstrates senior WordPress plugin architecture.

### Implementation

Create:

```text
backend/wp-content/plugins/ggsa-teacher-pathway/
  ggsa-teacher-pathway.php
  includes/
    Plugin.php
    PostTypes/LearningPlanPostType.php
    Rest/TeacherPathwayController.php
    Security/Permissions.php
    Support/MetaRepository.php
```

Responsibilities:

- `ggsa-teacher-pathway.php`: plugin bootstrap only.
- `Plugin.php`: registers hooks and composes collaborators.
- `LearningPlanPostType.php`: owns CPT registration and admin columns/meta boxes.
- `TeacherPathwayController.php`: owns REST route registration and callbacks.
- `Permissions.php`: owns admin capability and portal-token checks.
- `MetaRepository.php`: owns post meta read/write helpers.

### Acceptance Criteria

- Existing REST routes still work.
- Existing WordPress admin view still works.
- No behavioral change except cleaner structure.
- PHP syntax lint passes.
- Real-backend Playwright test passes.

### Validation

```bash
docker compose run --rm --entrypoint php wordpress -l wp-content/plugins/ggsa-teacher-pathway/ggsa-teacher-pathway.php
pnpm test:e2e:real
```

## Stage 2: Composer And PHP Quality Tooling - Done

Status: completed with local FE/BE checks.

Completed:

- Added plugin-local `composer.json`.
- Added plugin-local `composer.lock`.
- Added `phpcs.xml.dist` with focused WordPress security, database and PHP compatibility checks.
- Added `phpstan.neon` with WordPress stubs and PHPStan extension.
- Added root scripts:
  - `pnpm php:install`;
  - `pnpm php:lint`;
  - `pnpm php:cs`;
  - `pnpm php:stan`;
  - `pnpm php:quality`.
- Updated CI documentation with the Composer backend quality commands.

Validated locally:

- `composer --working-dir=backend/wp-content/plugins/ggsa-teacher-pathway install`.
- `composer --working-dir=backend/wp-content/plugins/ggsa-teacher-pathway run quality`.
- `pnpm lint`.
- `pnpm typecheck`.
- `pnpm test`.

### Goal

Add the PHP tooling expected by the position description.

### Implementation

Add:

```text
backend/wp-content/plugins/ggsa-teacher-pathway/composer.json
backend/wp-content/plugins/ggsa-teacher-pathway/phpcs.xml.dist
backend/wp-content/plugins/ggsa-teacher-pathway/phpstan.neon
```

Include tooling for:

- PHPCS;
- WordPress Coding Standards;
- PHPStan;
- PHPUnit or WP test scaffolding, if practical in the local Docker environment.

Add root scripts if useful:

```json
{
  "php:lint": "...",
  "php:cs": "...",
  "php:stan": "...",
  "php:test": "..."
}
```

### Acceptance Criteria

- PHP tooling can run locally through Docker or Composer.
- CI docs explain equivalent commands.
- Tooling is strict enough to be meaningful but not noisy enough to block progress on unrelated WordPress globals.

### Validation

```bash
composer install
composer run lint
composer run phpcs
composer run phpstan
```

Exact command shape may change depending on whether Composer runs on host or in Docker.

## Stage 3: WordPress REST Contract Tests - Done

Status: completed with local WordPress contract checks and local FE+BE Playwright.

Completed:

- Added a PHP REST contract runner at `backend/wp-content/plugins/ggsa-teacher-pathway/tests/rest-contract.php`.
- Added Composer `test` script for the plugin.
- Added root `pnpm php:test` script.
- Included REST contract tests in `pnpm php:quality`.
- Covered:
  - unauthenticated request rejection;
  - portal-token request acceptance;
  - admin-capability request acceptance;
  - malformed create payload rejection;
  - valid create payload post/meta persistence;
  - readiness `controlChecks` persistence;
  - register list response fields.

Validated locally:

- `pnpm php:test`.
- `pnpm php:quality`.
- `pnpm test:e2e:local:real`.

### Goal

Test real WordPress route behavior, not just PHP syntax.

### Implementation

Add tests for:

- unauthenticated request rejected;
- portal-token request accepted;
- admin-capability request accepted;
- malformed create payload rejected;
- valid create payload creates post and meta;
- readiness update persists `controlChecks`;
- direct register list returns expected fields.

Potential test locations:

```text
backend/wp-content/plugins/ggsa-teacher-pathway/tests/
```

or a Docker-backed script under:

```text
scripts/
```

### Acceptance Criteria

- Tests run against a disposable/local WordPress runtime.
- Permission behavior is covered.
- Route payload contract is covered.
- Failures are readable.

### Validation

```bash
composer run test
pnpm test:e2e:real
```

## Stage 4: PHP-Side Integration Adapters - Done

Status: completed with local WordPress contract checks and local FE+BE Playwright.

Completed:

- Added `includes/Integrations/LearnDashGateway.php`.
- Added `includes/Integrations/WooCommerceEntitlementGateway.php`.
- Added `includes/Integrations/MembershipUserGateway.php`.
- Wired the gateways into the plugin bootstrap and REST controller.
- Added `integrationContext` enrichment to created learning plan payloads.
- Added local deterministic fallback data for LearnDash modules, WooCommerce entitlements and membership teacher profiles.
- Added production extension checks for common LearnDash, WooCommerce and membership-platform APIs.
- Added REST contract coverage for adapter integration context.
- Updated architecture and integration alignment docs.

Validated locally:

- `pnpm php:quality`.

### Goal

Mirror the frontend adapter boundaries in the WordPress plugin so LearnDash, WooCommerce and Membership data have concrete homes.

### Implementation

Create:

```text
includes/Integrations/LearnDashGateway.php
includes/Integrations/WooCommerceEntitlementGateway.php
includes/Integrations/MembershipUserGateway.php
```

Expected behavior:

- Detect whether LearnDash/WooCommerce APIs are available.
- Return local prototype data when unavailable.
- Use real naming from production systems:
  - courses;
  - lessons/topics;
  - certificates;
  - user progress;
  - products;
  - subscriptions/entitlements;
  - membership role.

### Acceptance Criteria

- The plugin no longer hard-codes all pathway assumptions inside REST handlers.
- Local behavior remains deterministic without LearnDash/WooCommerce installed.
- The adapters expose obvious extension points for production integration.

### Validation

```bash
docker compose run --rm --entrypoint php wordpress -l wp-content/plugins/ggsa-teacher-pathway/ggsa-teacher-pathway.php
pnpm test:e2e:real
```

## Style Hardening: Frontend And WordPress Standards - Done

Status: completed before Stage 4 so the integration adapter work lands on a consistent review surface.

Completed:

- Added root `.editorconfig`.
- Added frontend Prettier configuration and ignore file.
- Added root `pnpm format` and `pnpm format:check` scripts.
- Added frontend `format` and `format:check` scripts.
- Added Prettier to the frontend workspace.
- Ran Prettier across the frontend workspace.
- Expanded backend PHPCS to include WordPress-Core style checks, tests and modern PHP-targeted exclusions.
- Ran PHPCBF across the WordPress plugin.
- Documented the style contract in README and CI docs.

Validated locally:

- `pnpm format:check`.
- `pnpm lint`.
- `pnpm typecheck`.
- `pnpm php:quality`.

## Stage 5: Generated Learning Plan Service - Done

Status: completed with backend generator coverage, frontend generator coverage and local FE+BE Playwright.

Completed:

- Added `includes/Domain/TeacherLearningPlanGenerator.php`.
- Moved PHP learning-plan enrichment into a domain generator that combines:
  - membership teacher profile;
  - WooCommerce entitlement;
  - LearnDash assigned modules;
  - certificate/evidence summary;
  - RPL readiness control checks.
- Wired WordPress REST creation and seed records through the generator.
- Added frontend `generateTeacherLearningPlan()` service.
- Seeded the learning-plan screen from generated local adapter data instead of only `blankSubmission`.
- Kept manual form edits as prototype overrides after the generated seed loads.
- Added frontend unit coverage for the generated learning plan service.
- Extended REST contract coverage for generated enrolment context.

Validated locally:

- `pnpm php:quality`.
- `pnpm --dir frontend --filter @ggsa/services test`.
- `pnpm format:check`.
- `pnpm lint`.
- `pnpm typecheck`.

### Goal

Make the domain technically match the UI claim that Teacher Learning Plans are generated from enrolment.

### Implementation

Add a service that combines:

- membership teacher profile;
- WooCommerce or school entitlement;
- LearnDash assigned modules;
- career-stage pathway;
- evidence/certificate state.

Possible names:

```text
includes/Domain/TeacherLearningPlanGenerator.php
frontend/packages/services/src/generateLearningPlan.ts
```

The generated plan should include:

- teacher;
- school;
- career stage;
- prerequisite modules;
- core modules;
- elective modules;
- evidence/certificate summary;
- RPL evidence readiness inputs.

### Acceptance Criteria

- The learning-plan screen can be seeded from generated data rather than only `blankSubmission`.
- Manual form editing is clearly a prototype override/fallback.
- Tests cover the generator logic.

### Validation

```bash
pnpm --dir frontend test:unit
pnpm typecheck
pnpm test:e2e
```

## Stage 6: Evidence Upload Policy

### Goal

Make evidence handling credible for teacher/classroom artefacts.

### Implementation

Add:

- file type allowlist;
- file size limit;
- required evidence owner/reference;
- upload error responses;
- private media/storage note;
- malware scanning placeholder;
- retention/privacy notes in docs.

Suggested policy:

- allow PDF, PNG, JPG, DOCX initially;
- reject executable/archive types;
- configurable max size;
- attach evidence metadata to a learning plan record.

### Acceptance Criteria

- Invalid file types are rejected.
- Oversized files are rejected.
- Successful uploads return metadata.
- Uploads are associated with a learning plan or reference.
- Docs explain what remains before production.

### Validation

```bash
pnpm test:e2e:real
composer run test
```

## Stage 7: Accessibility And UX Quality Gates

### Goal

Cover accessibility, SEO and frontend quality expectations from the position description.

### Implementation

Add:

- Playwright accessibility smoke tests using `axe-core` or equivalent;
- keyboard navigation checks for register, learning plan and readiness pages;
- basic metadata assertions for public routes;
- optional Lighthouse/performance budget notes.

### Acceptance Criteria

- Main routes have no critical accessibility violations.
- Key forms can be reached and operated by keyboard.
- Page metadata is present and coherent.

### Validation

```bash
pnpm --dir frontend test:e2e
```

## Stage 8: CI Expansion

### Goal

Bring CI closer to the real production bar.

### Implementation

Extend CI to include:

- PHP syntax lint;
- PHPCS;
- PHPStan;
- PHP/WordPress route tests;
- Docker build;
- real-backend Playwright test;
- optional dependency/security scan placeholders.

### Acceptance Criteria

- CI mirrors the most important local handover checks.
- Long-running Docker/real-backend checks are clearly separated if they are too expensive for every push.
- Docs describe how to reproduce CI locally.

### Validation

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm test:e2e
pnpm test:e2e:real
composer run phpcs
composer run phpstan
composer run test
```

## Stage 9: Divi / Existing WordPress Deployment Strategy

### Goal

Make the relationship between the Next.js portal and the existing GGSA Divi site technically concrete.

### Implementation

Document and optionally prototype one path:

- WordPress shortcode that links or embeds the portal;
- block/shortcode wrapper for a portal launch card;
- reverse-proxy/subdirectory deployment notes;
- separate portal subdomain notes;
- headless replacement notes for specific pages.

### Acceptance Criteria

- We can explain how the portal coexists with the current WordPress/Divi page.
- The implementation path does not require rewriting the existing live page.
- Security/session implications are documented.

### Validation

```bash
docker compose up
```

Manual WordPress admin/page check may be required.

## Suggested Order

1. Stage 1: WordPress Plugin Structure.
2. Stage 2: Composer And PHP Quality Tooling.
3. Stage 3: WordPress REST Contract Tests.
4. Style Hardening: Frontend And WordPress Standards.
5. Stage 4: PHP-Side Integration Adapters.
6. Stage 5: Generated Learning Plan Service.
7. Stage 6: Evidence Upload Policy.
8. Stage 7: Accessibility And UX Quality Gates.
9. Stage 8: CI Expansion.
10. Stage 9: Divi / Existing WordPress Deployment Strategy.

## Notes For Each Stage

For every stage:

- keep the diff small;
- run the narrowest useful checks first;
- run `pnpm test:e2e:real` after any WordPress/API behavior change;
- update docs in the same stage when behavior or positioning changes;
- avoid introducing real production secrets or environment-specific values.
