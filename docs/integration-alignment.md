# Integration Alignment

## Positioning

This is an integration-ready vertical slice, not a complete replacement for GGSA's existing WordPress, LearnDash, WooCommerce, Divi or membership platform.

Use this wording:

> This prototype is a working headless WordPress and Next.js vertical slice for the Teacher Pathway workflow. It simulates LMS and membership data locally, while isolating the places where production LearnDash, WooCommerce, Divi, Membership Platform and optional GraphQL/Hasura integrations should connect.

## Alignment Matrix

| Area | Prototype | Production direction |
| --- | --- | --- |
| WordPress | Real plugin, REST routes, custom post type, admin view | Add production auth, roles, deployment hardening |
| LearnDash | Adapter-ready local fallback data | Read real courses, modules, progress, certificates |
| WooCommerce | Adapter-ready entitlement fallback | Resolve purchases, subscriptions, school licences or memberships |
| Membership | Adapter-ready teacher profile/enrolment fallback | Generate plans from real teacher-role/enrolment events |
| Divi | Shortcode launch card and optional iframe mode | Prefer launch card to portal subdomain first |
| Evidence | Real prototype upload validation and metadata | Decide private storage, scanning, retention, privacy |
| GraphQL/Hasura | Not implemented | Add only if GGSA confirms reporting/query need |

## Key Assumptions

- Teacher Learning Plans should be generated from enrolment or role selection, not invented manually.
- WordPress should own pathway workflow records and coach/admin review metadata.
- LearnDash should own LMS progress and certificates.
- WooCommerce/membership systems should own access and entitlement.
- RPL wording should stay about evidence readiness, not GGSA granting accreditation.

## Stakeholder Questions

- What system owns the Teacher role and enrolment event?
- Which LearnDash entities map to prerequisites, core modules and electives?
- Does WooCommerce own payments, subscriptions, school licences, membership access or none of these?
- Where should evidence files live in production?
- Is GraphQL/Hasura already used, or only a desired capability?
- Should the portal be launched from Divi, embedded, reverse-proxied or eventually replace selected Divi sections?
