FROM oven/bun:latest AS base

# ===========================================
# Stage 1: Prune application dependencies
# ===========================================
FROM base AS prepare
WORKDIR /prune

RUN bun install -g turbo

COPY . .
RUN turbo prune @yukinu/dashboard --docker

# ===========================================
# Stage 2: Build application
# ===========================================
FROM base AS builder
WORKDIR /build

COPY --from=prepare /prune/out/json .
RUN bun ci

COPY --from=prepare /prune/out/full .

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ARG VITE_APP_NAME
ENV VITE_APP_NAME=$VITE_APP_NAME

ARG VITE_APP_URL
ENV VITE_APP_URL=$VITE_APP_URL

ARG VITE_TRPC_USE_STREAMING
ENV VITE_TRPC_USE_STREAMING=$VITE_TRPC_USE_STREAMING

ENV SKIP_ENV_VALIDATION=true

RUN bun run build

# ===========================================
# Stage 3: Install production dependencies
# ===========================================
FROM base AS prod-deps
WORKDIR /prod-deps

COPY --from=prepare /prune/out/json .
RUN bun ci --omit=dev --omit=peer --ignore-scripts

# ===========================================
# Stage 4: Production image
# ===========================================
FROM base AS runner
WORKDIR /app

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 yukinu && \
    adduser --system --uid 1002 dashboard
USER dashboard

COPY --from=builder --chown=dashboard:yukinu /build/apps/dashboard/build ./apps/dashboard/build
COPY --from=prod-deps --chown=dashboard:yukinu /prod-deps/apps/dashboard/node_modules ./apps/dashboard/node_modules
COPY --from=prod-deps --chown=dashboard:yukinu /prod-deps/node_modules ./node_modules

ENV NODE_ENV=production
WORKDIR /app/apps/dashboard
CMD ["bun", "--bun", "react-router-serve", "build/server/index.js"]
