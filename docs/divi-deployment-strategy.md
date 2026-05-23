# Divi Deployment Strategy

## Recommendation

Use the existing GGSA WordPress/Divi page as the editorial entry point and launch the Next.js Teacher Pathway portal as a separate application surface.

The safest first production path is:

1. Keep the existing Divi page live.
2. Add the `ggsa_teacher_pathway_portal` shortcode inside a Divi Code or Text module.
3. Point the shortcode at a dedicated portal URL such as `https://teacher-pathway.goodtogreatschools.org.au`.
4. Keep Teacher Pathway records in the custom WordPress plugin while LearnDash, WooCommerce and membership integrations remain behind adapter boundaries.

This avoids rewriting the current Divi page while still proving that the prototype can coexist with GGSA's WordPress site.

## Shortcode

The WordPress plugin registers:

```text
[ggsa_teacher_pathway_portal]
```

Default behaviour renders a launch card.

```text
[ggsa_teacher_pathway_portal url="https://teacher-pathway.goodtogreatschools.org.au" title="Teacher Pathway portal" cta="Open portal"]
```

For local testing:

```text
[ggsa_teacher_pathway_portal url="http://localhost:5173" title="Teacher Pathway portal" cta="Open local portal"]
```

The default URL can also be set without editing Divi content by using the `GGSA_TEACHER_PATHWAY_PORTAL_URL` environment variable or the `ggsa_teacher_pathway_portal_url` WordPress filter.

## Embed Option

The shortcode can render an iframe:

```text
[ggsa_teacher_pathway_portal mode="embed" url="https://teacher-pathway.goodtogreatschools.org.au" height="900" title="Teacher Pathway portal"]
```

Treat iframe embedding as a second-choice option. It is useful for a quick visual proof inside a Divi page, but production needs explicit decisions on:

- whether the portal allows framing through `Content-Security-Policy frame-ancestors`;
- whether cookies and authentication work correctly inside an iframe;
- whether LearnDash, WooCommerce or membership sessions are same-site or cross-site;
- whether mobile layout, browser back-button behaviour and focus management are acceptable;
- whether the embedded app can meet privacy and accessibility expectations for teacher evidence workflows.

## Reverse Proxy Or Subdirectory

A reverse proxy can serve the portal under the main WordPress domain, for example:

```text
https://www.goodtogreatschools.org.au/teacher-pathway-portal/
```

This gives a unified domain and can simplify cookie/session policy, but it needs infrastructure support:

- route `/teacher-pathway-portal/*` to the Next.js service;
- keep WordPress routes, uploads and admin paths untouched;
- forward headers such as `Host`, `X-Forwarded-Proto` and `X-Forwarded-For`;
- configure Next.js `basePath` if the app is not served from `/`;
- confirm cache, redirects and WAF rules do not interfere with API calls or evidence uploads.

## Separate Portal Subdomain

A separate subdomain is the cleanest operational boundary:

```text
https://teacher-pathway.goodtogreatschools.org.au
```

This keeps the Divi site stable, allows the portal to deploy independently, and makes it obvious which system owns the Teacher Pathway workflow. The trade-off is that identity and session hand-off must be designed deliberately.

Production should use a proper identity flow rather than sharing the local prototype portal token with browsers. Good options include WordPress authentication cookies on the same parent domain, SSO, OAuth/OpenID Connect, or signed server-side launch links.

## Headless Replacement

Replacing specific Divi page sections with fully headless Next.js routes should come later, after GGSA confirms:

- the existing page's editorial ownership model;
- which sections are still authored in Divi;
- which sections must reflect LearnDash, WooCommerce or membership data;
- SEO, analytics and redirect requirements;
- who owns deployments and rollback.

This prototype should not be positioned as a full Divi replacement yet. It is a working integration-ready portal that can be launched from Divi without disrupting the live page.

## Security Notes

- Do not expose `GGSA_TEACHER_PATHWAY_API_TOKEN` to browser JavaScript.
- Keep same-origin Next.js API routes as the browser-facing boundary.
- Require authenticated WordPress users, SSO users or signed launch sessions for production teacher data.
- Use WordPress capabilities for coach/admin views.
- Treat evidence uploads as private content until storage, malware scanning, retention and access-control rules are confirmed.
- If embedding is enabled, configure `frame-ancestors` narrowly to the GGSA WordPress domain rather than allowing any site to frame the portal.

## Production Decision

Recommended sequence:

1. Ship the Divi shortcode launch card.
2. Deploy the portal on a dedicated subdomain.
3. Add authenticated launch/session hand-off.
4. Decide whether reverse proxy or iframe embedding is still useful after the portal is proven.
5. Only then consider headless replacement for parts of the existing Divi page.
