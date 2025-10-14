/**
\page user_management_service User Management API Service

## Pregled

**User Management API Service** je mikroservis za upravljanje korisničkim profilima u MatForum aplikaciji. Servis pruža CRUD operacije nad korisničkim profilima i komunicira sa drugim mikroservisima za dobijanje statistika o korisničkim doprinosima.

## Arhitektura

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────────┐   ┌─────────────────────┐
│ User Management │     │ Forum Question   │   │ Question Answer     │
│    Service      │◄──► │   Service        │   │     Service         │
│ (port 5001)     │     │ (port 5002)      │   │ (port 5004)         │
│                 │     │                  │   │                     │
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

### 1. CRUD Operacije nad Korisničkim Profilima
- **Kreiranje** novih korisničkih profila
- **Čitanje** korisničkih profila po ID-u
- **Ažuriranje** postojećih profila
- **Brisanje** korisničkih profila
- **Lista** svih korisnika

### 2. Statistike i Analitika
- **Broj korisnika** - Ukupan broj registrovanih korisnika
- **Top korisnici** - Lista korisnika sortirana po broju doprinosa
- **Korisnički profil** - Detaljni profil sa pitanjima i odgovorima

### 3. Komunikacija sa Drugim Servisima
- **Question Service** - Za broj pitanja po korisniku
- **Answer Service** - Za broj odgovora po korisniku

## API Endpoints

### Korisnički Profili

#### GET /api/users/count
**Opis**: Vraća ukupan broj korisnika u sistemu

**Response**:
```json
{
  "count": 150
}
```

#### GET /api/users
**Opis**: Vraća listu svih korisničkih profila

**Response**:
```json
[
  {
    "id": "guid",
    "firstName": "Marko",
    "lastName": "Marković",
    "email": "marko@example.com",
    "username": "marko123",
    "dateOfBirth": "1990-01-01T00:00:00Z",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z"
  }
]
```

#### GET /api/users/{id}
**Opis**: Vraća korisnički profil po ID-u

**Parameters**:
- `id` (Guid) - ID korisnika

**Response**:
```json
{
  "id": "guid",
  "firstName": "Marko",
  "lastName": "Marković",
  "email": "marko@example.com",
  "username": "marko123",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z"
}
```

#### POST /api/users
**Opis**: Kreira novi korisnički profil

**Request Body**:
```json
{
  "id": "guid",
  "firstName": "Marko",
  "lastName": "Marković",
  "email": "marko@example.com",
  "username": "marko123",
  "phoneNumber": "+38160123456",
  "dateOfBirth": "1990-01-01T00:00:00Z"
}
```

**Response**: 201 Created sa kreiranim profilom

#### PUT /api/users/{id}
**Opis**: Ažurira postojeći korisnički profil

**Parameters**:
- `id` (Guid) - ID korisnika

**Request Body**:
```json
{
  "firstName": "Marko",
  "lastName": "Marković",
  "email": "marko@example.com",
  "username": "marko123",
  "dateOfBirth": "1990-01-01T00:00:00Z"
}
```

**Response**: 200 OK sa ažuriranim profilom

#### DELETE /api/users/{id}
**Opis**: Briše korisnički profil

**Parameters**:
- `id` (Guid) - ID korisnika

**Response**: 204 No Content

### Statistike

#### GET /api/users/top-contributors?count=10
**Opis**: Vraća listu top korisnika po broju doprinosa

**Query Parameters**:
- `count` (int, optional) - Broj korisnika (default: 10)

**Response**:
```json
[
  {
    "id": "guid",
    "firstName": "Marko",
    "lastName": "Marković",
    "username": "marko123",
    "createdAt": "2025-01-01T10:00:00Z",
    "questionsCount": 25,
    "answersCount": 150,
    "totalContributions": 175
  }
]
```

#### GET /api/users/{id}/contributor-profile
**Opis**: Vraća detaljni profil korisnika sa pitanjima

**Parameters**:
- `id` (Guid) - ID korisnika

**Response**:
```json
{
  "id": "guid",
  "firstName": "Marko",
  "lastName": "Marković",
  "username": "marko123",
  "email": "marko@example.com",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "createdAt": "2025-01-01T10:00:00Z",
  "questionsCount": 25,
  "answersCount": 150,
  "totalContributions": 175,
  "questions": [
    {
      "id": "guid",
      "title": "Kako da...",
      "content": "Pitanje...",
      "createdAt": "2025-01-01T10:00:00Z",
      "views": 100,
      "tags": ["csharp", "dotnet"]
    }
  ]
}
```

#### GET /api/users/{id}/exists
**Opis**: Proverava da li korisnik postoji

**Parameters**:
- `id` (Guid) - ID korisnika

**Response**:
```json
{
  "exists": true
}
```

## Struktura Projekta

```
MatForum.UserManagement.API/
├── Controllers/
│   └── UserProfilesController.cs    # API kontroleri
├── Program.cs                       # Konfiguracija servisa
├── appsettings.json                 # Konfiguracija
├── appsettings.Development.json     # Development konfiguracija
├── Dockerfile                       # Docker konfiguracija
└── MatForum.UserManagement.API.csproj

MatForum.UserManagement.Application/
├── DTOs/                           # Data Transfer Objects
│   ├── UserProfileDto.cs
│   ├── CreateUserProfileDto.cs
│   ├── UpdateUserProfileDto.cs
│   ├── TopContributorDto.cs
│   └── ContributorProfileDto.cs
├── Interfaces/                     # Interfejsi
│   ├── IUserProfileService.cs
│   ├── IUserProfileRepository.cs
│   ├── IQuestionServiceClient.cs
│   └── IAnswerServiceClient.cs
└── Services/                       # Business logika
    └── UserProfileService.cs

MatForum.UserManagement.Domain/
└── Entities/                       # Domain entiteti
    └── UserProfile.cs

MatForum.UserManagement.Infrastructure/
├── Data/                          # Entity Framework
│   └── UserManagementDbContext.cs
├── Repositories/                  # Data access
│   └── UserProfileRepository.cs
└── Clients/                       # HTTP klijenti
    ├── QuestionServiceHttpClient.cs
    └── AnswerServiceHttpClient.cs
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
dotnet ef migrations add InitialCreate --project MatForum.UserManagement.Infrastructure --startup-project MatForum.UserManagement.API

# Ažuriraj bazu
dotnet ef database update --project MatForum.UserManagement.Infrastructure --startup-project MatForum.UserManagement.API
```

## Komunikacija sa Drugim Servisima

### Question Service
**URL**: `http://question-service`
**Metode**:
- `GetQuestionCountByUserIdAsync(Guid userId)` - Broj pitanja po korisniku
- `GetQuestionsByUserIdAsync(Guid userId)` - Lista pitanja po korisniku

### Answer Service
**URL**: `http://answer-service`
**Metode**:
- `GetAnswerCountByUserIdAsync(Guid userId)` - Broj odgovora po korisniku

### HTTP Klijenti Konfiguracija
```csharp
// Program.cs
builder.Services.AddHttpClient<IQuestionServiceClient, QuestionServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://question-service");
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
- `POST /api/users` - Kreiranje profila
- `PUT /api/users/{id}` - Ažuriranje profila
- `DELETE /api/users/{id}` - Brisanje profila

### Javni Endpoint-i
- `GET /api/users/count` - Broj korisnika
- `GET /api/users/top-contributors` - Top korisnici
- `GET /api/users/{id}/exists` - Provera postojanja
- `GET /api/users/{id}/contributor-profile` - Profil korisnika

## Docker Konfiguracija

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MatForum.UserManagement.API/MatForum.UserManagement.API.csproj", "MatForum.UserManagement.API/"]
# ... ostali COPY komandi
RUN dotnet restore "MatForum.UserManagement.API/MatForum.UserManagement.API.csproj"
COPY . .
WORKDIR "/src/MatForum.UserManagement.API"
RUN dotnet build "MatForum.UserManagement.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MatForum.UserManagement.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.UserManagement.API.dll"]
```

### Docker Compose
```yaml
user-service:
  build:
    context: .
    dockerfile: src/Services/UserManagement/MatForum.UserManagement.API/Dockerfile
  container_name: user-service
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password
  ports:
    - "5001:80"
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
cd MatForum.UserManagement.API
dotnet run
```

### Development sa Hot Reload
```bash
cd MatForum.UserManagement.API
dotnet watch run
```

## Testiranje

### Swagger UI
- **URL**: http://localhost:5001/swagger
- **Dostupno**: Samo u Development modu

### cURL Primeri

#### 1. Broj korisnika
```bash
curl -X GET "http://localhost:5001/api/users/count" \
  -H "accept: application/json"
```

#### 2. Top korisnici
```bash
curl -X GET "http://localhost:5001/api/users/top-contributors?count=5" \
  -H "accept: application/json"
```

#### 3. Kreiranje korisnika
```bash
curl -X POST "http://localhost:5001/api/users" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "12345678-1234-1234-1234-123456789012",
    "firstName": "Marko",
    "lastName": "Marković",
    "email": "marko@example.com",
    "username": "marko123",
    "phoneNumber": "+38160123456",
    "dateOfBirth": "1990-01-01T00:00:00Z"
  }'
```

#### 4. Provera postojanja korisnika
```bash
curl -X GET "http://localhost:5001/api/users/12345678-1234-1234-1234-123456789012/exists" \
  -H "accept: application/json"
```

## Logovanje

### Strukturisani Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "User profile created successfully",
  "UserId": "12345678-1234-1234-1234-123456789012",
  "Service": "UserManagement"
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
curl http://localhost:5001/health
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

2. Da li je korisnik obrisan?
   ```bash
   curl http://localhost:5001/api/users/USER_ID/exists
   ```

### Problem: "Question/Answer service unavailable"
**Proveri**:
1. Da li question-service radi?
   ```bash
   docker ps | grep question-service
   ```

2. Da li answer-service radi?
   ```bash
   docker ps | grep answer-service
   ```

3. Da li su HTTP klijenti konfigurisani?
   ```bash
   docker logs user-service --tail 50 | grep "HTTP"
   ```

### Problem: Database connection error
**Proveri**:
1. Da li PostgreSQL radi?
   ```bash
   docker ps | grep postgres
   ```

2. Da li je connection string ispravan?
   ```bash
   docker logs user-service --tail 20 | grep "Connection"
   ```

## Performance Optimizacije

### Caching
- **Redis**: Za često korišćene podatke
- **In-Memory**: Za top korisnike
- **TTL**: 5 minuta za statistike

### Database Optimizacije
- **Indexi**: Na `Id`, `Email`, `Username`
- **Pagination**: Za liste korisnika
- **Async/Await**: Za sve I/O operacije

### HTTP Klijenti
- **Connection Pooling**: Reuse HTTP konekcija
- **Timeout**: 30 sekundi za external servise
- **Retry Policy**: 3 pokušaja sa exponential backoff

## Security

### Input Validacija
- **Email format**: Regex validacija
- **Username**: Alphanumeric + underscore
- **Phone number**: E.164 format
- **Date of birth**: Valid date range

### Data Protection
- **PII**: Personal Identifiable Information
- **GDPR**: Right to be forgotten
- **Encryption**: Sensitive data at rest
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
docker ps | grep user-service

# 2. Health check
curl http://localhost:5001/health

# 3. API endpoint
curl http://localhost:5001/api/users/count

# 4. Swagger UI
open http://localhost:5001/swagger

# 5. Logovi
docker logs user-service --tail 20
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
✅ HTTP klijenti konfigurisani  
✅ Statistike funkcionišu  
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
