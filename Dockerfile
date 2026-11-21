# Multi-stage Dockerfile for Manufacturing ERP (Next.js & NestJS)
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json ./
COPY prisma ./prisma/

# Development stage for NestJS Backend Server
FROM base AS server
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "run", "server:dev"]

# Development stage for Next.js Client
FROM base AS client
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
