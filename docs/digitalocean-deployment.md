# DigitalOcean Deployment

This repository has a DigitalOcean review deployment for the GGSA Teacher Pathway prototype.

## Live Links

- Frontend portal: https://ggsa-teacher-pathway-frontend-zj7zd.ondigitalocean.app
- Backend WordPress REST base: shared privately with reviewers
- Backend WordPress admin: shared privately with authorized reviewers only

Use the trailing slash on `/wp-admin/`.

## Deployment Shape

```text
Browser
  -> DigitalOcean App Platform frontend
  -> Next.js same-origin API routes
  -> DigitalOcean WordPress Droplet
  -> ggsa-teacher-pathway WordPress plugin REST routes
```

This is a review environment, not GGSA production infrastructure.

## Backend

The backend runs on a DigitalOcean one-click WordPress Droplet:

- Region: `syd1`
- Image: `wordpress-20-04`
- Droplet: stored in private deployment notes
- Backend address: stored in private deployment notes

Useful checks:

```bash
doctl compute droplet get <backend-droplet-name> \
  --format ID,Name,PublicIPv4,Status

ssh -i ~/.ssh/<review-ssh-key> root@<backend-host>

cd /var/www/html
wp plugin list --allow-root
wp option get siteurl --allow-root
```

The plugin expects `GGSA_TEACHER_PATHWAY_API_TOKEN` in `wp-config.php`. Rotate the token if it appears in logs, screenshots or chat:

```bash
GGSA_TOKEN="$(openssl rand -hex 32)"
wp config set GGSA_TEACHER_PATHWAY_API_TOKEN "$GGSA_TOKEN" --allow-root
```

## Frontend

The frontend runs on DigitalOcean App Platform:

- Region: `syd`
- App: `ggsa-teacher-pathway-frontend`
- App ID: stored in private deployment notes
- Source: GitHub `main`
- Build: `frontend/Dockerfile`

The tracked App Platform template is `.do/app.template.yml`. Generate the local spec from `.env.local`; do not commit `.env.local` or `.do/app.generated.yml`.

```bash
set -a
source .env.local
set +a

perl \
  -e 'local $/; $_=<>; s/__WORDPRESS_API_BASE_URL__/$ENV{WORDPRESS_API_BASE_URL}/g; s/__GGSA_TEACHER_PATHWAY_API_TOKEN__/$ENV{GGSA_TEACHER_PATHWAY_API_TOKEN}/g; s/__NEXT_TELEMETRY_DISABLED__/$ENV{NEXT_TELEMETRY_DISABLED}/g; print' \
  .do/app.template.yml > .do/app.generated.yml
```

Create the app:

```bash
doctl apps create --spec .do/app.generated.yml
```

If DigitalOcean says `GitHub user not authenticated`, connect App Platform to GitHub in the DigitalOcean web UI and complete the first app creation there.

Force a fresh rebuild:

```bash
doctl apps create-deployment <app-id> --force-rebuild
```

## Smoke Checks

```bash
curl -s https://ggsa-teacher-pathway-frontend-zj7zd.ondigitalocean.app/status
curl -i https://<backend-host>/wp-json/ggsa/v1/teacher-pathway-submissions
```

Expected:

- frontend `/status` returns `{"status":"UP"}`;
- unauthenticated backend submission requests are rejected;
- frontend API routes can read and write via the server-side token;
- the token is never exposed to browser-side JavaScript.

## Local Production Parity

Use local dev and Docker side by side when checking production-only styling or runtime behavior:

```bash
pnpm --dir frontend dev

docker compose build frontend
docker run --rm --name ggsa-frontend-compare \
  --env-file .env.local \
  -p 5173:5173 \
  ggsa-teacher-pathway-frontend:local
```

- Docker production build: `http://localhost:5173`
- Local dev build: `http://localhost:5174`

If local dev reports a missing `.next` chunk, clear the stale Next cache and restart:

```bash
rm -rf frontend/apps/portal/.next
pnpm --dir frontend dev
```
