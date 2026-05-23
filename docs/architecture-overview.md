# Architecture Overview

## Shape

```text
Browser
  -> Next.js app routes
  -> @ggsa/services
  -> WordPress REST API
  -> ggsa_learning_plan custom post type
```

The frontend stays decoupled from upstream WordPress URLs. Browser code calls same-origin Next.js routes. `frontend/packages/services` owns WordPress endpoint construction, fallback data and domain types.

## Surfaces

| Route | Purpose |
| --- | --- |
| `/register` | Submitted learning plans and workflow status |
| `/pathway-readiness` | Module, evidence, certification and RPL readiness |
| `/learning-plan` | Enrolment-generated learning plan with editable prototype overrides |
| `/about` | Plain-language portal and integration explanation |

## Backend

The WordPress plugin owns:

- `ggsa_learning_plan` post type;
- REST routes under `/wp-json/ggsa/v1`;
- secured portal-token/admin-capability checks;
- evidence upload validation;
- admin fields and columns;
- Divi shortcode `[ggsa_teacher_pathway_portal]`.

## Adapter Boundaries

Production systems are isolated behind gateway classes:

- `MembershipUserGateway`
- `WooCommerceEntitlementGateway`
- `LearnDashGateway`

The local prototype returns deterministic fallback data when production plugins are unavailable. This keeps the prototype honest: adapter-ready, not a fake LearnDash/WooCommerce replacement.

## Evidence

Evidence uploads are validated by WordPress and attached to the learning-plan payload. Current prototype policy allows PDF, PNG, JPG/JPEG and DOCX with a 10 MB default limit.

Production still needs private storage, malware scanning, retention and privacy decisions.

## Runtime

- Fast local FE+BE: PHP built-in server, WordPress, SQLite.
- Full parity: Docker Compose with WordPress, MariaDB, setup container and frontend container.

## Rules Of Thumb

- Keep app routes thin.
- Keep WordPress/API details inside services and gateway classes.
- Keep reusable UI in `ui-library`; keep Teacher Pathway workflow in the app/services/plugin.
- Treat WordPress as the workflow record system of record once backend is running.
