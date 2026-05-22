# frontend/Dockerfile
FROM node:20.19-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml eslint.config.js ./
COPY scripts/check-node-version.mjs scripts/check-node-version.mjs
COPY apps/portal/package.json apps/portal/package.json
COPY packages/services/package.json packages/services/package.json
COPY packages/ui-assets/package.json packages/ui-assets/package.json
COPY packages/ui-library/package.json packages/ui-library/package.json
COPY packages/ui-tokens/package.json packages/ui-tokens/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN pnpm install --frozen-lockfile

COPY . .

ARG WORDPRESS_API_BASE_URL=http://wordpress/wp-json/ggsa/v1
ENV WORDPRESS_API_BASE_URL=$WORDPRESS_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 5173

RUN pnpm --filter @ggsa/portal build

CMD ["pnpm", "--filter", "@ggsa/portal", "start"]
