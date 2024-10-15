# Base Stage
FROM node:18 AS base

WORKDIR /usr/src/app

COPY package*.json ./

# Development Stage
FROM base AS development

RUN npm ci

COPY . .

EXPOSE $NEST_APP_PORT

CMD ["npm", "run", "start:dev"]

# Build Stage
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

# Production Stage
FROM node:18 AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm ci --only=production

EXPOSE $NEST_APP_PORT

CMD ["npm", "run", "start:prod"]
