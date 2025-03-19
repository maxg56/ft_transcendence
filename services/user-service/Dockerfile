FROM node:23.10-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
ENV NODE_ENV=development
RUN npm ci

FROM node:23.10-alpine AS final

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "dev"]

