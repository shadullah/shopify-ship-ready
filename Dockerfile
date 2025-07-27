# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "docker-start"]
