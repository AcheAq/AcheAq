# Estágio de Build
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

# Estágio de Produção
FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx para suportar SPA (Single Page Application) routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
