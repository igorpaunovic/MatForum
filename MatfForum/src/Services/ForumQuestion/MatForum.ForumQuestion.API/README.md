/**
\page forum_question_service Forum Question API Service

## Pregled

**Forum Question API Service** je mikroservis za upravljanje forum pitanjima u MatForum aplikaciji. Servis pruža CRUD operacije nad pitanjima, pretragu, upravljanje tagovima i cascade delete funkcionalnost za povezane odgovore.

## Arhitektura

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────────┐   ┌─────────────────────┐
│ Forum Question  │     │ User Management  │   │ Question Answer     │
│    Service      │◄──► │   Service        │   │     Service         │
│ (port 5002)     │     │ (port 5001)      │   │ (port 5004)         │
│                 │     │                  │   │                     │
│ REST API (HTTP) │     │ REST API (HTTP)  │   │ REST API (HTTP)     │
└────────┬────────┘     └──────────────────┘   └─────────────────────┘
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

### 1. CRUD Operacije nad Pitanjima
- **Kreiranje** novih pitanja sa tagovima
- **Čitanje** pitanja po ID-u (sa increment view count)
- **Ažuriranje** postojećih pitanja
- **Brisanje** pitanja (sa cascade delete odgovora)
- **Lista** svih pitanja sa paginacijom

### 2. Pretraga i Filtriranje
- **Tekst pretraga** - Po naslovu i sadržaju
- **Tag pretraga** - Po tagovima
- **Sortiranje** - Po datumu, broju pregleda, popularnosti
- **Paginacija** - Za velike liste pitanja

### 3. Statistike i Analitika
- **Broj pitanja** - Ukupan broj pitanja u sistemu
- **Pitanja po korisniku** - Lista pitanja određenog korisnika
- **Slična pitanja** - Preporučena pitanja na osnovu tagova
- **View count** - Broj pregleda pitanja

### 4. Komunikacija sa Drugim Servisima
- **User Service** - Za validaciju korisnika i dobijanje imena
- **Answer Service** - Za cascade delete odgovora
- **gRPC Service** - Za validaciju pitanja

## API Endpoints

### Pitanja

#### GET /api/questions
**Opis**: Vraća listu svih pitanja sa paginacijom

**Query Parameters**:
- `page` (int, optional) - Broj stranice (default: 1)
- `pageSize` (int, optional) - Broj pitanja po stranici (default: 10)
- `sortBy` (string, optional) - Sortiranje (createdAt, views, title)
- `sortOrder` (string, optional) - Redosled (asc, desc)

**Response**:
```json
[
  {
    "id": "guid",
    "title": "Kako da implementiram Clean Architecture?",
    "content": "Pitanje o implementaciji Clean Architecture pattern-a...",
    "createdByUserId": "guid",
    "authorName": "marko123",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z",
    "views": 150,
    "isClosed": false,
    "tags": ["csharp", "architecture", "clean-code"]
  }
]
```

#### GET /api/questions/{id}
**Opis**: Vraća pitanje po ID-u i povećava broj pregleda

**Parameters**:
- `id` (Guid) - ID pitanja

**Response**:
```json
{
  "id": "guid",
  "title": "Kako da implementiram Clean Architecture?",
  "content": "Pitanje o implementaciji Clean Architecture pattern-a...",
  "createdByUserId": "guid",
  "authorName": "marko123",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z",
  "views": 151,
  "isClosed": false,
  "tags": ["csharp", "architecture", "clean-code"]
}
```

#### POST /api/questions
**Opis**: Kreira novo pitanje

**Request Body**:
```json
{
  "title": "Kako da implementiram Clean Architecture?",
  "content": "Pitanje o implementaciji Clean Architecture pattern-a...",
  "tags": ["csharp", "architecture", "clean-code"]
}
```

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 201 Created sa kreiranim pitanjem

#### PUT /api/questions/{id}
**Opis**: Ažurira postojeće pitanje

**Parameters**:
- `id` (Guid) - ID pitanja

**Request Body**:
```json
{
  "title": "Ažurirano pitanje o Clean Architecture",
  "content": "Ažurirani sadržaj pitanja...",
  "tags": ["csharp", "architecture", "clean-code", "updated"]
}
```

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 200 OK sa ažuriranim pitanjem

#### DELETE /api/questions/{id}
**Opis**: Briše pitanje i sve povezane odgovore (cascade delete)

**Parameters**:
- `id` (Guid) - ID pitanja

**Headers**:
- `X-User-Id` - ID korisnika (dodaje API Gateway)

**Response**: 204 No Content

### Pretraga

#### GET /api/questions/search?q={searchTerm}
**Opis**: Pretražuje pitanja po naslovu i sadržaju

**Query Parameters**:
- `q` (string, required) - Termin za pretragu
- `page` (int, optional) - Broj stranice
- `pageSize` (int, optional) - Broj rezultata po stranici

**Response**:
```json
[
  {
    "id": "guid",
    "title": "Kako da implementiram Clean Architecture?",
    "content": "Pitanje o implementaciji...",
    "createdByUserId": "guid",
    "authorName": "marko123",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z",
    "views": 150,
    "isClosed": false,
    "tags": ["csharp", "architecture", "clean-code"]
  }
]
```

#### GET /api/questions/tag/{tag}
**Opis**: Vraća pitanja sa određenim tagom

**Parameters**:
- `tag` (string) - Naziv taga

**Response**: Lista pitanja sa određenim tagom

### Statistike

#### GET /api/questions/count
**Opis**: Vraća ukupan broj pitanja

**Response**:
```json
{
  "count": 1250
}
```

#### GET /api/questions/user/{userId}
**Opis**: Vraća pitanja određenog korisnika

**Parameters**:
- `userId` (Guid) - ID korisnika

**Response**: Lista pitanja određenog korisnika

#### GET /api/questions/{id}/similar?count=3
**Opis**: Vraća slična pitanja na osnovu tagova

**Parameters**:
- `id` (Guid) - ID pitanja
- `count` (int, optional) - Broj sličnih pitanja (default: 3)

**Response**:
```json
[
  {
    "id": "guid",
    "title": "Slično pitanje o Clean Architecture",
    "content": "Sličan sadržaj...",
    "createdByUserId": "guid",
    "authorName": "ana123",
    "createdAt": "2025-01-01T09:00:00Z",
    "updatedAt": "2025-01-01T09:00:00Z",
    "views": 75,
    "isClosed": false,
    "tags": ["csharp", "architecture"]
  }
]
```

## Struktura Projekta

```
MatForum.ForumQuestion.API/
├── Controllers/
│   └── QuestionsController.cs       # API kontroleri
├── Program.cs                       # Konfiguracija servisa
├── appsettings.json                 # Konfiguracija
├── appsettings.Development.json     # Development konfiguracija
├── Dockerfile                       # Docker konfiguracija
└── MatForum.ForumQuestion.API.csproj

MatForum.ForumQuestion.Application/
├── DTOs/                           # Data Transfer Objects
│   ├── QuestionDto.cs
│   ├── CreateQuestionCommand.cs
│   ├── UpdateQuestionCommand.cs
│   └── UserDto.cs
├── Interfaces/                     # Interfejsi
│   ├── IForumQuestionService.cs
│   ├── IQuestionRepository.cs
│   ├── IUserService.cs
│   └── IAnswerServiceClient.cs
└── Services/                       # Business logika
    └── QuestionService.cs

MatForum.ForumQuestion.Domain/
└── Entities/                       # Domain entiteti
    └── Question.cs

MatForum.ForumQuestion.Infrastructure/
├── Data/                          # Entity Framework
│   └── QuestionDbContext.cs
├── Repositories/                  # Data access
│   └── EfQuestionRepository.cs
└── Clients/                       # HTTP klijenti
    ├── UserServiceHttpClient.cs
    └── AnswerServiceHttpClient.cs

MatForum.ForumQuestion.GRPC/       # gRPC servis
├── Services/
│   └── QuestionValidationGrpcService.cs
├── Protos/
│   └── QuestionValidation.proto
└── Program.cs
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
dotnet ef migrations add InitialCreate --project MatForum.ForumQuestion.Infrastructure --startup-project MatForum.ForumQuestion.API

# Ažuriraj bazu
dotnet ef database update --project MatForum.ForumQuestion.Infrastructure --startup-project MatForum.ForumQuestion.API
```

## Komunikacija sa Drugim Servisima

### User Service
**URL**: `http://user-service`
**Metode**:
- `GetByIdAsync(Guid userId)` - Dobijanje korisnika po ID-u
- `GetQuestionCountByUserIdAsync(Guid userId)` - Broj pitanja po korisniku

### Answer Service
**URL**: `http://answer-service`
**Metode**:
- `DeleteAnswersByQuestionIdAsync(Guid questionId)` - Cascade delete odgovora

### gRPC Service
**URL**: `https://question-grpc-service`
**Port**: 5010
**Protokol**: HTTPS gRPC
**Metode**:
- `ValidateQuestion(ValidateQuestionRequest)` - Validacija pitanja

### HTTP Klijenti Konfiguracija
```csharp
// Program.cs
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service");
});

builder.Services.AddHttpClient<IAnswerServiceClient, AnswerServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://answer-service");
});
```

## Autentifikacija i Autorizacija

### JWT Token Validacija
- **Validacija**: Na API Gateway nivou
- **Headers**: `X-User-Id`, `X-User-Name`, `X-User-Email`
- **Politika**: `authenticated` za zaštićene endpoint-e

### Zaštićeni Endpoint-i
- `POST /api/questions` - Kreiranje pitanja
- `PUT /api/questions/{id}` - Ažuriranje pitanja
- `DELETE /api/questions/{id}` - Brisanje pitanja

### Javni Endpoint-i
- `GET /api/questions` - Lista pitanja
- `GET /api/questions/{id}` - Detalji pitanja
- `GET /api/questions/search` - Pretraga pitanja
- `GET /api/questions/count` - Broj pitanja
- `GET /api/questions/user/{userId}` - Pitanja korisnika
- `GET /api/questions/{id}/similar` - Slična pitanja

## Docker Konfiguracija

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MatForum.ForumQuestion.API/MatForum.ForumQuestion.API.csproj", "MatForum.ForumQuestion.API/"]
# ... ostali COPY komandi
RUN dotnet restore "MatForum.ForumQuestion.API/MatForum.ForumQuestion.API.csproj"
COPY . .
WORKDIR "/src/MatForum.ForumQuestion.API"
RUN dotnet build "MatForum.ForumQuestion.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MatForum.ForumQuestion.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.ForumQuestion.API.dll"]
```

### Docker Compose
```yaml
question-service:
  build:
    context: .
    dockerfile: src/Services/ForumQuestion/MatForum.ForumQuestion.API/Dockerfile
  container_name: question-service
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password
  ports:
    - "5002:80"
  depends_on:
    postgres:
      condition: service_healthy
  restart: on-failure

question-grpc-service:
  build:
    context: .
    dockerfile: src/Services/ForumQuestion/MatForum.ForumQuestion.GRPC/Dockerfile
  container_name: question-grpc-service
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=https://+:443
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password
  ports:
    - "5010:443"
  volumes:
    - ./certs:/app/certs:ro
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
# REST API
cd MatForum.ForumQuestion.API
dotnet run

# gRPC Service
cd MatForum.ForumQuestion.GRPC
dotnet run
```

### Development sa Hot Reload
```bash
# REST API
cd MatForum.ForumQuestion.API
dotnet watch run

# gRPC Service
cd MatForum.ForumQuestion.GRPC
dotnet watch run
```

## Testiranje

### Swagger UI
- **REST API**: http://localhost:5002/swagger
- **gRPC Service**: Nema Swagger (gRPC protokol)

### cURL Primeri

#### 1. Lista pitanja
```bash
curl -X GET "http://localhost:5002/api/questions?page=1&pageSize=10" \
  -H "accept: application/json"
```

#### 2. Kreiranje pitanja
```bash
curl -X POST "http://localhost:5002/api/questions" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 12345678-1234-1234-1234-123456789012" \
  -d '{
    "title": "Kako da implementiram Clean Architecture?",
    "content": "Pitanje o implementaciji Clean Architecture pattern-a...",
    "tags": ["csharp", "architecture", "clean-code"]
  }'
```

#### 3. Pretraga pitanja
```bash
curl -X GET "http://localhost:5002/api/questions/search?q=clean%20architecture" \
  -H "accept: application/json"
```

#### 4. Detalji pitanja
```bash
curl -X GET "http://localhost:5002/api/questions/12345678-1234-1234-1234-123456789012" \
  -H "accept: application/json"
```

#### 5. Slična pitanja
```bash
curl -X GET "http://localhost:5002/api/questions/12345678-1234-1234-1234-123456789012/similar?count=3" \
  -H "accept: application/json"
```

## Logovanje

### Strukturisani Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "Question created successfully",
  "QuestionId": "12345678-1234-1234-1234-123456789012",
  "UserId": "87654321-4321-4321-4321-210987654321",
  "Service": "ForumQuestion"
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
curl http://localhost:5002/health
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

### Problem: "User service unavailable"
**Proveri**:
1. Da li user-service radi?
   ```bash
   docker ps | grep user-service
   ```

2. Da li su HTTP klijenti konfigurisani?
   ```bash
   docker logs question-service --tail 50 | grep "HTTP"
   ```

### Problem: "gRPC service unavailable"
**Proveri**:
1. Da li question-grpc-service radi?
   ```bash
   docker ps | grep question-grpc
   ```

2. Da li certifikati postoje?
   ```bash
   ls -la certs/
   ```

3. Da li gRPC servis sluša HTTPS?
   ```bash
   docker logs question-grpc-service --tail 20 | grep "listening"
   # Mora biti: "Now listening on: https://[::]:443"
   ```

### Problem: Database connection error
**Proveri**:
1. Da li PostgreSQL radi?
   ```bash
   docker ps | grep postgres
   ```

2. Da li je connection string ispravan?
   ```bash
   docker logs question-service --tail 20 | grep "Connection"
   ```

## Performance Optimizacije

### Caching
- **Redis**: Za često korišćene podatke
- **In-Memory**: Za top pitanja
- **TTL**: 5 minuta za statistike

### Database Optimizacije
- **Indexi**: Na `Id`, `CreatedByUserId`, `Tags`, `CreatedAt`
- **Pagination**: Za liste pitanja
- **Async/Await**: Za sve I/O operacije
- **Search Index**: Za full-text pretragu

### HTTP Klijenti
- **Connection Pooling**: Reuse HTTP konekcija
- **Timeout**: 30 sekundi za external servise
- **Retry Policy**: 3 pokušaja sa exponential backoff

## Security

### Input Validacija
- **Title**: 5-200 karaktera
- **Content**: 10-10000 karaktera
- **Tags**: Maksimalno 10 tagova, 2-50 karaktera
- **XSS Protection**: HTML encoding

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
# 1. Servisi pokrenuti?
docker ps | grep question

# 2. Health check
curl http://localhost:5002/health

# 3. API endpoint
curl http://localhost:5002/api/questions/count

# 4. Swagger UI
open http://localhost:5002/swagger

# 5. gRPC servis
docker logs question-grpc-service --tail 10 | grep "https"

# 6. Logovi
docker logs question-service --tail 20
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
- `Grpc.AspNetCore` 2.67.0
- `Grpc.Core` 2.46.6
- `Grpc.Tools` 2.68.1

### Development Paketi
- `Microsoft.EntityFrameworkCore.Tools` 8.0.0
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` 1.19.5

## Status

✅ CRUD operacije implementirane  
✅ Pretraga funkcioniše  
✅ HTTP klijenti konfigurisani  
✅ gRPC servis implementiran  
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
