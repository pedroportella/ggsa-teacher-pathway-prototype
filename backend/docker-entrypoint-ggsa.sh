#!/usr/bin/env bash
set -euo pipefail

plugin_source="/usr/src/ggsa-plugins/ggsa-teacher-pathway"
plugin_target="/var/www/html/wp-content/plugins/ggsa-teacher-pathway"

mkdir -p "$(dirname "$plugin_target")"
rm -rf "$plugin_target"
cp -R "$plugin_source" "$plugin_target"
chown -R www-data:www-data "$plugin_target"

exec docker-entrypoint.sh "$@"
