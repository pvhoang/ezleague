# FROM node:16-alpine AS build
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .
RUN npm run build --prod

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
# COPY --from=build /app/www/ /usr/share/nginx/html/
COPY --from=build /app/dist/build/ /usr/share/nginx/html/
