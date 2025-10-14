/**
\page identity_server_service Identity Server API Service

## Pregled

**Identity Server API Service** je mikroservis za autentifikaciju i autorizaciju u MatForum aplikaciji. Servis pruža JWT token generisanje, korisničku autentifikaciju, registraciju i upravljanje sesijama.

## Arhitektura

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────────┐   ┌─────────────────────┐
│ Identity Server │     │ User Management  │   │    PostgreSQL       │
│    Service      │◄──► │   Service        │   │    Database         │
│ (port 5006)     │     │ (port 5001)      │   │   (matforum)        │
│                 │     │                  │   │                     │
│ REST API (HTTP) │     │ REST API (HTTP)  │   │ Entity Framework    │
└─────────────────┘     └──────────────────┘   └─────────────────────┘
```

## Funkcionalnosti

### 1. Autentifikacija
- **Login** - Prijava korisnika sa username/password
- **Logout** - Odjava korisnika
- **Token refresh** - Obnavljanje JWT tokena
- **Password reset** - Resetovanje lozinke

### 2. Registracija
- **User registration** - Registracija novih korisnika
- **Email verification** - Verifikacija email adrese
- **Username validation** - Provera dostupnosti username-a

### 3. JWT Token Management
- **Access token** - Kratkotrajni token za API pristup
- **Refresh token** - Dugotrajni token za obnavljanje
- **Token validation** - Validacija tokena
- **Token revocation** - Poništavanje tokena

### 4. Korisnički Profil
- **Profile management** - Upravljanje korisničkim profilom
- **Password change** - Promena lozinke
- **Account settings** - Podešavanja naloga

## API Endpoints

### Autentifikacija

#### POST /api/auth/login
**Opis**: Prijava korisnika

**Request Body**:
```json
{
  "userName": "marko123",
  "password": "SecurePassword123!"
}
```

**Response**: 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "guid",
    "userName": "marko123",
    "email": "marko@example.com",
    "firstName": "Marko",
    "lastName": "Marković"
  }
}
```

#### POST /api/auth/logout
**Opis**: Odjava korisnika

**Headers**:
- `Authorization: Bearer {token}`

**Response**: 200 OK
```json
{
  "message": "Successfully logged out"
}
```

#### POST /api/auth/refresh
**Opis**: Obnavljanje JWT tokena

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**: 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Registracija

#### POST /api/auth/register
**Opis**: Registracija novog korisnika

**Request Body**:
```json
{
  "userName": "marko123",
  "email": "marko@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "firstName": "Marko",
  "lastName": "Marković",
  "phoneNumber": "+38160123456"
}
```

**Response**: 201 Created
```json
{
  "message": "User registered successfully",
  "userId": "guid",
  "emailVerificationRequired": true
}
```

#### POST /api/auth/verify-email
**Opis**: Verifikacija email adrese

**Request Body**:
```json
{
  "userId": "guid",
  "verificationToken": "verification-token"
}
```

**Response**: 200 OK
```json
{
  "message": "Email verified successfully"
}
```

#### POST /api/auth/resend-verification
**Opis**: Ponovno slanje verifikacionog email-a

**Request Body**:
```json
{
  "email": "marko@example.com"
}
```

**Response**: 200 OK
```json
{
  "message": "Verification email sent"
}
```

### Password Management

#### POST /api/auth/forgot-password
**Opis**: Zahtev za resetovanje lozinke

**Request Body**:
```json
{
  "email": "marko@example.com"
}
```

**Response**: 200 OK
```json
{
  "message": "Password reset email sent"
}
```

#### POST /api/auth/reset-password
**Opis**: Resetovanje lozinke

**Request Body**:
```json
{
  "userId": "guid",
  "resetToken": "reset-token",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response**: 200 OK
```json
{
  "message": "Password reset successfully"
}
```

#### POST /api/auth/change-password
**Opis**: Promena lozinke

**Headers**:
- `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response**: 200 OK
```json
{
  "message": "Password changed successfully"
}
```

### Korisnički Profil

#### GET /api/auth/profile
**Opis**: Dobijanje korisničkog profila

**Headers**:
- `Authorization: Bearer {token}`

**Response**: 200 OK
```json
{
  "id": "guid",
  "userName": "marko123",
  "email": "marko@example.com",
  "firstName": "Marko",
  "lastName": "Marković",
  "phoneNumber": "+38160123456",
  "emailVerified": true,
  "createdAt": "2025-01-01T10:00:00Z",
  "lastLoginAt": "2025-01-14T10:30:00Z"
}
```

#### PUT /api/auth/profile
**Opis**: Ažuriranje korisničkog profila

**Headers**:
- `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "firstName": "Marko",
  "lastName": "Marković",
  "phoneNumber": "+38160123456"
}
```

**Response**: 200 OK sa ažuriranim profilom

### Validacija

#### GET /api/auth/validate-username/{username}
**Opis**: Provera dostupnosti username-a

**Parameters**:
- `username` (string) - Username za proveru

**Response**: 200 OK
```json
{
  "username": "marko123",
  "available": false,
  "message": "Username is already taken"
}
```

#### GET /api/auth/validate-email/{email}
**Opis**: Provera dostupnosti email-a

**Parameters**:
- `email` (string) - Email za proveru

**Response**: 200 OK
```json
{
  "email": "marko@example.com",
  "available": false,
  "message": "Email is already registered"
}
```

## Struktura Projekta

```
MatForum.IdentityServer.API/
├── Controllers/
│   ├── AuthController.cs           # Autentifikacija
│   └── AuthenticationController.cs # Dodatna autentifikacija
├── Program.cs                       # Konfiguracija servisa
├── appsettings.json                 # Konfiguracija
├── appsettings.Development.json     # Development konfiguracija
├── Dockerfile                       # Docker konfiguracija
└── MatForum.IdentityServer.API.csproj

MatForum.IdentityServer.Application/
├── DTOs/                           # Data Transfer Objects
│   ├── LoginRequestDto.cs
│   ├── LoginResponseDto.cs
│   ├── RegisterRequestDto.cs
│   ├── RegisterResponseDto.cs
│   ├── RefreshTokenRequestDto.cs
│   ├── RefreshTokenResponseDto.cs
│   ├── ForgotPasswordRequestDto.cs
│   ├── ResetPasswordRequestDto.cs
│   ├── ChangePasswordRequestDto.cs
│   ├── UserProfileDto.cs
│   └── ValidationResponseDto.cs
├── Interfaces/                     # Interfejsi
│   ├── IAuthService.cs
│   ├── IUserService.cs
│   ├── ITokenService.cs
│   └── IEmailService.cs
└── Services/                       # Business logika
    ├── AuthService.cs
    ├── UserService.cs
    ├── TokenService.cs
    └── EmailService.cs

MatForum.IdentityServer.Domain/
└── Entities/                       # Domain entiteti
    ├── User.cs
    ├── RefreshToken.cs
    └── EmailVerificationToken.cs

MatForum.IdentityServer.Infrastructure/
├── Data/                          # Entity Framework
│   └── IdentityDbContext.cs
├── Repositories/                  # Data access
│   ├── UserRepository.cs
│   └── RefreshTokenRepository.cs
└── Services/                      # External servisi
    ├── UserServiceHttpClient.cs
    └── EmailServiceHttpClient.cs
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
dotnet ef migrations add InitialCreate --project MatForum.IdentityServer.Infrastructure --startup-project MatForum.IdentityServer.API

# Ažuriraj bazu
dotnet ef database update --project MatForum.IdentityServer.Infrastructure --startup-project MatForum.IdentityServer.API
```

## Komunikacija sa Drugim Servisima

### User Service
**URL**: `http://user-service`
**Metode**:
- `CreateUserAsync(CreateUserRequest)` - Kreiranje korisnika
- `GetUserByUsernameAsync(string username)` - Dobijanje korisnika po username-u
- `GetUserByEmailAsync(string email)` - Dobijanje korisnika po email-u
- `UpdateUserAsync(Guid userId, UpdateUserRequest)` - Ažuriranje korisnika

### HTTP Klijenti Konfiguracija
```csharp
// Program.cs
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service");
});
```

## JWT Token Konfiguracija

### JWT Settings
```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "MatForum.IdentityServer",
    "Audience": "MatForum.API",
    "ExpiryInMinutes": 60,
    "RefreshTokenExpiryInDays": 7
  }
}
```

### Token Claims
```csharp
// TokenService.cs
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Name, user.UserName),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim("firstName", user.FirstName),
    new Claim("lastName", user.LastName),
    new Claim("emailVerified", user.EmailVerified.ToString())
};
```

## Autentifikacija i Autorizacija

### JWT Token Validacija
- **Secret Key**: Konfigurisan u appsettings.json
- **Issuer**: MatForum.IdentityServer
- **Audience**: MatForum.API
- **Expiry**: 60 minuta za access token
- **Refresh Token**: 7 dana

### Zaštićeni Endpoint-i
- `POST /api/auth/logout` - Odjava
- `POST /api/auth/refresh` - Obnavljanje tokena
- `POST /api/auth/change-password` - Promena lozinke
- `GET /api/auth/profile` - Korisnički profil
- `PUT /api/auth/profile` - Ažuriranje profila

### Javni Endpoint-i
- `POST /api/auth/login` - Prijava
- `POST /api/auth/register` - Registracija
- `POST /api/auth/forgot-password` - Zahtev za resetovanje
- `POST /api/auth/reset-password` - Resetovanje lozinke
- `POST /api/auth/verify-email` - Verifikacija email-a
- `GET /api/auth/validate-username/{username}` - Validacija username-a
- `GET /api/auth/validate-email/{email}` - Validacija email-a

## Docker Konfiguracija

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MatForum.IdentityServer.API/MatForum.IdentityServer.API.csproj", "MatForum.IdentityServer.API/"]
# ... ostali COPY komandi
RUN dotnet restore "MatForum.IdentityServer.API/MatForum.IdentityServer.API.csproj"
COPY . .
WORKDIR "/src/MatForum.IdentityServer.API"
RUN dotnet build "MatForum.IdentityServer.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MatForum.IdentityServer.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.IdentityServer.API.dll"]
```

### Docker Compose
```yaml
identity-service:
  build:
    context: .
    dockerfile: src/Security/MatForum.IdentityServer.API/Dockerfile
  container_name: identity-service
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password
    - JwtSettings__SecretKey=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
    - JwtSettings__Issuer=MatForum.IdentityServer
    - JwtSettings__Audience=MatForum.API
    - JwtSettings__ExpiryInMinutes=60
    - JwtSettings__RefreshTokenExpiryInDays=7
  ports:
    - "5006:80"
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
cd MatForum.IdentityServer.API
dotnet run
```

### Development sa Hot Reload
```bash
cd MatForum.IdentityServer.API
dotnet watch run
```

## Testiranje

### Swagger UI
- **URL**: http://localhost:5006/swagger
- **Dostupno**: Samo u Development modu

### cURL Primeri

#### 1. Registracija korisnika
```bash
curl -X POST "http://localhost:5006/api/auth/register" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "marko123",
    "email": "marko@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!",
    "firstName": "Marko",
    "lastName": "Marković",
    "phoneNumber": "+38160123456"
  }'
```

#### 2. Prijava korisnika
```bash
curl -X POST "http://localhost:5006/api/auth/login" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "marko123",
    "password": "SecurePassword123!"
  }'
```

#### 3. Obnavljanje tokena
```bash
curl -X POST "http://localhost:5006/api/auth/refresh" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

#### 4. Korisnički profil
```bash
curl -X GET "http://localhost:5006/api/auth/profile" \
  -H "accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Validacija username-a
```bash
curl -X GET "http://localhost:5006/api/auth/validate-username/marko123" \
  -H "accept: application/json"
```

## Logovanje

### Strukturisani Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "User logged in successfully",
  "UserId": "12345678-1234-1234-1234-123456789012",
  "UserName": "marko123",
  "IPAddress": "192.168.1.100",
  "Service": "IdentityServer"
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
curl http://localhost:5006/health
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

### Problem: "Invalid credentials" greška
**Proveri**:
1. Da li su username i password ispravni?
   ```bash
   curl -X POST "http://localhost:5006/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"userName":"marko123","password":"SecurePassword123!"}'
   ```

2. Da li je korisnik registrovan?
   ```bash
   curl -X GET "http://localhost:5006/api/auth/validate-username/marko123"
   ```

### Problem: "Token expired" greška
**Proveri**:
1. Da li je token istekao?
   ```bash
   # Proveri expiry time u JWT tokenu
   echo "YOUR_TOKEN" | base64 -d
   ```

2. Da li je refresh token validan?
   ```bash
   curl -X POST "http://localhost:5006/api/auth/refresh" \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
   ```

### Problem: "User service unavailable"
**Proveri**:
1. Da li user-service radi?
   ```bash
   docker ps | grep user-service
   ```

2. Da li su HTTP klijenti konfigurisani?
   ```bash
   docker logs identity-service --tail 50 | grep "HTTP"
   ```

### Problem: Database connection error
**Proveri**:
1. Da li PostgreSQL radi?
   ```bash
   docker ps | grep postgres
   ```

2. Da li je connection string ispravan?
   ```bash
   docker logs identity-service --tail 20 | grep "Connection"
   ```

## Performance Optimizacije

### Caching
- **Redis**: Za refresh tokene
- **In-Memory**: Za JWT validaciju
- **TTL**: 7 dana za refresh tokene

### Database Optimizacije
- **Indexi**: Na `UserName`, `Email`, `RefreshToken`
- **Async/Await**: Za sve I/O operacije
- **Connection Pooling**: Za database konekcije

### HTTP Klijenti
- **Connection Pooling**: Reuse HTTP konekcija
- **Timeout**: 30 sekundi za external servise
- **Retry Policy**: 3 pokušaja sa exponential backoff

## Security

### Password Security
- **Hashing**: BCrypt sa salt
- **Minimum Length**: 8 karaktera
- **Complexity**: Velika slova, mala slova, brojevi, specijalni karakteri
- **History**: Sprečavanje korišćenja poslednjih 5 lozinki

### Token Security
- **Secret Key**: Minimum 32 karaktera
- **Expiry**: 60 minuta za access token
- **Refresh Token**: 7 dana sa rotation
- **Revocation**: Poništavanje tokena pri logout

### Input Validacija
- **Email**: Valid email format
- **Username**: Alphanumeric + underscore, 3-50 karaktera
- **Password**: Minimum 8 karaktera sa complexity
- **XSS Protection**: HTML encoding

## Deployment

### Production Checklist
- [ ] Environment variables konfigurisani
- [ ] Database migracije pokrenute
- [ ] Health checks konfigurisani
- [ ] Logging konfigurisan
- [ ] Monitoring setup
- [ ] SSL/TLS certifikati
- [ ] Backup strategija
- [ ] JWT secret key konfigurisan

### Environment Variables
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=prod-db;Database=matforum;Username=prod_user;Password=secure_password
JwtSettings__SecretKey=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
JwtSettings__Issuer=MatForum.IdentityServer
JwtSettings__Audience=MatForum.API
JwtSettings__ExpiryInMinutes=60
JwtSettings__RefreshTokenExpiryInDays=7
Logging__LogLevel__Default=Warning
```

## Verifikacija

Proveri da sve radi:

```bash
# 1. Servis pokrenut?
docker ps | grep identity-service

# 2. Health check
curl http://localhost:5006/health

# 3. API endpoint
curl -X GET "http://localhost:5006/api/auth/validate-username/test"

# 4. Swagger UI
open http://localhost:5006/swagger

# 5. Logovi
docker logs identity-service --tail 20
```

## NuGet Paketi

### Glavni Paketi
- `Microsoft.AspNetCore.App` 8.0.0
- `Microsoft.EntityFrameworkCore` 8.0.0
- `Microsoft.EntityFrameworkCore.Design` 8.0.0
- `Npgsql.EntityFrameworkCore.PostgreSQL` 8.0.0
- `Microsoft.Extensions.Http` 8.0.0
- `Swashbuckle.AspNetCore` 6.5.0
- `System.IdentityModel.Tokens.Jwt` 7.0.3
- `Microsoft.AspNetCore.Authentication.JwtBearer` 8.0.0

### Development Paketi
- `Microsoft.EntityFrameworkCore.Tools` 8.0.0
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` 1.19.5

## Status

✅ Autentifikacija implementirana  
✅ JWT token management  
✅ Registracija funkcioniše  
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
