# ETAP 1: Budowanie (Build)
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAP 2: Serwowanie (Nginx)
FROM nginx:alpine
# Kopiujemy zbudowane pliki z etapu 1 do folderu Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Kopiujemy prostą konfigurację Nginx (stworzymy ją za chwilę)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]