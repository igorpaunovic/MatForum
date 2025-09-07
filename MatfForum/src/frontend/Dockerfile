FROM node:22.18.0-alpine AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

FROM --platform=linux/arm64 nginxinc/nginx-unprivileged:1.27-alpine

COPY --link nginx.conf /etc/nginx/conf.d/default.conf

COPY --link --from=build /usr/src/app/dist/ /usr/share/nginx/html/

EXPOSE 8080
