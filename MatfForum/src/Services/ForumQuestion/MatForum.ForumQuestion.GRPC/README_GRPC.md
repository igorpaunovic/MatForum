# gRPC Validacija Pitanja - Implementacija

## Pregled

Implementirana je **gRPC komunikacija sa TLS certifikatima** između ForumQuestion i QuestionAnswer servisa. 

Kada se kreira novi odgovor (Answer), sistem automatski validira preko gRPC-a da li pitanje (Question) postoji i da li je aktivno (nije obrisano - `IsDeleted = false`).

## Arhitektura

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ├─────────────────────────┬──────────────────────┐
         ↓                         ↓                      ↓
┌─────────────────┐     ┌──────────────────┐   ┌─────────────────────┐
│ QuestionAnswer  │     │ ForumQuestion    │   │ ForumQuestion GRPC  │
│    Service      │     │   Service        │   │     Service         │
│ (port 5004)     │     │ (port 5002)      │   │ (port 5010)         │
│                 │     │                  │   │                     │
│ REST API (HTTP) │     │ REST API (HTTP)  │   │ gRPC (HTTPS+TLS)    │
└────────┬────────┘     └──────────────────┘   └──────────┬──────────┘
         │                                                  ↑
         │                                                  │
         │           gRPC Call preko HTTPS                 │
         │         ValidateQuestion(questionId)            │
         └──────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────┐
│    PostgreSQL Database   │
│    (matforum)            │
└──────────────────────────┘
```

## Kako Funkcioniše

### 1. Klijent kreira odgovor
```
POST http://localhost:5000/api/answers
Authorization: Bearer JWT_TOKEN
{
  "content": "Moj odgovor",
  "questionId": "guid-pitanja",
  "userId": "guid-korisnika"
}
```

### 2. Answer Service poziva gRPC validaciju
```csharp
// AnswersController.cs
var questionExists = await _questionValidator.ExistsAsync(request.QuestionId, cancellationToken);
if (!questionExists)
    return NotFound(new { Message = "Question not found." });
```

### 3. gRPC Klijent šalje HTTPS zahtev
```csharp
// QuestionValidator.cs
var request = new ValidateQuestionRequest { QuestionId = questionId.ToString() };
var response = await _grpcClient.ValidateQuestionAsync(request, cancellationToken: cancellationToken);

// Pitanje mora postojati I biti aktivno
return response.Exists && response.IsActive;
```

### 4. gRPC Server validira pitanje
```csharp
// QuestionValidationGrpcService.cs
var question = await _questionRepository.GetById(questionId);

if (question == null)
    return new ValidateQuestionResponse { Exists = false, IsActive = false };

if (question.IsDeleted)
    return new ValidateQuestionResponse { Exists = true, IsActive = false };

return new ValidateQuestionResponse { Exists = true, IsActive = true };
```

### 5. Rezultat validacije
- ✅ **Pitanje postoji i aktivno je** → Answer se kreira
- ❌ **Pitanje je obrisano** → 404 Not Found
- ❌ **Pitanje ne postoji** → 404 Not Found

## gRPC Proto Definicija

**Lokacija**: `src/Services/ForumQuestion/MatForum.ForumQuestion.GRPC/Protos/QuestionValidation.proto`

```protobuf
syntax = "proto3";

option csharp_namespace = "MatForum.ForumQuestion.GRPC";

service QuestionValidationService {
  rpc ValidateQuestion (ValidateQuestionRequest) returns (ValidateQuestionResponse);
}

message ValidateQuestionRequest {
  string questionId = 1;
}

message ValidateQuestionResponse {
  bool exists = 1;
  bool isActive = 2;
  string message = 3;
}
```

## TLS Certifikati

### Generisanje (Self-signed za Development)

```bash
cd /Users/factoryww/MatForum/MatfForum

# Kreiraj certifikat
openssl req -x509 -newkey rsa:4096 \
  -keyout certs/grpc-key.pem \
  -out certs/grpc-cert.pem \
  -days 365 -nodes \
  -subj "/CN=question-grpc-service" \
  -addext "subjectAltName=DNS:question-grpc-service,DNS:localhost"

# Konvertuj u PFX format za .NET
openssl pkcs12 -export \
  -out certs/grpc-cert.pfx \
  -inkey certs/grpc-key.pem \
  -in certs/grpc-cert.pem \
  -passout pass:SecurePassword123
```

### Struktura

```
certs/
├── grpc-cert.pem  # X.509 certifikat
├── grpc-key.pem   # Privatni ključ
└── grpc-cert.pfx  # PKCS#12 format za .NET
```

## Konfiguracija

### ForumQuestion.GRPC Service (Server)

**appsettings.Development.json**:
```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://+:443",
        "Certificate": {
          "Path": "/app/certs/grpc-cert.pfx",
          "Password": "SecurePassword123"
        }
      }
    }
  }
}
```

**Docker Compose**:
```yaml
question-grpc-service:
  environment:
    - ASPNETCORE_URLS=https://+:443
  ports:
    - "5010:443"
  volumes:
    - ./certs:/app/certs:ro
