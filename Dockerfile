
# Build stage
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build principal
RUN npm run build

# Build dashboard
RUN npm run dashboard:build

# Production stage
FROM nginx:alpine

# Copia build principal
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia build do dashboard para /admin
COPY --from=builder /app/dist-dashboard /usr/share/nginx/html/admin

# Copia nginx customizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]