/**
\page api_gateway_service API Gateway Service

## Pregled

**API Gateway Service** je centralna ulazna tačka za MatForum aplikaciju. Servis koristi YARP (Yet Another Reverse Proxy) za rutiranje zahteva ka mikroservisima, JWT autentifikaciju, CORS konfiguraciju i load balancing.

## Arhitektura

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
│                     (localhost:5000)                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Routing   │  │    JWT      │  │    CORS     │            │
│  │   (YARP)    │  │    Auth     │  │   Config    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   User      │ │  Question   │ │   Answer    │
│  Service    │ │  Service    │ │  Service    │
│ (port 5001) │ │ (port 5002) │ │ (port 5004) │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Identity   │ │   Voting    │ │ PostgreSQL  │
│  Service    │ │  Service    │ │  Database   │
│ (port 5006) │ │ (port 5005) │ │ (port 5432) │
└─────────────┘ └─────────────┘ └─────────────┘
```

## Funkcionalnosti

### 1. Reverse Proxy (YARP)
- **Routing** - Rutiranje zahteva ka odgovarajućim mikroservisima
- **Load Balancing** - Distribucija opterećenja između instanci
- **Health Checks** - Provera zdravlja mikroservisa
- **Circuit Breaker** - Zaštita od neispravnih servisa

### 2. JWT Autentifikacija
- **Token Validation** - Validacija JWT tokena
- **User Context** - Dodavanje korisničkih informacija u headers
- **Authorization** - Kontrola pristupa na osnovu tokena
- **Token Refresh** - Podrška za refresh token flow

### 3. CORS Konfiguracija
- **Cross-Origin** - Podrška za cross-origin zahteve
- **Headers** - Konfiguracija dozvoljenih headers
- **Methods** - Konfiguracija dozvoljenih HTTP metoda
- **Origins** - Konfiguracija dozvoljenih origins

### 4. Request/Response Transformacija
- **Header Injection** - Dodavanje korisničkih informacija
- **Request Logging** - Logovanje svih zahteva
- **Response Caching** - Keširanje odgovora
- **Rate Limiting** - Ograničavanje broja zahteva

## Routing Konfiguracija

### appsettings.json
```json
{
  "ReverseProxy": {
    "Routes": {
      "user-route": {
        "ClusterId": "user-cluster",
        "Match": {
          "Path": "/api/users/{**catch-all}"
        }
      },
      "question-route": {
        "ClusterId": "question-cluster",
        "Match": {
          "Path": "/api/questions/{**catch-all}"
        }
      },
      "answer-route": {
        "ClusterId": "answer-cluster",
        "Match": {
          "Path": "/api/answers/{**catch-all}"
        }
      },
      "voting-route": {
        "ClusterId": "voting-cluster",
        "Match": {
          "Path": "/api/votes/{**catch-all}"
        }
      },
      "auth-route": {
        "ClusterId": "auth-cluster",
        "Match": {
          "Path": "/api/auth/{**catch-all}"
        }
      }
    },
    "Clusters": {
      "user-cluster": {
        "Destinations": {
          "user-destination": {
            "Address": "http://user-service/"
          }
        }
      },
      "question-cluster": {
        "Destinations": {
          "question-destination": {
            "Address": "http://question-service/"
          }
        }
      },
      "answer-cluster": {
        "Destinations": {
          "answer-destination": {
            "Address": "http://answer-service/"
          }
        }
      },
      "voting-cluster": {
        "Destinations": {
          "voting-destination": {
            "Address": "http://voting-service/"
          }
        }
      },
      "auth-cluster": {
        "Destinations": {
          "auth-destination": {
            "Address": "http://identity-service/"
          }
        }
      }
    }
  }
}
```

## JWT Autentifikacija

### JWT Settings
```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "MatForum.IdentityServer",
    "Audience": "MatForum.API",
    "ExpiryInMinutes": 60
  }
}
```

### JWT Middleware Konfiguracija
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });
```

### User Context Middleware
```csharp
// UserContextMiddleware.cs
public class UserContextMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.User.Identity.IsAuthenticated)
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = context.User.FindFirst(ClaimTypes.Name)?.Value;
            var userEmail = context.User.FindFirst(ClaimTypes.Email)?.Value;

            context.Request.Headers.Add("X-User-Id", userId);
            context.Request.Headers.Add("X-User-Name", userName);
            context.Request.Headers.Add("X-User-Email", userEmail);
        }

        await next(context);
    }
}
```

## CORS Konfiguracija

### CORS Settings
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### CORS Middleware
```csharp
// Program.cs
app.UseCors("AllowFrontend");
```

## Struktura Projekta

```
MatForum.ApiGateway/
├── Program.cs                       # Konfiguracija servisa
├── appsettings.json                 # Konfiguracija
├── appsettings.Development.json     # Development konfiguracija
├── Dockerfile                       # Docker konfiguracija
├── MatForum.ApiGateway.http         # HTTP test fajlovi
└── MatForum.ApiGateway.csproj

Properties/
└── launchSettings.json              # Launch konfiguracija
```

## Baza Podataka

### Nema Direktne Baze
API Gateway ne koristi direktno bazu podataka. Svi podaci se dobijaju preko mikroservisa.

### Konfiguracija
- **JWT Secret**: Konfigurisan u appsettings.json
- **Routing**: Konfigurisan u appsettings.json
- **CORS**: Konfigurisan u Program.cs

## Komunikacija sa Mikroservisima

### Mikroservisi
- **User Service**: `http://user-service` (port 5001)
- **Question Service**: `http://question-service` (port 5002)
- **Answer Service**: `http://answer-service` (port 5004)
- **Voting Service**: `http://voting-service` (port 5005)
- **Identity Service**: `http://identity-service` (port 5006)

### Health Checks
```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddUrlGroup(new Uri("http://user-service/health"), "user-service")
    .AddUrlGroup(new Uri("http://question-service/health"), "question-service")
    .AddUrlGroup(new Uri("http://answer-service/health"), "answer-service")
    .AddUrlGroup(new Uri("http://voting-service/health"), "voting-service")
    .AddUrlGroup(new Uri("http://identity-service/health"), "identity-service");
```

## Autentifikacija i Autorizacija

### JWT Token Validacija
- **Secret Key**: Konfigurisan u appsettings.json
- **Issuer**: MatForum.IdentityServer
- **Audience**: MatForum.API
- **Expiry**: 60 minuta

### Zaštićeni Endpoint-i
- `POST /api/users` - Kreiranje korisnika
- `PUT /api/users/{id}` - Ažuriranje korisnika
- `DELETE /api/users/{id}` - Brisanje korisnika
- `POST /api/questions` - Kreiranje pitanja
- `PUT /api/questions/{id}` - Ažuriranje pitanja
- `DELETE /api/questions/{id}` - Brisanje pitanja
- `POST /api/answers` - Kreiranje odgovora
- `PUT /api/answers/{id}` - Ažuriranje odgovora
- `DELETE /api/answers/{id}` - Brisanje odgovora
- `POST /api/votes/*` - Glasanje
- `DELETE /api/votes/*` - Uklanjanje glasova

### Javni Endpoint-i
- `GET /api/users/*` - Čitanje korisnika
- `GET /api/questions/*` - Čitanje pitanja
- `GET /api/answers/*` - Čitanje odgovora
- `GET /api/votes/*/stats` - Statistike glasanja
- `POST /api/auth/login` - Prijava
- `POST /api/auth/register` - Registracija
- `POST /api/auth/refresh` - Obnavljanje tokena

## Docker Konfiguracija

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MatForum.ApiGateway/MatForum.ApiGateway.csproj", "MatForum.ApiGateway/"]
RUN dotnet restore "MatForum.ApiGateway/MatForum.ApiGateway.csproj"
COPY . .
WORKDIR "/src/MatForum.ApiGateway"
RUN dotnet build "MatForum.ApiGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MatForum.ApiGateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.ApiGateway.dll"]
```

