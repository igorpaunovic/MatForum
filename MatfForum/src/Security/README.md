# Identity Server Service

## Opis
Mikroservis za autentifikaciju i autorizaciju korisnika u MatForum aplikaciji.

## Funkcionalnosti
- Registracija novih korisnika
- Prijava postojećih korisnika
- Generisanje JWT tokena
- Validacija korisničkih podataka
- Komunikacija sa User Management servisom

## Struktura
```
Security/
├── MatForum.IdentityServer.API/          # Web API kontroleri
├── MatForum.IdentityServer.Application/  # Business logika i servisi
├── MatForum.IdentityServer.Domain/       # Domain entiteti
└── MatForum.IdentityServer.Infrastructure/ # Data access i repozitorijumi
```

## API Endpoints
- `POST /api/auth/register` - Registracija korisnika
- `POST /api/auth/login` - Prijava korisnika
- `POST /api/authentication/register` - Alternativna registracija
- `POST /api/authentication/login` - Alternativna prijava

## Port
- **Development**: 5005
- **Docker**: 80

## Baza podataka
- **PostgreSQL** sa Entity Framework Core
- **Connection String**: `Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password`

## JWT Konfiguracija
- **Issuer**: "Webstore Identity"
- **Audience**: "Webstore"
- **Signing Key**: "MyVerySecretSecretMessage1"
- **Claims**: NameIdentifier, Name, Email, Role

## Komunikacija sa drugim servisima
- **User Management Service**: HTTP klijent za kreiranje korisničkih profila
- **API Gateway**: JWT tokeni se koriste za autentifikaciju

## Sigurnost
- JWT tokeni se koriste za autentifikaciju
- Password hashing se vrši pre čuvanja u bazi
- CORS je konfigurisan za frontend aplikaciju
- Validacija input podataka
