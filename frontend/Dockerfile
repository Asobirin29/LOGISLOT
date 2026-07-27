# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Check if package.json exists. If it doesn't, this Dockerfile will fail gracefully,
# which is expected since the frontend is not fully implemented yet.
COPY package*.json ./
RUN if [ -f "package.json" ]; then npm ci; else echo "No package.json found. You must initialize Next.js first."; exit 1; fi

COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