### Docker Compose
```yaml
api-gateway:
  build:
    context: .
    dockerfile: src/ApiGateway/MatForum.ApiGateway/Dockerfile
  container_name: api-gateway
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - JwtSettings__SecretKey=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
    - JwtSettings__Issuer=MatForum.IdentityServer
    - JwtSettings__Audience=MatForum.API
    - JwtSettings__ExpiryInMinutes=60
  ports:
    - "5000:80"
  depends_on:
    - user-service
    - question-service
    - answer-service
    - voting-service
    - identity-service
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
cd MatForum.ApiGateway
dotnet run
```

### Development sa Hot Reload
```bash
cd MatForum.ApiGateway
dotnet watch run
```

## Testiranje

### HTTP Test Fajlovi
- **Lokacija**: `MatForum.ApiGateway.http`
- **Sadržaj**: Predefinisani HTTP zahtevi za testiranje

### cURL Primeri

#### 1. Health Check
```bash
curl -X GET "http://localhost:5000/health" \
  -H "accept: application/json"
```

#### 2. Javni endpoint (bez autentifikacije)
```bash
curl -X GET "http://localhost:5000/api/questions/count" \
  -H "accept: application/json"
```

#### 3. Zaštićeni endpoint (sa JWT tokenom)
```bash
curl -X GET "http://localhost:5000/api/users/count" \
  -H "accept: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. CORS test
```bash
curl -X OPTIONS "http://localhost:5000/api/questions" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## Logovanje

### Strukturisani Logovi
```json
{
  "Timestamp": "2025-01-14T10:30:00Z",
  "Level": "Information",
  "Message": "Request routed to user-service",
  "Method": "GET",
  "Path": "/api/users/count",
  "StatusCode": 200,
  "Duration": 150,
  "Service": "ApiGateway"
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
curl http://localhost:5000/health
```

