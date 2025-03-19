FROM node:23.10-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
ENV NODE_ENV=development
RUN npm ci

FROM base AS final

WORKDIR /app

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
    
