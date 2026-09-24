# ---- 1. Build del frontend ----
FROM node:22-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- 2. Dependencias del backend ----
FROM node:22-slim AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# ---- 3. Imagen final: la API sirve también el frontend compilado ----
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/
COPY --from=frontend /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "index.js"]
