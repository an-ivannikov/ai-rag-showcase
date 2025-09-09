# apps/api/Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
ENV CI=1
# pnpm
RUN corepack enable && corepack prepare pnpm@10.4.0 --activate

# Базовые файлы монорепо
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
# Пакеты/приложения
COPY packages ./packages
COPY apps ./apps
COPY datasets ./datasets

# Установка зависимостей всех workspace’ов
RUN pnpm install --frozen-lockfile

# Сборка всех пакетов
RUN pnpm -r build

# Оставляем только production-зависимости
RUN pnpm prune --prod

# --- Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Копируем прод-зависимости и собранные артефакты
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/datasets ./datasets

EXPOSE 3001
# Порт можно переопределять через ENV/compose
CMD ["node", "apps/api/dist/index.js"]
