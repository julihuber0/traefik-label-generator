FROM node:22.19.0-alpine AS build
ARG BUILD_CONFIG="prod"
RUN echo ${BUILD_CONFIG}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:${BUILD_CONFIG}

FROM nginx:1.29.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/traefik-label-generator/browser/ /usr/share/nginx/html