### Health Check Response
```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.1234567",
  "entries": {
    "user-service": {
      "status": "Healthy",
      "duration": "00:00:00.0123456"
    },
    "question-service": {
      "status": "Healthy",
      "duration": "00:00:00.0234567"
    },
    "answer-service": {
      "status": "Healthy",
      "duration": "00:00:00.0345678"
    },
    "voting-service": {
      "status": "Healthy",
      "duration": "00:00:00.0456789"
    },
    "identity-service": {
      "status": "Healthy",
      "duration": "00:00:00.0567890"
    }
  }
}
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

### Problem: "Service unavailable" greška
**Proveri**:
1. Da li mikroservis radi?
   ```bash
   docker ps | grep service-name
   ```

2. Da li je routing konfigurisan?
   ```bash
   curl http://localhost:5000/health
   ```

3. Da li su mikroservisi dostupni?
   ```bash
   curl http://localhost:5001/health  # user-service
   curl http://localhost:5002/health  # question-service
   ```

### Problem: "Unauthorized" greška
**Proveri**:
1. Da li je JWT token validan?
   ```bash
   # Proveri expiry time u JWT tokenu
   echo "YOUR_TOKEN" | base64 -d
   ```

2. Da li je JWT secret konfigurisan?
   ```bash
   docker logs api-gateway --tail 20 | grep "JWT"
   ```

### Problem: CORS greška
**Proveri**:
1. Da li je CORS konfigurisan?
   ```bash
   curl -X OPTIONS "http://localhost:5000/api/questions" \
     -H "Origin: http://localhost:5173"
   ```

2. Da li je frontend origin dozvoljen?
   ```bash
   # Proveri CORS konfiguraciju u Program.cs
   ```

### Problem: "Connection refused" greška
**Proveri**:
1. Da li su svi mikroservisi pokrenuti?
   ```bash
   docker ps | grep -E "user|question|answer|voting|identity"
   ```

2. Da li su portovi ispravni?
   ```bash
   # Proveri appsettings.json routing konfiguraciju
   ```

## Performance Optimizacije

### Caching
- **Response Caching**: Za statičke podatke
- **In-Memory**: Za JWT validaciju
- **TTL**: 5 minuta za cache

### Load Balancing
- **Round Robin**: Distribucija opterećenja
- **Health Checks**: Automatsko uklanjanje neispravnih instanci
- **Circuit Breaker**: Zaštita od cascade failures

### HTTP Optimizacije
- **Connection Pooling**: Reuse HTTP konekcija
- **Timeout**: 30 sekundi za mikroservise
- **Retry Policy**: 3 pokušaja sa exponential backoff

## Security

### JWT Security
- **Secret Key**: Minimum 32 karaktera
- **Expiry**: 60 minuta za access token
- **Validation**: Issuer, Audience, Lifetime
- **Revocation**: Poništavanje tokena pri logout

### CORS Security
- **Origins**: Ograničeno na frontend domene
- **Methods**: Samo potrebne HTTP metode
- **Headers**: Samo potrebni headers
- **Credentials**: Podrška za cookies

### Input Validacija
- **Path Validation**: Validacija routing paths
- **Header Validation**: Validacija custom headers
- **XSS Protection**: HTML encoding

## Deployment

### Production Checklist
- [ ] Environment variables konfigurisani
- [ ] Health checks konfigurisani
- [ ] Logging konfigurisan
- [ ] Monitoring setup
- [ ] SSL/TLS certifikati
- [ ] JWT secret key konfigurisan
- [ ] CORS origins konfigurisani

### Environment Variables
```bash
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80
JwtSettings__SecretKey=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
JwtSettings__Issuer=MatForum.IdentityServer
JwtSettings__Audience=MatForum.API
JwtSettings__ExpiryInMinutes=60
Logging__LogLevel__Default=Warning
```

## Verifikacija

Proveri da sve radi:

```bash
# 1. Servis pokrenut?
docker ps | grep api-gateway

# 2. Health check
curl http://localhost:5000/health

# 3. Routing test
curl http://localhost:5000/api/questions/count

# 4. CORS test
curl -X OPTIONS "http://localhost:5000/api/questions" \
  -H "Origin: http://localhost:5173"

# 5. Logovi
docker logs api-gateway --tail 20
```

## NuGet Paketi

### Glavni Paketi
- `Microsoft.AspNetCore.App` 8.0.0
- `Yarp.ReverseProxy` 2.0.0
- `Microsoft.AspNetCore.Authentication.JwtBearer` 8.0.0
- `System.IdentityModel.Tokens.Jwt` 7.0.3
- `Microsoft.AspNetCore.Cors` 8.0.0
- `Microsoft.Extensions.Http` 8.0.0

### Development Paketi
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` 1.19.5

## Status

✅ YARP routing implementiran  
✅ JWT autentifikacija funkcioniše  
✅ CORS konfigurisan  
✅ Health checks implementirani  
✅ Docker konfigurisan  
✅ Load balancing  
✅ Testovano i verifikovano  

## Autor

Implementirano: 14. Oktobar 2025  
Branch: main  
Pristup: YARP sa JWT autentifikacijom

---

**Za dodatne informacije, proveri kod ili logove Docker kontejnera!**

*/
