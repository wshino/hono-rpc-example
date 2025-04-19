# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies only
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Development image
FROM base AS dev
COPY package.json bun.lock ./
RUN bun install
COPY . .

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun build ./src/index.ts --outdir ./dist --target bun
RUN cp -r src/handlers dist/

# Production image
FROM base AS runner
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Install production dependencies only
RUN bun install --frozen-lockfile --production

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"] 