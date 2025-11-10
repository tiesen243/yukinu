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
# Stage 2: Install production dependencies
# ===========================================
FROM base AS builder
WORKDIR /build

COPY --from=prepare /prune/out/json .
COPY bun.lock ./bun.lock
RUN bun install

COPY --from=prepare /prune/out/full .

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ARG VITE_APP_NAME
ENV VITE_APP_NAME=$VITE_APP_NAME

ARG VITE_APP_DESCRIPTION
ENV VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION

ARG VITE_TRPC_USE_STREAMING
ENV VITE_TRPC_USE_STREAMING=$VITE_TRPC_USE_STREAMING

ENV SKIP_ENV_VALIDATION=true
RUN bun run build

# ===========================================
# Stage 3: Production image
# ===========================================
FROM base AS runner
WORKDIR /app

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 yukinu && \
    adduser --system --uid 1001 dashboard
USER dashboard

COPY --from=builder --chown=yukinu:dashboard /build/apps/dashboard/build ./apps/dashboard/build
COPY --from=builder --chown=yukinu:dashboard /build/apps/dashboard/public ./apps/dashboard/public

COPY --from=builder --chown=yukinu:dashboard /build/apps/dashboard/package.json ./apps/dashboard/package.json
COPY --from=builder --chown=yukinu:dashboard /build/apps/dashboard/node_modules ./apps/dashboard/node_modules
COPY --from=builder --chown=yukinu:dashboard /build/package.json ./package.json
COPY --from=builder --chown=yukinu:dashboard /build/node_modules ./node_modules

ENV NODE_ENV=production
CMD ["bun", "--bun", "--filter", "@yukinu/dashboard", "start"]
