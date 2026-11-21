# =============================================================================
# Production Dockerfile for Manufacturing ERP - NestJS Backend Server
# Optimized for Cloud Hosting (Render Free Tier < 512 MB RAM, Railway, Fly.io)
# Builds and runs ONLY the NestJS API engine; Next.js is deployed separately (e.g. Vercel)
# =============================================================================

# -----------------------------------------------------------------------------
# 1. Build Stage
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install system utilities required by Prisma engine on Alpine Linux
RUN apk add --no-cache libc6-compat openssl

# Copy package manifests and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies needed for compilation (including devDependencies)
RUN npm install

# Copy configuration and backend source files
COPY tsconfig*.json nest-cli.json ./
COPY src ./src/
COPY types ./types/

# Generate Prisma Client and build the NestJS server
RUN npm run prisma:generate && npm run server:build

# Remove development dependencies to keep the image slim
RUN npm prune --omit=dev

# -----------------------------------------------------------------------------
# 2. Production Runtime Stage (Lean, Non-Root, Memory-Capped)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS server

WORKDIR /app

# Install openssl for Prisma binary compatibility
RUN apk add --no-cache openssl

# Production runtime settings
ENV NODE_ENV=production
ENV PORT=3001

# Cap V8 memory heap to 384 MB so the entire container stays safely under Render's 512 MB limit
ENV NODE_OPTIONS="--max-old-space-size=384"

# Copy built application and production dependencies from builder with proper permissions
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma

# Expose backend API port
EXPOSE 3001

# Run as non-root user
USER node

# Start the NestJS backend
CMD ["npm", "run", "server:start"]
