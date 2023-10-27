FROM node:16-alpine AS build

WORKDIR /app
COPY frontend/package.json .
RUN npm install
COPY frontend .
RUN npm run build --prod

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/www/ /usr/share/nginx/html/
