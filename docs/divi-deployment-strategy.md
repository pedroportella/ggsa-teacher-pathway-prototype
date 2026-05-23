# Divi Deployment Strategy

## Recommendation

Keep the existing GGSA WordPress/Divi page live and use the plugin shortcode as the first integration path.

```text
[ggsa_teacher_pathway_portal url="https://teacher-pathway.goodtogreatschools.org.au" title="Teacher Pathway portal" cta="Open portal"]
```

This renders a launch card from a Divi Code/Text module and avoids rewriting the current live page.

## Options

| Option | Use when | Notes |
| --- | --- | --- |
| Launch card | First production path | Safest, least disruptive |
| Portal subdomain | Preferred app hosting path | Clear ownership and independent deploys |
| Reverse proxy/subdirectory | Need same-domain UX | Requires infrastructure and Next.js basePath planning |
| Iframe embed | Quick visual proof only | Needs CSP, auth, cookie, focus and mobile review |
| Headless replacement | Later phase | Only after editorial, SEO and ownership decisions |

## Security Notes

- Do not expose the local portal token to browsers.
- Use production authentication and role-aware authorization.
- Configure `frame-ancestors` narrowly if iframe embedding is allowed.
- Treat evidence as private content until storage and retention rules are approved.
