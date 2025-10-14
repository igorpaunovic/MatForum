# Question Answer Service

## Opis
Mikroservis za upravljanje odgovorima na forum pitanja u MatForum aplikaciji.

## Funkcionalnosti
- Kreiranje, čitanje, ažuriranje i brisanje odgovora
- Validacija odgovora preko gRPC servisa
- Komunikacija sa User servisom za validaciju korisnika
- Cascade delete odgovora kada se briše pitanje

## Struktura
```
QuestionAnswer/
├── MatForum.QuestionAnswer.API/          # Web API kontroleri
├── MatForum.QuestionAnswer.Application/  # Business logika i servisi
├── MatForum.QuestionAnswer.Domain/       # Domain entiteti
└── MatForum.QuestionAnswer.Infrastructure/ # Data access i repozitorijumi
```

## API Endpoints
- `GET /api/answers` - Lista svih odgovora
- `POST /api/answers` - Kreiranje novog odgovora
- `GET /api/answers/{id}` - Detalji odgovora
- `PUT /api/answers/{id}` - Ažuriranje odgovora
- `DELETE /api/answers/{id}` - Brisanje odgovora
- `DELETE /api/answers/question/{questionId}` - Brisanje svih odgovora za pitanje

## Port
- **Development**: 5004
- **Docker**: 80

## Baza podataka
- **PostgreSQL** sa Entity Framework Core
- **Connection String**: `Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password`

## Komunikacija sa drugim servisima
- **User Service**: HTTP klijent za validaciju korisnika
- **Question gRPC Service**: gRPC klijent za validaciju pitanja
  - **URL**: `https://question-grpc-service`
  - **Port**: 5010
  - **Protokol**: HTTPS sa self-signed sertifikatima u development-u

## Validacija
- Odgovori se validiraju preko Question gRPC servisa
- Korisnici se validiraju preko User HTTP servisa
- Cascade delete se poziva iz Question servisa
