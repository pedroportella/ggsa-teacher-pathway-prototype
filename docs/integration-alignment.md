# Integration Alignment

## Purpose

This note records how the current Teacher Pathway prototype aligns with the live GGSA Teacher Pathway page, the senior developer position description and GGSA's likely production WordPress ecosystem.

The prototype should be described as an integration-ready vertical slice, not as a complete replacement for GGSA's existing WordPress, LearnDash, WooCommerce, Divi or membership platform capabilities.

## Current Prototype Position

The repository currently demonstrates:

- A decoupled Next.js portal for teacher learning plan intake, register review and readiness checks.
- A custom WordPress plugin exposing REST endpoints for learning plan records, evidence uploads and readiness updates.
- A custom `ggsa_learning_plan` post type for local WordPress administration.
- A local Docker runtime with WordPress, MariaDB and the Next.js frontend.
- Seeded local data and automated frontend verification.

This is a useful technical slice because it proves the frontend, backend-for-frontend and WordPress REST boundary can work together. It does not yet prove integration with GGSA's production e-learning stack.

## Alignment Matrix

| Requirement or live page signal | Prototype today | Misalignment or assumption | Suggested direction |
| --- | --- | --- | --- |
| WordPress development | Custom plugin, custom post type and REST routes | Good baseline, but routes are prototype-grade and currently unauthenticated | Harden permissions, validation, nonce/auth handling and plugin structure |
| LearnDash | Adapter-ready local prerequisites, modules, progress and evidence | No real LearnDash course, lesson, topic, quiz, certificate or user-progress integration yet | Add a LearnDash adapter that reads assigned courses, module progress and certificates when LearnDash is available |
| WooCommerce | No current integration | Position description calls out WooCommerce, likely for purchases, enrolments, memberships or entitlements | Add an entitlement adapter that can resolve whether a user/school has access through WooCommerce or membership data |
| Divi | No current integration | Live GGSA page is WordPress/Divi-rendered; prototype is a separate Next.js app | Document deployment options: embedded app block/shortcode, separate portal subdomain or headless page replacement |
| Membership Platform | UI mentions membership journey but no actual account, role or enrolment source | Live page says selecting the Teacher role automatically generates a Teacher Learning Plan | Add a membership user adapter and make learning plans generated from role/enrolment events rather than manual creation only |
| GraphQL/Hasura | No current integration | Position description asks for GraphQL APIs, particularly Hasura | Treat GraphQL/Hasura as optional reporting/query infrastructure unless GGSA confirms it is production-critical |
| Evidence Portfolio | Local sample evidence and upload endpoint | Live page says certificates of completion are automatically stored in the Evidence Portfolio | Model certificates as LMS-derived evidence and keep manual uploads as supplementary artefacts |
| RPL and accreditation | Readiness controls and "RPL evidence ready" workflow status | Live page says RPL is assessed by partner universities and may contribute to qualifications | Keep internal workflow language focused on evidence preparation, not granting accreditation |
| Teacher pathway journey | Register, readiness, learning plan and about pages | Live page journey starts with enrolment and includes classroom application and electives | Reframe IA around enrolment-generated plan, module progress, classroom application, evidence and optional electives |
| Security and privacy | Public REST callbacks in local plugin | Teacher records and evidence are sensitive enough to require role-aware access control | Add capability checks for coach/admin actions and authenticated user checks for teacher actions |

## Recommended Target Shape

The production-oriented architecture should separate the Teacher Pathway workflow from the systems that provide source data.

```text
Teacher / school user
  -> GGSA Membership Platform / WordPress identity
  -> Teacher role or entitlement resolved from membership and WooCommerce
  -> LearnDash courses, progress and certificates
  -> Teacher Learning Plan aggregate
  -> Next.js portal surfaces
  -> WordPress custom post/meta for coach notes, readiness review and operational workflow
  -> Optional GraphQL/Hasura layer for reporting and cross-system queries
```

The custom WordPress plugin should not pretend to be LearnDash, WooCommerce or the Membership Platform. Its strongest role is to orchestrate Teacher Pathway-specific workflow data that those systems do not already own.

## Proposed Integration Boundaries

### `TeacherPathwayRepository`

Owns Teacher Pathway records, coach notes, readiness decisions and workflow metadata stored in WordPress custom post types or post meta.

### `LearnDashGateway`

Reads LMS-owned data:

- assigned courses;
- prerequisite modules;
- core modules;
- elective modules;
- lesson/topic/quiz progress;
- completion dates;
- certificates.

The local implementation can use seed data, but the interface should use LearnDash language.

### `MembershipUserGateway`

Resolves the current user, school, role and Teacher Pathway enrolment trigger.

This is the boundary that should support the live page claim that selecting the Teacher role generates a personalised Teacher Learning Plan.

### `WooCommerceEntitlementGateway`

Resolves paid or granted access, subscription state, school entitlements or product membership mappings if WooCommerce is part of the production access model.

### `EvidencePortfolioService`

Aggregates evidence from:

- LearnDash certificates;
- uploaded classroom artefacts;
- coach-reviewed mastery evidence;
- notes prepared for partner-university RPL assessment.

### `ReportingGateway`

Optional future boundary for GraphQL or Hasura. This should only be built when GGSA confirms whether Hasura is an existing production dependency or an expected new reporting layer.

## Immediate Course Of Action

1. Keep README and architecture language focused on the integration-ready LearnDash adapter model.
2. Keep the custom WordPress plugin, but harden REST permissions and input validation before treating it as production-shaped.
3. Add service interfaces for LearnDash, membership and WooCommerce concepts, backed by local seed data until production credentials or plugin APIs are available.
4. Change the learning plan copy and flow so plans are generated from enrolment or Teacher role selection, with manual entry framed as a local prototype fallback.
5. Expand the readiness model to include electives and classroom application, matching the live Teacher Pathway page.
6. Keep workflow labels aligned to "RPL evidence ready" or "Ready for partner assessment" rather than implying GGSA grants accreditation.
7. Add documentation for deployment options with Divi: embedded portal, linked subdomain or headless replacement.
8. Add a short stakeholder confirmation checklist before building deeper integrations.

## Stakeholder Confirmation Checklist

Before implementing deeper production integrations, confirm:

- Is the GGSA Membership Platform implemented in WordPress, a custom plugin, Auth0, WooCommerce Memberships, LearnDash Groups or another system?
- What exact event should generate a Teacher Learning Plan?
- Which LearnDash entities represent the prerequisite, core and elective modules?
- Are certificates generated by LearnDash certificates, a custom GGSA certificate system or another provider?
- Does WooCommerce control access, payment, school licences, memberships or none of these?
- Is Hasura currently used in production, or is GraphQL a desired future capability?
- Should the Next.js portal be embedded inside the existing WordPress/Divi site, served as a separate portal, or used as a headless replacement for specific pages?
- Who can view and edit teacher evidence: teacher, school leader, GGSA coach, administrator or partner university reviewer?
- What privacy, retention and file scanning rules apply to uploaded classroom artefacts and evidence?

## Positioning Statement

Use this wording when describing the prototype:

> This prototype is a working headless WordPress and Next.js vertical slice for the Teacher Pathway workflow. It currently simulates LMS and membership data locally, while isolating the places where production LearnDash, WooCommerce, Divi, Membership Platform and optional GraphQL/Hasura integrations should connect.
