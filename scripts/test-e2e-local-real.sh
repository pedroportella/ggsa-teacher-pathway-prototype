#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
TOKEN="local-teacher-pathway-portal-token"
BACKEND_URL="http://127.0.0.1:8080/wp-json/ggsa/v1/teacher-pathway-submissions"

sh "$ROOT_DIR/scripts/local-backend-setup.sh"

if curl -s -H "X-GGSA-Portal-Token: $TOKEN" "$BACKEND_URL" >/dev/null 2>&1; then
  BACKEND_PID=""
else
  sh "$ROOT_DIR/scripts/local-backend-start.sh" >/tmp/ggsa-local-wordpress.log 2>&1 &
  BACKEND_PID="$!"
fi

cleanup() {
  if [ -n "${BACKEND_PID:-}" ]; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

attempt=0
while [ "$attempt" -lt 60 ]; do
  if curl -s -H "X-GGSA-Portal-Token: $TOKEN" "$BACKEND_URL" >/dev/null 2>&1; then
    break
  fi

  attempt=$((attempt + 1))
  sleep 1
done

if [ "$attempt" -eq 60 ]; then
  printf 'Local WordPress backend did not become ready. See /tmp/ggsa-local-wordpress.log\n' >&2
  exit 1
fi

WORDPRESS_API_BASE_URL=http://127.0.0.1:8080/wp-json/ggsa/v1 \
GGSA_TEACHER_PATHWAY_API_TOKEN="$TOKEN" \
E2E_USE_MOCK=false \
E2E_CLEANUP_RECORDS=true \
pnpm --dir "$ROOT_DIR/frontend" test:e2e:real
