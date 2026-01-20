# ESO Build Manager

Aplikacja Fullstack do zarządzania buildami w grze Elder Scrolls Online. Projekt umożliwia tworzenie buildów, dobieranie ekwipunku oraz obliczanie statystyk (Penetration/Crit Damage).

## 🚀 Technologie

* **Backend:** NestJS, Prisma ORM, PostgreSQL
* **Frontend:** React, Vite, Zustand, React-Bootstrap
* **DevOps:** Docker, Docker Compose, Nginx

## 🛠️ Instrukcja Uruchomienia (Szybki Start)

Wymagany jest jedynie zainstalowany **Docker Desktop**.

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/Fantson/eso-build-manager.git](https://github.com/Fantson/eso-build-manager.git)
    cd eso-build-manager
    ```

2.  **Uruchom aplikację:**
    ```bash
    docker-compose up --build
    ```
    *Poczekaj chwilę, aż kontenery zostaną zbudowane i uruchomione.*

3.  **Wypełnij bazę danych przykładowymi danymi (Seed):**
    Otwórz nowy terminal i wpisz:
    ```bash
    docker exec -it eso_backend npx prisma db seed
    ```

4.  **Gotowe!**
    * Aplikacja Frontend: [http://localhost:5173](http://localhost:5173)
    * Dokumentacja API (Swagger): [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## ✅ Zrealizowane funkcjonalności

* [x] Pełna konteneryzacja (Frontend, Backend, Baza).
* [x] Relacyjna baza danych (PostgreSQL) z Prismą.
* [x] Paginacja po stronie serwera i klienta.
* [x] Walidacja danych (DTO) i Globalna obsługa błędów.
* [x] Dokumentacja OpenAPI (Swagger).
* [x] Zaawansowany UI (Paper Doll Editor) i Globalny Stan (Zustand).