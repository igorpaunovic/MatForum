/**
\page question_answer_service Question Answer API Service

## Pregled

**Question Answer API Service** je mikroservis za upravljanje odgovorima na forum pitanja u MatForum aplikaciji. Servis pruža CRUD operacije nad odgovorima, validaciju pitanja preko gRPC komunikacije i cascade delete funkcionalnost.

## Arhitektura

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────────┐   ┌─────────────────────┐
│ Question Answer │     │ User Management  │   │ Forum Question      │
│    Service      │◄──► │   Service        │   │   Service           │
│ (port 5004)     │     │ (port 5001)      │   │ (port 5002)         │
│                 │     │                  │   │                     │
│ REST API (HTTP) │     │ REST API (HTTP)  │   │ REST API (HTTP)     │
└────────┬────────┘     └──────────────────┘   └─────────────────────┘
         │
         │           gRPC Call preko HTTPS
         │         ValidateQuestion(questionId)
         └─────────────────────────────────────►
         │
         ↓
┌─────────────────┐     ┌─────────────────────┐
│ Question gRPC   │     │    PostgreSQL       │
│   Service       │     │    Database         │
│ (port 5010)     │     │   (matforum)        │
│                 │     │                     │
│ gRPC (HTTPS)    │     │ Entity Framework    │
└─────────────────┘     └─────────────────────┘
```

## Funkcionalnosti

### 1. CRUD Operacije nad Odgovorima
- **Kreiranje** novih odgovora sa validacijom pitanja
- **Čitanje** odgovora po ID-u
- **Ažuriranje** postojećih odgovora
- **Brisanje** odgovora
- **Lista** odgovora po pitanju

### 2. Validacija i Integritet
- **gRPC validacija** - Provera da li pitanje postoji i aktivno je
- **Cascade delete** - Brisanje odgovora kada se briše pitanje
- **User validacija** - Provera da li korisnik postoji

### 3. Statistike i Analitika
- **Broj odgovora** - Ukupan broj odgovora u sistemu
- **Odgovori po korisniku** - Lista odgovora određenog korisnika
- **Odgovori po pitanju** - Lista odgovora za određeno pitanje

### 4. Komunikacija sa Drugim Servisima
- **User Service** - Za validaciju korisnika i dobijanje imena
- **Question gRPC Service** - Za validaciju pitanja preko HTTPS gRPC

## API Endpoints

### Odgovori

#### GET /api/answers
**Opis**: Vraća listu svih odgovora sa paginacijom

**Query Parameters**:
- `page` (int, optional) - Broj stranice (default: 1)
- `pageSize` (int, optional) - Broj odgovora po stranici (default: 10)
- `sortBy` (string, optional) - Sortiranje (createdAt, updatedAt)
- `sortOrder` (string, optional) - Redosled (asc, desc)

**Response**:
```json
[
  {
    "id": "guid",
    "content": "Odgovor na pitanje o Clean Architecture...",
    "questionId": "guid",
    "createdByUserId": "guid",
    "authorName": "ana123",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z",
    "isAccepted": false
  }
]
```

#### GET /api/answers/{id}
**Opis**: Vraća odgovor po ID-u

**Parameters**:
- `id` (Guid) - ID odgovora

**Response**:
```json
{
  "id": "guid",
  "content": "Odgovor na pitanje o Clean Architecture...",
  "questionId": "guid",
  "createdByUserId": "guid",
  "authorName": "ana123",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z",
  "isAccepted": false
}
```

#### POST /api/answers
**Opis**: Kreira novi odgovor sa gRPC validacijom pitanja

**Request Body**:
```json
{
  "content": "Odgovor na pitanje o Clean Architecture...",
  "questionId": "guid",
  "userId": "guid"
}
```

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 201 Created sa kreiranim odgovorom

**Validacija**:
- Pitanje mora postojati i biti aktivno (gRPC validacija)
- Korisnik mora postojati (HTTP validacija)

#### PUT /api/answers/{id}
**Opis**: Ažurira postojeći odgovor

**Parameters**:
- `id` (Guid) - ID odgovora

**Request Body**:
```json
{
  "content": "Ažurirani odgovor na pitanje..."
}
```

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 200 OK sa ažuriranim odgovorom

#### DELETE /api/answers/{id}
**Opis**: Briše odgovor

**Parameters**:
- `id` (Guid) - ID odgovora

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 204 No Content

### Pretraga i Filtriranje

#### GET /api/answers/question/{questionId}
**Opis**: Vraća odgovore za određeno pitanje

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Response**: Lista odgovora za pitanje

#### GET /api/answers/user/{userId}
**Opis**: Vraća odgovore određenog korisnika

**Parameters**:
- `userId` (Guid) - ID korisnika

**Response**: Lista odgovora korisnika

### Statistike

#### GET /api/answers/count
**Opis**: Vraća ukupan broj odgovora

**Response**:
```json
{
  "count": 2500
}
```

#### GET /api/answers/count/question/{questionId}
**Opis**: Vraća broj odgovora za pitanje

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Response**:
```json
{
  "count": 15
}
```

#### GET /api/answers/count/user/{userId}
**Opis**: Vraća broj odgovora korisnika

**Parameters**:
- `userId` (Guid) - ID korisnika

**Response**:
```json
{
  "count": 45
}
```

### Cascade Delete

#### DELETE /api/answers/question/{questionId}
**Opis**: Briše sve odgovore za pitanje (cascade delete)

**Parameters**:
- `questionId` (Guid) - ID pitanja

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 204 No Content

**Napomena**: Ova metoda se poziva automatski kada se briše pitanje

## Struktura Projekta

```
MatForum.QuestionAnswer.API/
├── Controllers/
│   └── AnswersController.cs        # API kontroleri
├── Program.cs                       # Konfiguracija servisa
├── appsettings.json                 # Konfiguracija
├── appsettings.Development.json     # Development konfiguracija
├── Dockerfile                       # Docker konfiguracija
└── MatForum.QuestionAnswer.API.csproj

MatForum.QuestionAnswer.Application/
├── DTOs/                           # Data Transfer Objects
│   ├── AnswerDto.cs
│   ├── CreateAnswerCommand.cs
│   ├── UpdateAnswerCommand.cs
│   └── UserDto.cs
├── Interfaces/                     # Interfejsi
│   ├── IAnswerService.cs
│   ├── IAnswerRepository.cs
│   ├── IUserService.cs
│   └── IQuestionValidator.cs
└── Services/                       # Business logika
    └── AnswerService.cs

MatForum.QuestionAnswer.Domain/
└── Entities/                       # Domain entiteti
    └── Answer.cs

MatForum.QuestionAnswer.Infrastructure/
├── Data/                          # Entity Framework
│   └── AnswerDbContext.cs
├── Repositories/                  # Data access
│   └── EfAnswerRepository.cs
└── Services/                      # External servisi
    ├── UserServiceHttpClient.cs
    └── QuestionValidator.cs       # gRPC klijent
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
dotnet ef migrations add InitialCreate --project MatForum.QuestionAnswer.Infrastructure --startup-project MatForum.QuestionAnswer.API

# Ažuriraj bazu
dotnet ef database update --project MatForum.QuestionAnswer.Infrastructure --startup-project MatForum.QuestionAnswer.API
```

## Komunikacija sa Drugim Servisima

### User Service
**URL**: `http://user-service`
**Metode**:
- `GetByIdAsync(Guid userId)` - Dobijanje korisnika po ID-u
- `GetAnswerCountByUserIdAsync(Guid userId)` - Broj odgovora po korisniku

### Question gRPC Service
**URL**: `https://question-grpc-service`
**Port**: 5010
**Protokol**: HTTPS gRPC
**Metode**:
- `ValidateQuestion(ValidateQuestionRequest)` - Validacija pitanja

### gRPC Validacija Implementacija
```csharp
// QuestionValidator.cs
public async Task<bool> ExistsAsync(Guid questionId, CancellationToken cancellationToken)
{
    try
    {
        var request = new ValidateQuestionRequest { QuestionId = questionId.ToString() };
        var response = await _grpcClient.ValidateQuestionAsync(request, cancellationToken: cancellationToken);
        
        // Pitanje mora postojati I biti aktivno
        return response.Exists && response.IsActive;
    }
    catch (RpcException ex)
    {
        _logger.LogError(ex, "gRPC error while validating question {QuestionId}", questionId);
        return false;
    }
}
```

### HTTP Klijenti Konfiguracija
```csharp
// Program.cs
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service");
});

// gRPC klijent konfiguracija
builder.Services.AddGrpcClient<QuestionValidationService.QuestionValidationServiceClient>(options =>
{
    options.Address = new Uri("https://question-grpc-service");
})
.ConfigurePrimaryHttpMessageHandler(() =>
{
    var handler = new HttpClientHandler();
    // Accept self-signed certificates in development
    if (isDevelopment)
    {
        handler.ServerCertificateCustomValidationCallback = 
            HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
    }
    return handler;
});
```

## Autentifikacija i Autorizacija

### JWT Token Validacija
- **Validacija**: Na API Gateway nivou
- **Headers**: `X-User-Id`, `X-User-Name`, `X-User-Email`
- **Politika**: `authenticated` za zaštićene endpoint-e

### Zaštićeni Endpoint-i
- `POST /api/answers` - Kreiranje odgovora
- `PUT /api/answers/{id}` - Ažuriranje odgovora
- `DELETE /api/answers/{id}` - Brisanje odgovora
- `DELETE /api/answers/question/{questionId}` - Cascade delete

### Javni Endpoint-i
- `GET /api/answers` - Lista odgovora
- `GET /api/answers/{id}` - Detalji odgovora
- `GET /api/answers/question/{questionId}` - Odgovori za pitanje
- `GET /api/answers/user/{userId}` - Odgovori korisnika
- `GET /api/answers/count` - Broj odgovora
- `GET /api/answers/count/question/{questionId}` - Broj odgovora za pitanje
- `GET /api/answers/count/user/{userId}` - Broj odgovora korisnika

## Docker Konfiguracija

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MatForum.QuestionAnswer.API/MatForum.QuestionAnswer.API.csproj", "MatForum.QuestionAnswer.API/"]
# ... ostali COPY komandi
RUN dotnet restore "MatForum.QuestionAnswer.API/MatForum.QuestionAnswer.API.csproj"
COPY . .
WORKDIR "/src/MatForum.QuestionAnswer.API"
RUN dotnet build "MatForum.QuestionAnswer.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MatForum.QuestionAnswer.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.QuestionAnswer.API.dll"]
```

### Docker Compose
```yaml
answer-service:
  build:
    context: .
    dockerfile: src/Services/QuestionAnswer/MatForum.QuestionAnswer.API/Dockerfile
  container_name: answer-service
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password
  ports:
    - "5004:80"
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
cd MatForum.QuestionAnswer.API
dotnet run
```

### Development sa Hot Reload
```bash
cd MatForum.QuestionAnswer.API
dotnet watch run
```

## Testiranje

### Swagger UI
- **URL**: http://localhost:5004/swagger
- **Dostupno**: Samo u Development modu

### cURL Primeri

#### 1. Lista odgovora
```bash
curl -X GET "http://localhost:5004/api/answers?page=1&pageSize=10" \
  -H "accept: application/json"
```

#### 2. Kreiranje odgovora (sa gRPC validacijom)
```bash
curl -X POST "http://localhost:5004/api/answers" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 12345678-1234-1234-1234-123456789012" \
  -d '{
    "content": "Odgovor na pitanje o Clean Architecture...",
    "questionId": "87654321-4321-4321-4321-210987654321",
    "userId": "12345678-1234-1234-1234-123456789012"
  }'
```

#### 3. Odgovori za pitanje
```bash
curl -X GET "http://localhost:5004/api/answers/question/87654321-4321-4321-4321-210987654321" \
  -H "accept: application/json"
```

#### 4. Broj odgovora
```bash
curl -X GET "http://localhost:5004/api/answers/count" \
  -H "accept: application/json"
```

#### 5. Cascade delete odgovora
```bash
curl -X DELETE "http://localhost:5004/api/answers/question/87654321-4321-4321-4321-210987654321" \
  -H "X-User-Id: 12345678-1234-1234-1234-123456789012"
```

## Logovanje

### Strukturisani Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "Answer created successfully",
  "AnswerId": "12345678-1234-1234-1234-123456789012",
  "QuestionId": "87654321-4321-4321-4321-210987654321",
  "UserId": "11111111-1111-1111-1111-111111111111",
  "Service": "QuestionAnswer"
}
```

### gRPC Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "Question validation result",
  "QuestionId": "87654321-4321-4321-4321-210987654321",
  "Exists": true,
  "IsActive": true,
  "Message": "Question is valid and active"
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
curl http://localhost:5004/health
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

### Problem: "Question not found" greška
**Proveri**:
1. Da li pitanje zaista postoji?
   ```bash
   curl http://localhost:5002/api/questions/QUESTION_ID
   ```

2. Da li je pitanje obrisano?
   ```bash
   curl http://localhost:5002/api/questions/QUESTION_ID
   # Proveri: "isDeleted": true/false
   ```

3. Da li question-grpc-service radi?
   ```bash
   docker ps | grep question-grpc
   docker logs question-grpc-service --tail 20
   ```

4. Da li answer-service može da komunicira sa gRPC servisom?
   ```bash
   docker logs answer-service --tail 50 | grep "gRPC"
   ```

### Problem: gRPC connection error
**Proveri**:
```bash
# Da li question-grpc-service sluša HTTPS?
docker logs question-grpc-service | grep "listening"
# Mora biti: "Now listening on: https://[::]:443"

# Da li certifikati postoje?
ls -la certs/
# Mora sadržati: grpc-cert.pfx

# Da li je volume mount ispravan?
docker inspect question-grpc-service | grep -A 5 "Mounts"
```

### Problem: "User service unavailable"
**Proveri**:
1. Da li user-service radi?
   ```bash
   docker ps | grep user-service
   ```

2. Da li su HTTP klijenti konfigurisani?
   ```bash
   docker logs answer-service --tail 50 | grep "HTTP"
   ```

### Problem: Database connection error
**Proveri**:
1. Da li PostgreSQL radi?
   ```bash
   docker ps | grep postgres
   ```

2. Da li je connection string ispravan?
   ```bash
   docker logs answer-service --tail 20 | grep "Connection"
   ```

## Performance Optimizacije

### Caching
- **Redis**: Za često korišćene podatke
- **In-Memory**: Za top odgovore
- **TTL**: 5 minuta za statistike

### Database Optimizacije
- **Indexi**: Na `Id`, `QuestionId`, `CreatedByUserId`, `CreatedAt`
- **Pagination**: Za liste odgovora
- **Async/Await**: Za sve I/O operacije

### HTTP Klijenti
- **Connection Pooling**: Reuse HTTP konekcija
- **Timeout**: 30 sekundi za external servise
- **Retry Policy**: 3 pokušaja sa exponential backoff

### gRPC Optimizacije
- **Connection Pooling**: Reuse gRPC konekcija
- **Timeout**: 10 sekundi za gRPC pozive
- **Retry Policy**: 3 pokušaja za gRPC greške

## Security

### Input Validacija
- **Content**: 10-10000 karaktera
- **XSS Protection**: HTML encoding
- **SQL Injection**: Parameterized queries

### Data Protection
- **User Data**: Personal information
- **Content**: Forum sadržaj
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
docker ps | grep answer-service

# 2. Health check
curl http://localhost:5004/health

# 3. API endpoint
curl http://localhost:5004/api/answers/count

# 4. Swagger UI
open http://localhost:5004/swagger

# 5. gRPC komunikacija
docker logs answer-service --tail 30 | grep "Question validation"

# 6. Logovi
docker logs answer-service --tail 20
```

## NuGet Paketi

### Glavni Paketi
- `Microsoft.AspNetCore.App` 8.0.0
- `Microsoft.EntityFrameworkCore` 8.0.0
- `Microsoft.EntityFrameworkCore.Design` 8.0.0
- `Npgsql.EntityFrameworkCore.PostgreSQL` 8.0.0
- `Microsoft.Extensions.Http` 8.0.0
- `Swashbuckle.AspNetCore` 6.5.0

### gRPC Paketi
- `Google.Protobuf` 3.29.1
- `Grpc.Net.ClientFactory` 2.67.0
- `Grpc.Tools` 2.68.1

### Development Paketi
- `Microsoft.EntityFrameworkCore.Tools` 8.0.0
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` 1.19.5

## Status

✅ CRUD operacije implementirane  
✅ gRPC validacija funkcioniše  
✅ HTTP klijenti konfigurisani  
✅ Cascade delete implementiran  
✅ Docker konfigurisan  
✅ Swagger dokumentacija  
✅ Health checks  
✅ Testovano i verifikovano  

## Autor

Implementirano: 14. Oktobar 2025  
Branch: main  
Pristup: Clean Architecture sa mikroservisima i gRPC

---

**Za dodatne informacije, proveri kod ili logove Docker kontejnera!**

*/
