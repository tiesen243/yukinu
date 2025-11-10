FROM oven/bun:latest AS base

# ===========================================
# Stage 1: Prune application dependencies
# ===========================================
FROM base AS prepare
WORKDIR /prune

RUN bun install -g turbo

COPY . .
RUN turbo prune @yukinu/web --docker

# ===========================================
# Stage 2: Install production dependencies
# ===========================================
FROM base AS builder
WORKDIR /build

COPY --from=prepare /prune/out/json .
RUN bun install

COPY --from=prepare /prune/out/full .

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ENV NEXT_BUILD_OUTPUT=standalone
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
    adduser --system --uid 1001 web
USER web

COPY --from=builder --chown=yukinu:web /build/apps/web/.next/standalone ./
COPY --from=builder --chown=yukinu:web /build/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=yukinu:web /build/apps/web/public ./apps/web/public

CMD ["bun", "--bun", "run", "apps/web/server.js"]
