FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 ADD THIS (IMPORTANT)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Serve using nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]