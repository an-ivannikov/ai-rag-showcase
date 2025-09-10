FROM node:22-alpine AS builder
WORKDIR /app
ENV CI=1
RUN corepack enable && corepack prepare pnpm@10.4.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm -r build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages

EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
