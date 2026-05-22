#!/usr/bin/env sh
set -eu

refresh_register_seed=0

for arg in "$@"; do
  case "$arg" in
    --)
      ;;
    --refresh-register|--refresh-register-seed|--seed-register)
      refresh_register_seed=1
      ;;
    --help|-h)
      echo "Usage: pnpm docker:up [-- --refresh-register]"
      echo "Starts MariaDB, WordPress, setup and frontend. Use --refresh-register to replace the register with seed data."
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Usage: pnpm docker:up [-- --refresh-register]" >&2
      exit 1
      ;;
  esac
done

docker compose up -d mariadb wordpress

if [ "$refresh_register_seed" -eq 1 ]; then
  GGSA_REFRESH_REGISTER_SEED=1 docker compose run --rm wordpress-setup
else
  docker compose run --rm wordpress-setup
fi

docker compose up -d --no-deps frontend
docker compose ps
