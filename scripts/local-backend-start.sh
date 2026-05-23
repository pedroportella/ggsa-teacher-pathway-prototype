#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
WP_DIR="$ROOT_DIR/backend/.wordpress"

if [ ! -f "$WP_DIR/wp-load.php" ]; then
  sh "$ROOT_DIR/scripts/local-backend-setup.sh"
fi

exec php -S 127.0.0.1:8080 -t "$WP_DIR" "$ROOT_DIR/scripts/local-wordpress-router.php"
