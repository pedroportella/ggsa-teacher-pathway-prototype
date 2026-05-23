#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
WP_DIR="$BACKEND_DIR/.wordpress"
CACHE_DIR="$BACKEND_DIR/.cache"
WP_CLI="$CACHE_DIR/wp-cli.phar"
WORDPRESS_ARCHIVE="$CACHE_DIR/wordpress-latest.tar.gz"
SQLITE_ARCHIVE="$CACHE_DIR/sqlite-database-integration.zip"

mkdir -p "$CACHE_DIR" "$BACKEND_DIR/.wp-cli"

if [ ! -f "$WORDPRESS_ARCHIVE" ]; then
  curl -sL https://wordpress.org/latest.tar.gz -o "$WORDPRESS_ARCHIVE"
fi

if [ ! -f "$SQLITE_ARCHIVE" ]; then
  curl -sL https://downloads.wordpress.org/plugin/sqlite-database-integration.latest-stable.zip -o "$SQLITE_ARCHIVE"
fi

if [ ! -f "$WP_CLI" ]; then
  curl -sL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o "$WP_CLI"
fi

if [ ! -f "$WP_DIR/wp-load.php" ]; then
  mkdir -p "$WP_DIR"
  tar -xzf "$WORDPRESS_ARCHIVE" -C "$CACHE_DIR"
  cp -R "$CACHE_DIR/wordpress/." "$WP_DIR/"
fi

mkdir -p "$WP_DIR/wp-content/plugins" "$WP_DIR/wp-content/database" "$WP_DIR/wp-content/uploads"

if [ ! -d "$WP_DIR/wp-content/plugins/sqlite-database-integration" ]; then
  unzip -q "$SQLITE_ARCHIVE" -d "$WP_DIR/wp-content/plugins"
fi

cp "$WP_DIR/wp-content/plugins/sqlite-database-integration/db.copy" "$WP_DIR/wp-content/db.php"

if [ ! -e "$WP_DIR/wp-content/plugins/ggsa-teacher-pathway" ]; then
  ln -s "../../../wp-content/plugins/ggsa-teacher-pathway" "$WP_DIR/wp-content/plugins/ggsa-teacher-pathway"
fi

if [ ! -f "$WP_DIR/wp-config.php" ]; then
  cp "$WP_DIR/wp-config-sample.php" "$WP_DIR/wp-config.php"
  php "$WP_CLI" config shuffle-salts --path="$WP_DIR"
fi

php "$WP_CLI" config set DB_NAME ggsa_teacher_pathway --path="$WP_DIR" --quiet
php "$WP_CLI" config set DB_USER local --path="$WP_DIR" --quiet
php "$WP_CLI" config set DB_PASSWORD local --path="$WP_DIR" --quiet
php "$WP_CLI" config set DB_HOST localhost --path="$WP_DIR" --quiet
php "$WP_CLI" config set DB_ENGINE sqlite --path="$WP_DIR" --quiet
php "$WP_CLI" config set DB_DIR "$WP_DIR/wp-content/database" --path="$WP_DIR" --quiet
php "$WP_CLI" config set WP_ENVIRONMENT_TYPE local --path="$WP_DIR" --quiet
php "$WP_CLI" config set WP_DEBUG true --raw --path="$WP_DIR" --quiet
php "$WP_CLI" config set WP_DEBUG_DISPLAY false --raw --path="$WP_DIR" --quiet
php "$WP_CLI" config set GGSA_TEACHER_PATHWAY_API_TOKEN local-teacher-pathway-portal-token --path="$WP_DIR" --quiet

if ! php "$WP_CLI" core is-installed --path="$WP_DIR" >/dev/null 2>&1; then
  php "$WP_CLI" core install \
    --path="$WP_DIR" \
    --url=http://localhost:8080 \
    --title="GGSA Teacher Pathway Portal" \
    --admin_user=admin \
    --admin_password=admin \
    --admin_email=admin@example.test \
    --skip-email
fi

php "$WP_CLI" plugin activate ggsa-teacher-pathway --path="$WP_DIR" --quiet
php "$WP_CLI" rewrite structure '/%postname%/' --path="$WP_DIR" --quiet
php "$WP_CLI" rewrite flush --path="$WP_DIR" --quiet
php "$WP_CLI" eval 'ggsa_seed_learning_plan_register(true);' --path="$WP_DIR" --quiet

printf 'Local WordPress backend ready at http://localhost:8080\n'
printf 'WordPress admin: http://localhost:8080/wp-admin admin/admin\n'