```

### QuestionAnswer Service (Client)

**Program.cs**:
```csharp
// Enable HTTP/2 support
AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

// Register gRPC client with HTTPS
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

## Projekti

### 1. MatForum.ForumQuestion.GRPC (Novi Dedicirani gRPC Servis)

```
src/Services/ForumQuestion/MatForum.ForumQuestion.GRPC/
├── MatForum.ForumQuestion.GRPC.csproj
├── Program.cs
├── Dockerfile
├── appsettings.json
├── appsettings.Development.json
├── Protos/
│   └── QuestionValidation.proto
└── Services/
    └── QuestionValidationGrpcService.cs
```

**Svrha**: Dedicirani gRPC server koji validira pitanja preko HTTPS/TLS

### 2. MatForum.QuestionAnswer.Infrastructure

**QuestionValidator.cs** - Refaktorisan sa HTTP na gRPC:
```csharp
public async Task<bool> ExistsAsync(Guid questionId, CancellationToken cancellationToken)
{
    try
    {
        var request = new ValidateQuestionRequest { QuestionId = questionId.ToString() };
        var response = await _grpcClient.ValidateQuestionAsync(request, cancellationToken: cancellationToken);
        
        return response.Exists && response.IsActive;
    }
    catch (RpcException ex)
    {
        _logger.LogError(ex, "gRPC error while validating question {QuestionId}", questionId);
        return false;
    }
}
```

## Docker Servisi

| Servis | Port | Protokol | Svrha |
|--------|------|----------|-------|
| API Gateway | 5000 | HTTP | Ulazna tačka, JWT validacija |
| question-service | 5002 | HTTP | REST API za pitanja |
| **question-grpc-service** | 5010 | **HTTPS** | **gRPC validacija pitanja** |
| answer-service | 5004 | HTTP | REST API za odgovore |
| user-service | 5001 | HTTP | Korisnički servis |

## Pokretanje

```bash
cd /Users/factoryww/MatForum/MatfForum

# Podigni sve servise
docker-compose up -d

# Proveri status
docker ps

# Proveri da gRPC servis sluša HTTPS
docker logs question-grpc-service --tail 20 | grep "listening"
# Očekivano: "Now listening on: https://[::]:443"
```

## Testiranje

### Scenario 1: Kreiranje odgovora za aktivno pitanje

```bash
# 1. Login (preko API Gateway-a)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"Admin123!"}'

# Sačuvaj accessToken

# 2. Kreiraj pitanje
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"Test Question",
    "content":"This is a test",
    "tags":["test"]
  }'

# Sačuvaj questionId

# 3. Kreiraj odgovor (gRPC validacija se dešava ovde!)
curl -X POST http://localhost:5000/api/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content":"My answer",
    "questionId":"YOUR_QUESTION_ID",
    "userId":"YOUR_USER_ID"
  }'
```

**Rezultat**: ✅ 201 Created - Answer je kreiran

**Logovi**:
```bash
docker logs answer-service --tail 50 | grep "Question validation"
# Očekivano: "Question validation result - Exists: True, IsActive: True"

docker logs question-grpc-service --tail 50 | grep "gRPC"
# Očekivano: "gRPC ValidateQuestion called for QuestionId: ..."
```

### Scenario 2: Pokušaj kreiranja odgovora za obrisano pitanje

```bash
# 1. Obriši pitanje
curl -X DELETE http://localhost:5000/api/questions/QUESTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Pokušaj kreirati odgovor
curl -X POST http://localhost:5000/api/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content":"This should fail",
    "questionId":"DELETED_QUESTION_ID",
    "userId":"YOUR_USER_ID"
  }'
```

**Rezultat**: ❌ 404 Not Found - "Question not found."

**Logovi**:
```
Question validation result - Exists: True, IsActive: False
gRPC ValidateQuestion called for QuestionId: ... (question is deleted)
```

## Logovanje

### Answer Service (gRPC Client):
```
info: Validating question via gRPC: {QuestionId}
info: Sending HTTP request POST https://question-grpc-service/QuestionValidationService/ValidateQuestion
info: Received HTTP response headers - 200
info: Question validation result - Exists: True, IsActive: True, Message: Question is valid and active
```

### Question GRPC Service (gRPC Server):
```
info: gRPC ValidateQuestion called for QuestionId: {QuestionId}
info: Question is valid and active: {QuestionId}
```

## Prednosti gRPC Pristupa

1. **Performanse**: Protocol Buffers su brži od JSON serializacije
2. **Tipiziranost**: Strongly-typed interfejs
3. **HTTP/2**: Multiplexing, server push, header compression
4. **Jasna separacija**: REST API i gRPC na odvojenim servisima
5. **Security**: TLS/HTTPS enkripcija

