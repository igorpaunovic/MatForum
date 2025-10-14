# User Management Service

## Opis
Mikroservis za upravljanje korisnicima i njihovim profilima u MatForum aplikaciji.

## Funkcionalnosti
- Registracija i autentifikacija korisnika
- Upravljanje korisničkim profilima
- Komunikacija sa drugim mikroservisima (Question, Answer)
- Validacija korisničkih podataka

## Struktura
```
UserManagement/
├── MatForum.UserManagement.API/          # Web API kontroleri
├── MatForum.UserManagement.Application/  # Business logika i servisi
├── MatForum.UserManagement.Domain/       # Domain entiteti
└── MatForum.UserManagement.Infrastructure/ # Data access i repozitorijumi
```

## API Endpoints
- `GET /api/users/count` - Broj korisnika
- `GET /api/users/top-contributors` - Top korisnici
- `GET /api/users/{id}/exists` - Provera postojanja korisnika
- `GET /api/users/{id}/contributor-profile` - Profil korisnika

## Port
- **Development**: 5001
- **Docker**: 80

## Baza podataka
- **PostgreSQL** sa Entity Framework Core
- **Connection String**: `Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password`

## Komunikacija sa drugim servisima
- **Question Service**: HTTP klijent za validaciju pitanja
- **Answer Service**: HTTP klijent za validaciju odgovora
