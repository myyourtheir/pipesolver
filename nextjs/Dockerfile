FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package.json
RUN npm install -g npm@10.2.3
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25.3-alpine
COPY --from=build /app/dist /var/www/out
COPY nginx.conf /etc/nginx/nginx.conf