## Struktura Projekata

```
src/Services/
├── ForumQuestion/
│   ├── MatForum.ForumQuestion.API/         # REST API (HTTP)
│   │   ├── Controllers/
│   │   │   └── QuestionsController.cs
│   │   └── Program.cs (bez gRPC koda)
│   │
│   ├── MatForum.ForumQuestion.GRPC/        # gRPC Service (HTTPS)
│   │   ├── Services/
│   │   │   └── QuestionValidationGrpcService.cs
│   │   ├── Protos/
│   │   │   └── QuestionValidation.proto
│   │   └── Program.cs (samo gRPC)
│   │
│   ├── MatForum.ForumQuestion.Application/
│   ├── MatForum.ForumQuestion.Domain/
│   └── MatForum.ForumQuestion.Infrastructure/
│
└── QuestionAnswer/
    ├── MatForum.QuestionAnswer.API/
    │   ├── Controllers/
    │   │   └── AnswersController.cs
    │   └── Program.cs (registruje gRPC klijent)
    │
    ├── MatForum.QuestionAnswer.Application/
    │   └── Interfaces/
    │       └── IQuestionValidator.cs
    │
    ├── MatForum.QuestionAnswer.Domain/
    └── MatForum.QuestionAnswer.Infrastructure/
        └── Services/
            └── QuestionValidator.cs (gRPC klijent)
```

## Zašto Dedicirani gRPC Servis?

**Problem**: REST API sa HTTP/1.1 ne može da podržava gRPC koji zahteva HTTP/2

**Rešenje**: Zaseban servis sa HTTPS/TLS koji omogućava HTTP/2

**Prednosti**:
- ✅ REST API ostaje na HTTP/1.1 (kompatibilno sa API Gateway-em)
- ✅ gRPC servis može da koristi HTTP/2 sa TLS-om
- ✅ Jasna separacija odgovornosti
- ✅ Nezavisno skaliranje (ako je potrebno)

## Troubleshooting

### Problem: "Question not found" greška

**Proveri**:
1. Da li pitanje zaista postoji?
   ```bash
   curl http://localhost:5000/api/questions/QUESTION_ID
   ```

2. Da li je pitanje obrisano?
   ```bash
   curl http://localhost:5000/api/questions/QUESTION_ID
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

### Problem: HTTP_1_1_REQUIRED error

**Rešenje**: Ovo je rešeno sa TLS certifikatima. Ako i dalje vidiš ovu grešku:
1. Proveri da je question-grpc-service rebuild-ovan
2. Proveri da koristi HTTPS URL (`https://question-grpc-service`)
3. Proveri da certifikati postoje u kontejneru: `docker exec question-grpc-service ls -la /app/certs`

## Production Deploy

Za production okruženje:

1. **Koristi prave SSL certifikate** (ne self-signed)
   - Let's Encrypt
   - Wildcard certifikat
   - CA-issued certifikat

2. **Ukloni** `ServerCertificateCustomValidationCallback` iz klijenta

3. **Dodaj** proper certificate validation

4. **Konfiguriši** Kubernetes secrets ili Docker secrets za certifikate

## Verifikacija

Proveri da sve radi:

```bash
# 1. Svi kontejneri pokrenuti?
docker ps | grep -E "question-grpc|answer|api"

# 2. gRPC servis sluša HTTPS?
docker logs question-grpc-service --tail 10 | grep "https"

# 3. Test kreiranje odgovora
curl -X POST http://localhost:5004/api/answers \
  -H "Content-Type: application/json" \
  -d '{"content":"test","questionId":"SOME_ID","userId":"USER_ID"}'

# 4. Proveri logove
docker logs answer-service --tail 30 | grep "Question validation"
docker logs question-grpc-service --tail 30 | grep "gRPC"
```

## NuGet Paketi

### ForumQuestion.GRPC (Server):
- `Google.Protobuf` 3.29.1
- `Grpc.AspNetCore` 2.67.0
- `Grpc.Core` 2.46.6
- `Grpc.Tools` 2.68.1

### QuestionAnswer.Infrastructure (Client):
- `Google.Protobuf` 3.29.1
- `Grpc.Net.ClientFactory` 2.67.0
- `Grpc.Tools` 2.68.1

## Status

✅ gRPC komunikacija implementirana  
✅ TLS/HTTPS konfigurisan  
✅ Validacija pitanja funkcioniše  
✅ Testovano i verifikovano  
✅ Dedicirani gRPC servis kreiran  
✅ Dokumentacija kompletna  

## Autor

Implementirano: 13. Oktobar 2025  
Branch: feature/grpc  
Pristup: Dedicirani gRPC servis sa TLS certifikatima

---

**Za dodatne informacije, proveri kod ili logove Docker kontejnera!**

