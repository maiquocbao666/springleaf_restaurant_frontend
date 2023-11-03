#Deploy front-end
#stage1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-prod

#stage2
FROM nginx:alpine
COPY --from=node app/dist/springleaf_restaurant_frontend /usr/share/nginx/html