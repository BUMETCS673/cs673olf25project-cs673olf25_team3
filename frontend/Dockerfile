# ----------------------------
# Dev Environment
# ----------------------------
FROM node:20.19-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# This allows us to leverage Docker's caching for dependency installation
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the app runs
EXPOSE 5173

# Default command (overridden in docker-compose if needed)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]