# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app (standalone mode)
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "server.js"]
