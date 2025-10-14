# Voting Service

## Opis
Mikroservis za upravljanje glasanjem (upvote/downvote) na pitanja i odgovore u MatForum aplikaciji.

## Funkcionalnosti
- Upvote i downvote funkcionalnost
- Praćenje glasova korisnika
- Računanje ukupnih rezultata glasanja
- Validacija glasova (jedan glas po korisniku)

## Struktura
```
Voting/
├── MatForum.Voting.API/          # Web API kontroleri
├── MatForum.Voting.Application/  # Business logika i servisi
├── MatForum.Voting.Domain/       # Domain entiteti
└── MatForum.Voting.Infrastructure/ # Data access i repozitorijumi
```

## API Endpoints
- `GET /api/votes` - Lista glasova
- `POST /api/votes` - Kreiranje novog glasa
- `GET /api/votes/summary/{entityId}` - Rezime glasova za entitet
- `DELETE /api/votes/{id}` - Brisanje glasa
- `PUT /api/votes/{id}` - Ažuriranje glasa

## Port
- **Development**: 5003
- **Docker**: 80

## Baza podataka
- **PostgreSQL** sa Entity Framework Core
- **Connection String**: `Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password`

## Tipovi glasova
- **Upvote**: Pozitivan glas (+1)
- **Downvote**: Negativan glas (-1)

## Validacija
- Jedan korisnik može glasati samo jednom za isti entitet
- Promena glasa je dozvoljena (brisanje starog, kreiranje novog)
- Validacija korisnika se vrši na API Gateway nivou

## Integracija
- Komunicira sa frontend aplikacijom preko API Gateway-a
- Ne komunicira direktno sa drugim mikroservisima
- JWT tokeni se validiraju na API Gateway nivou