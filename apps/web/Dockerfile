FROM oven/bun:latest AS base

# ===========================================
# Stage 1: Prune application dependencies
# ===========================================
FROM base AS pruner
WORKDIR /prune

RUN bun install -g turbo

COPY . .
RUN turbo prune @yukinu/web --docker

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
ENV NEXT_BUILD_OUTPUT=standalone
ENV POSTGRES_HOST=db
RUN bun run build

# ===========================================
# Stage 3: Production image
# ===========================================
FROM base AS runner
WORKDIR /app

COPY --from=builder /build/apps/web/.next/standalone ./
COPY --from=builder /build/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /build/apps/web/public ./apps/web/public
COPY --from=builder /build/apps/web/node_modules ./node_modules

COPY .env .env
ENV POSTGRES_HOST=db
ENV PORT=3000
CMD ["bun", "apps/web/server.js"]
