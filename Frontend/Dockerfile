# Dockerfile for Frontend (Vite + React)

FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile

COPY . .
RUN npm run build || yarn build

FROM nginx:alpine
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
