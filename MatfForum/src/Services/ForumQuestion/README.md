# Forum Question Service

## Opis
Mikroservis za upravljanje forum pitanjima, kategorijama i pretragom u MatForum aplikaciji.

## Funkcionalnosti
- Kreiranje, čitanje, ažuriranje i brisanje pitanja
- Pretraga pitanja po naslovu i sadržaju
- Upravljanje tagovima
- Cascade delete odgovora pri brisanju pitanja
- Komunikacija sa User i Answer servisima

## Struktura
```
ForumQuestion/
├── MatForum.ForumQuestion.API/          # Web API kontroleri
├── MatForum.ForumQuestion.Application/  # Business logika i servisi
├── MatForum.ForumQuestion.Domain/       # Domain entiteti
├── MatForum.ForumQuestion.Infrastructure/ # Data access i repozitorijumi
└── MatForum.ForumQuestion.GRPC/         # gRPC servis za validaciju
```

## API Endpoints
- `GET /api/questions` - Lista svih pitanja
- `POST /api/questions` - Kreiranje novog pitanja
- `GET /api/questions/{id}` - Detalji pitanja
- `PUT /api/questions/{id}` - Ažuriranje pitanja
- `DELETE /api/questions/{id}` - Brisanje pitanja
- `GET /api/questions/search?q={term}` - Pretraga pitanja

## Port
- **API**: 5002
- **gRPC**: 5010 (HTTPS)

## Baza podataka
- **PostgreSQL** sa Entity Framework Core
- **Connection String**: `Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password`

## Komunikacija sa drugim servisima
- **User Service**: HTTP klijent za validaciju korisnika
- **Answer Service**: HTTP klijent za cascade delete odgovora
- **gRPC Service**: Validacija pitanja preko gRPC protokola

## gRPC Servis
- **Port**: 5010
- **Protokol**: HTTPS
- **Funkcija**: Validacija pitanja za Answer servis
