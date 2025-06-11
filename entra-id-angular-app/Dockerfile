# Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Copy environment template
COPY src/environments/environment.template.ts src/environments/environment.template.ts

# Install build dependencies
RUN npm install -g @angular/cli

# Copy scripts
COPY scripts/ ./scripts/

# Generate environment from variables
RUN node scripts/generate-env.js

# Build application
ARG BUILD_MODE=production
RUN npm run build:${BUILD_MODE}

# Production Stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist/entra-id-angular-app /usr/share/nginx/html

# Copy environment substitution script
COPY scripts/substitute-env.sh /docker-entrypoint.d/substitute-env.sh
RUN chmod +x /docker-entrypoint.d/substitute-env.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001 -G nodejs

# Set permissions
RUN chown -R angular:nodejs /usr/share/nginx/html
RUN chown -R angular:nodejs /var/cache/nginx
RUN chown -R angular:nodejs /var/log/nginx
RUN chown -R angular:nodejs /etc/nginx/conf.d

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Switch to non-root user
USER angular

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]