# Stage 1: Build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve
FROM node:18

# Set working directory
WORKDIR /app

# Copy the production build from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./


# Install only production dependencies
RUN npm install --production --legacy-peer-deps

# Expose the port that the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]