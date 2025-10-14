/**
\page voting_service Voting API Service

## Pregled

**Voting API Service** je mikroservis za upravljanje glasanjem (upvote/downvote) na pitanja i odgovore u MatForum aplikaciji. Servis pruža funkcionalnosti za glasanje, praćenje glasova i statistike glasanja.

## Arhitektura

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────────┐   ┌─────────────────────┐
│ Voting Service  │     │ User Management  │   │ Forum Question      │
│ (port 5005)     │◄──► │   Service        │   │   Service           │
│                 │     │ (port 5001)      │   │ (port 5002)         │
│ REST API (HTTP) │     │ REST API (HTTP)  │   │ REST API (HTTP)     │
└────────┬────────┘     └──────────────────┘   └─────────────────────┘
         │
         ↓
┌──────────────────────────┐
│    PostgreSQL Database   │
│    (matforum)            │
└──────────────────────────┘
```

## Funkcionalnosti

### 1. Glasanje na Pitanja
- **Upvote** - Pozitivno glasanje na pitanje
- **Downvote** - Negativno glasanje na pitanje
- **Uklanjanje glasa** - Poništavanje prethodnog glasa
- **Promena glasa** - Promena iz upvote u downvote i obrnuto

### 2. Glasanje na Odgovore
- **Upvote** - Pozitivno glasanje na odgovor
- **Downvote** - Negativno glasanje na odgovor
- **Uklanjanje glasa** - Poništavanje prethodnog glasa
- **Promena glasa** - Promena iz upvote u downvote i obrnuto

### 3. Statistike i Analitika
- **Ukupan broj glasova** - Za pitanje ili odgovor
- **Broj upvote-ova** - Pozitivni glasovi
- **Broj downvote-ova** - Negativni glasovi
- **Glasovi po korisniku** - Lista glasova određenog korisnika

### 4. Validacija i Integritet
- **User validacija** - Provera da li korisnik postoji
- **Duplikat glasovi** - Sprečavanje višestrukog glasanja
- **Vote history** - Istorija glasanja korisnika

## API Endpoints

### Glasanje na Pitanja

#### POST /api/votes/question/{questionId}/upvote
**Opis**: Upvote na pitanje

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 200 OK
```json
{
  "id": "guid",
  "entityId": "guid",
  "entityType": "Question",
  "userId": "guid",
  "voteType": "Upvote",
  "createdAt": "2025-01-01T10:00:00Z"
}
```

#### POST /api/votes/question/{questionId}/downvote
**Opis**: Downvote na pitanje

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 200 OK sa glasom

#### DELETE /api/votes/question/{questionId}
**Opis**: Uklanja glas sa pitanja

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 204 No Content

### Glasanje na Odgovore

#### POST /api/votes/answer/{answerId}/upvote
**Opis**: Upvote na odgovor

**Parameters**:
- `answerId` (Guid) - ID odgovora

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 200 OK sa glasom

#### POST /api/votes/answer/{answerId}/downvote
**Opis**: Downvote na odgovor

**Parameters**:
- `answerId` (Guid) - ID odgovora

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 200 OK sa glasom

#### DELETE /api/votes/answer/{answerId}
**Opis**: Uklanja glas sa odgovora

**Parameters**:
- `answerId` (Guid) - ID odgovora

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 204 No Content

### Statistike

#### GET /api/votes/question/{questionId}/stats
**Opis**: Statistike glasanja za pitanje

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Response**:
```json
{
  "entityId": "guid",
  "entityType": "Question",
  "totalVotes": 25,
  "upvotes": 20,
  "downvotes": 5,
  "score": 15
}
```

#### GET /api/votes/answer/{answerId}/stats
**Opis**: Statistike glasanja za odgovor

**Parameters**:
- `answerId` (Guid) - ID odgovora

**Response**:
```json
{
  "entityId": "guid",
  "entityType": "Answer",
  "totalVotes": 12,
  "upvotes": 10,
  "downvotes": 2,
  "score": 8
}
```

#### GET /api/votes/user/{userId}
**Opis**: Glasovi određenog korisnika

**Parameters**:
- `userId` (Guid) - ID korisnika

**Response**:
```json
[
  {
    "id": "guid",
    "entityId": "guid",
    "entityType": "Question",
    "userId": "guid",
    "voteType": "Upvote",
    "createdAt": "2025-01-01T10:00:00Z"
  }
]
```

#### GET /api/votes/user/{userId}/stats
**Opis**: Statistike glasanja korisnika

**Parameters**:
- `userId` (Guid) - ID korisnika

**Response**:
```json
{
  "userId": "guid",
  "totalVotes": 50,
  "upvotes": 35,
  "downvotes": 15,
  "questionsVoted": 20,
  "answersVoted": 30
}
```

### Pregled Glasa

#### GET /api/votes/question/{questionId}/user/{userId}
**Opis**: Proverava glas korisnika na pitanje

**Parameters**:
- `questionId` (Guid) - ID pitanja
- `userId` (Guid) - ID korisnika

**Response**:
```json
{
  "hasVoted": true,
  "voteType": "Upvote",
  "votedAt": "2025-01-01T10:00:00Z"
}
```

#### GET /api/votes/answer/{answerId}/user/{userId}
**Opis**: Proverava glas korisnika na odgovor

**Parameters**:
- `answerId` (Guid) - ID odgovora
- `userId` (Guid) - ID korisnika

**Response**:
```json
{
  "hasVoted": true,
  "voteType": "Downvote",
  "votedAt": "2025-01-01T10:00:00Z"
}
```

## Struktura Projekta

```
MatForum.Voting.API/
├── Controllers/
│   └── VotesController.cs          # API kontroleri
├── Program.cs                       # Konfiguracija servisa
├── appsettings.json                 # Konfiguracija
├── appsettings.Development.json     # Development konfiguracija
├── Dockerfile                       # Docker konfiguracija
└── MatForum.Voting.API.csproj

MatForum.Voting.Application/
├── DTOs/                           # Data Transfer Objects
│   ├── VoteDto.cs
│   ├── VoteStatsDto.cs
│   ├── UserVoteStatsDto.cs
│   └── UserVoteDto.cs
├── Interfaces/                     # Interfejsi
│   ├── IVotingService.cs
│   ├── IVoteRepository.cs
│   └── IUserService.cs
└── Services/                       # Business logika
    └── VotingService.cs

MatForum.Voting.Domain/
└── Entities/                       # Domain entiteti
    └── Vote.cs

MatForum.Voting.Infrastructure/
├── Data/                          # Entity Framework
│   └── VotingDbContext.cs
├── Repositories/                  # Data access
│   └── EfVoteRepository.cs
└── Clients/                       # HTTP klijenti
    └── UserServiceHttpClient.cs
```

## Baza Podataka

### PostgreSQL Konfiguracija
- **Host**: postgres (Docker) / localhost (Development)
- **Port**: 5432 (Docker) / 15432 (Development)
- **Database**: matforum
- **Username**: matforum_user
- **Password**: matforum_password

### Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password"
  }
}
```

### Entity Framework Migracije
```bash
# Dodaj migraciju
dotnet ef migrations add InitialCreate --project MatForum.Voting.Infrastructure --startup-project MatForum.Voting.API

# Ažuriraj bazu
dotnet ef database update --project MatForum.Voting.Infrastructure --startup-project MatForum.Voting.API
```

## Komunikacija sa Drugim Servisima

### User Service
**URL**: `http://user-service`
**Metode**:
- `GetByIdAsync(Guid userId)` - Dobijanje korisnika po ID-u
- `GetVoteCountByUserIdAsync(Guid userId)` - Broj glasova po korisniku

### HTTP Klijenti Konfiguracija
```csharp
// Program.cs
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service");
});
```

## Autentifikacija i Autorizacija

### JWT Token Validacija
- **Validacija**: Na API Gateway nivou
- **Headers**: `X-User-Id`, `X-User-Name`, `X-User-Email`
- **Politika**: `authenticated` za zaštićene endpoint-e

### Zaštićeni Endpoint-i
- `POST /api/votes/question/{questionId}/upvote` - Upvote na pitanje
- `POST /api/votes/question/{questionId}/downvote` - Downvote na pitanje
- `POST /api/votes/answer/{answerId}/upvote` - Upvote na odgovor
- `POST /api/votes/answer/{answerId}/downvote` - Downvote na odgovor
- `DELETE /api/votes/question/{questionId}` - Uklanjanje glasa sa pitanja
- `DELETE /api/votes/answer/{answerId}` - Uklanjanje glasa sa odgovora

### Javni Endpoint-i
- `GET /api/votes/question/{questionId}/stats` - Statistike pitanja
- `GET /api/votes/answer/{answerId}/stats` - Statistike odgovora
- `GET /api/votes/user/{userId}` - Glasovi korisnika
- `GET /api/votes/user/{userId}/stats` - Statistike korisnika
- `GET /api/votes/question/{questionId}/user/{userId}` - Glas korisnika na pitanje
- `GET /api/votes/answer/{answerId}/user/{userId}` - Glas korisnika na odgovor

## Docker Konfiguracija

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MatForum.Voting.API/MatForum.Voting.API.csproj", "MatForum.Voting.API/"]
# ... ostali COPY komandi
RUN dotnet restore "MatForum.Voting.API/MatForum.Voting.API.csproj"
COPY . .
WORKDIR "/src/MatForum.Voting.API"
RUN dotnet build "MatForum.Voting.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MatForum.Voting.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.Voting.API.dll"]
```

### Docker Compose
```yaml
voting-service:
  build:
    context: .
    dockerfile: src/Services/Voting/MatForum.Voting.API/Dockerfile
  container_name: voting-service
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password
  ports:
    - "5005:80"
  depends_on:
    postgres:
      condition: service_healthy
  restart: on-failure
```

## Pokretanje

### Docker Compose (Preporučeno)
```bash
cd /Users/factoryww/MatForum/MatfForum
docker-compose up --build -d
```

### Lokalno Pokretanje
```bash
cd MatForum.Voting.API
dotnet run
```

### Development sa Hot Reload
```bash
cd MatForum.Voting.API
dotnet watch run
```

## Testiranje

### Swagger UI
- **URL**: http://localhost:5005/swagger
- **Dostupno**: Samo u Development modu

### cURL Primeri

#### 1. Upvote na pitanje
```bash
curl -X POST "http://localhost:5005/api/votes/question/12345678-1234-1234-1234-123456789012/upvote" \
  -H "accept: application/json" \
  -H "X-User-Id: 87654321-4321-4321-4321-210987654321"
```

#### 2. Downvote na odgovor
```bash
curl -X POST "http://localhost:5005/api/votes/answer/11111111-1111-1111-1111-111111111111/downvote" \
  -H "accept: application/json" \
  -H "X-User-Id: 87654321-4321-4321-4321-210987654321"
```

#### 3. Statistike pitanja
```bash
curl -X GET "http://localhost:5005/api/votes/question/12345678-1234-1234-1234-123456789012/stats" \
  -H "accept: application/json"
```

#### 4. Glas korisnika na pitanje
```bash
curl -X GET "http://localhost:5005/api/votes/question/12345678-1234-1234-1234-123456789012/user/87654321-4321-4321-4321-210987654321" \
  -H "accept: application/json"
```

#### 5. Uklanjanje glasa
```bash
curl -X DELETE "http://localhost:5005/api/votes/question/12345678-1234-1234-1234-123456789012" \
  -H "X-User-Id: 87654321-4321-4321-4321-210987654321"
```

## Logovanje

### Strukturisani Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "Vote created successfully",
  "VoteId": "12345678-1234-1234-1234-123456789012",
  "EntityId": "87654321-4321-4321-4321-210987654321",
  "EntityType": "Question",
  "UserId": "11111111-1111-1111-1111-111111111111",
  "VoteType": "Upvote",
  "Service": "Voting"
}
```

### Log Nivoi
- **Information**: Uspešne operacije
- **Warning**: Potencijalni problemi
- **Error**: Greške u operacijama
- **Debug**: Detaljne informacije (samo Development)

## Monitoring i Health Checks

### Health Check Endpoint
```bash
curl http://localhost:5005/health
```

### Docker Health Check
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:80/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Troubleshooting

### Problem: "User not found" greška
**Proveri**:
1. Da li korisnik zaista postoji?
   ```bash
   curl http://localhost:5001/api/users/USER_ID
   ```

2. Da li user-service radi?
   ```bash
   docker ps | grep user-service
   ```

### Problem: "Duplicate vote" greška
**Proveri**:
1. Da li korisnik već glasao?
   ```bash
   curl http://localhost:5005/api/votes/question/QUESTION_ID/user/USER_ID
   ```

2. Da li je glas već uklonjen?
   ```bash
   curl http://localhost:5005/api/votes/question/QUESTION_ID/stats
   ```

### Problem: "Entity not found" greška
**Proveri**:
1. Da li pitanje/odgovor postoji?
   ```bash
   # Za pitanje
   curl http://localhost:5002/api/questions/QUESTION_ID
   
   # Za odgovor
   curl http://localhost:5004/api/answers/ANSWER_ID
   ```

### Problem: Database connection error
**Proveri**:
1. Da li PostgreSQL radi?
   ```bash
   docker ps | grep postgres
   ```

2. Da li je connection string ispravan?
   ```bash
   docker logs voting-service --tail 20 | grep "Connection"
   ```

## Performance Optimizacije

### Caching
- **Redis**: Za često korišćene statistike
- **In-Memory**: Za top glasove
- **TTL**: 5 minuta za statistike

### Database Optimizacije
- **Indexi**: Na `EntityId`, `UserId`, `EntityType`, `CreatedAt`
- **Async/Await**: Za sve I/O operacije
- **Batch Operations**: Za bulk operacije

### HTTP Klijenti
- **Connection Pooling**: Reuse HTTP konekcija
- **Timeout**: 30 sekundi za external servise
- **Retry Policy**: 3 pokušaja sa exponential backoff

## Security

### Input Validacija
- **EntityId**: Valid GUID format
- **UserId**: Valid GUID format
- **VoteType**: Enum validacija (Upvote, Downvote)

### Data Protection
- **User Data**: Personal information
- **Vote Data**: Anonimnost glasanja
- **Audit Log**: Svi pristupi podacima

## Deployment

### Production Checklist
- [ ] Environment variables konfigurisani
- [ ] Database migracije pokrenute
- [ ] Health checks konfigurisani
- [ ] Logging konfigurisan
- [ ] Monitoring setup
- [ ] SSL/TLS certifikati
- [ ] Backup strategija

### Environment Variables
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=prod-db;Database=matforum;Username=prod_user;Password=secure_password
Logging__LogLevel__Default=Warning
```

## Verifikacija

Proveri da sve radi:

```bash
# 1. Servis pokrenut?
docker ps | grep voting-service

# 2. Health check
curl http://localhost:5005/health

# 3. API endpoint
curl http://localhost:5005/api/votes/question/12345678-1234-1234-1234-123456789012/stats

# 4. Swagger UI
open http://localhost:5005/swagger

# 5. Logovi
docker logs voting-service --tail 20
```

## NuGet Paketi

### Glavni Paketi
- `Microsoft.AspNetCore.App` 8.0.0
- `Microsoft.EntityFrameworkCore` 8.0.0
- `Microsoft.EntityFrameworkCore.Design` 8.0.0
- `Npgsql.EntityFrameworkCore.PostgreSQL` 8.0.0
- `Microsoft.Extensions.Http` 8.0.0
- `Swashbuckle.AspNetCore` 6.5.0

### Development Paketi
- `Microsoft.EntityFrameworkCore.Tools` 8.0.0
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` 1.19.5

## Status

✅ CRUD operacije implementirane  
✅ Glasanje funkcioniše  
✅ Statistike implementirane  
✅ HTTP klijenti konfigurisani  
✅ Docker konfigurisan  
✅ Swagger dokumentacija  
✅ Health checks  
✅ Testovano i verifikovano  

## Autor

Implementirano: 14. Oktobar 2025  
Branch: main  
Pristup: Clean Architecture sa mikroservisima

---

**Za dodatne informacije, proveri kod ili logove Docker kontejnera!**

*/
