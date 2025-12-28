# Dockerfile for Backend (Node.js + TypeScript)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Build TypeScript (if needed)
RUN if [ -f tsconfig.json ]; then npm run build || true; fi

# Expose port (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
