# 1. Używamy obrazu Node.js (Alpine)
FROM node:18-alpine

# 2. Tworzymy katalog roboczy
WORKDIR /app

# --- NAPRAWA BŁĘDU PRISMA ---
# Instalujemy OpenSSL, którego brakuje w czystym Alpine
RUN apk add --no-cache openssl libc6-compat
# ---------------------------

# 3. Kopiujemy pliki konfiguracyjne pakietów
COPY package*.json ./

# 4. Instalujemy zależności
RUN npm install

# 5. Kopiujemy resztę kodu źródłowego
COPY . .

# 6. Generujemy klienta Prisma
# (Teraz wykryje zainstalowany OpenSSL i pobierze właściwy silnik)
RUN npx prisma generate

# 7. Budujemy aplikację
RUN npm run build

# 8. Otwieramy port 3000
EXPOSE 3000

# 9. Uruchamiamy aplikację w trybie produkcyjnym
CMD ["npm", "run", "start:prod"]