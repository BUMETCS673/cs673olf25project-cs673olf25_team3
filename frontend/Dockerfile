# ----------------------------
# Base Stage
# ----------------------------
FROM node:20.19-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# ----------------------------
# Development Stage
# ----------------------------
FROM base AS dev

# Expose dev server port
EXPOSE 5173

# Default command for dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ----------------------------
# Test Stage
# ----------------------------
FROM base AS test

# Run tests
CMD ["npm", "run", "test"]
