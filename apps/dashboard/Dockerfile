FROM oven/bun:latest AS base

# ===========================================
# Stage 1: Prune application dependencies
# ===========================================
FROM base AS pruner
WORKDIR /prune

RUN bun install -g turbo

COPY . .
RUN turbo prune @yukinu/dashboard --docker

# ===========================================
# Stage 2: Install production dependencies
# ===========================================
FROM base AS builder
WORKDIR /build

COPY --from=pruner /prune/out/json .
COPY --from=pruner /prune/out/bun.lock .
RUN bun install --no-save

COPY --from=pruner /prune/out/full .
COPY .env .env
RUN bun run build

# ===========================================
# Stage 3: Production image
# ===========================================
FROM base AS runner
WORKDIR /app

COPY --from=builder /build/apps/dashboard/build ./apps/dashboard/build
COPY --from=builder /build/apps/dashboard/node_modules ./apps/dashboard/node_modules
COPY --from=builder /build/node_modules ./node_modules
COPY .env .env

ENV PORT=3000
WORKDIR /app/apps/dashboard
CMD ["bun", "--env-file=.env", "react-router-serve", "build/server/index.js"]
