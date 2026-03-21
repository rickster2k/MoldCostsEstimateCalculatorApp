# ============================================================================
# Mold Costs Estimate - PRODUCTION DOCKERFILE
# ============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------------------------------------------
FROM node:22.14.0-slim AS deps

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install build tools needed for native dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies using package-lock.json for reproducible builds
# This ensures exact versions are installed
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2: Build application
# -----------------------------------------------------------------------------
FROM node:22.14.0-slim AS builder

WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Declare build arguments (passed from cloudbuild.yaml)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_APP_URL

# Set as environment variables so Next.js bakes them into the client bundle
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
# Build Next.js application
# Creates .next/standalone with optimized production build
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Production runtime
# -----------------------------------------------------------------------------
FROM node:22.14.0-slim AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Cloud Run PORT configuration
ENV PORT=8080

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static

# Copy public directory
COPY --from=builder /app/public ./public

# Set correct ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Next.js server
CMD ["node", "server.js"]