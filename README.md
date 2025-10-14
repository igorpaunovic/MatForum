# MatForum - Korisničko uputstvo

Moderni forum aplikacija izgrađena sa mikroservisnom arhitekturom, koristeći .NET 8, React, TypeScript i PostgreSQL.

## 🏗️ Arhitektura

MatForum koristi **Clean Architecture** sa mikroservisima:

- **API Gateway** - YARP reverse proxy sa JWT autentifikacijom
- **Frontend** - React + TypeScript + Vite + TanStack Router
- **Mikroservisi** - .NET 8 Web API sa Clean Architecture
- **Baza podataka** - PostgreSQL 15
- **Komunikacija** - HTTP REST API + gRPC za interne servise

## 🚀 Brzo pokretanje

### Preduslovi
- Docker i Docker Compose
- Node.js (za frontend)
- Git

### Pokretanje aplikacije

#### Backend (Mikroservisi)
```bash
# Klonirajte repozitorijum
git clone <repository-url>
cd MatForum

# Navigirajte u MatfForum direktorijum
cd MatfForum

# Pokrenite sve backend servise
docker-compose up --build -d

# Pratite logove
docker-compose logs -f
```

#### Frontend
```bash
# Navigirajte u frontend direktorijum
cd MatfForum/src/frontend

# Instalirajte dependencies
npm install --legacy-peer-deps

# Pokrenite development server
npm run dev
```

### Pristup aplikaciji

- **Frontend**: http://localhost:5173 (Vite dev server)
- **API Gateway**: http://localhost:5000
- **PostgreSQL**: localhost:15432
- **Swagger dokumentacija**: 
  - User Service: http://localhost:5001/swagger
  - Question Service: http://localhost:5002/swagger
  - Answer Service: http://localhost:5004/swagger
  - Voting Service: http://localhost:5003/swagger
  - Identity Server: http://localhost:5005/swagger

## 📁 Struktura projekta

```
MatForum/
├── MatfForum/
│   ├── src/
│   │   ├── ApiGateway/                    # YARP reverse proxy
│   │   │   └── MatForum.ApiGateway/
│   │   ├── frontend/                      # React aplikacija
│   │   │   ├── src/
│   │   │   │   ├── components/            # UI komponente
│   │   │   │   ├── routes/               # TanStack Router rute
│   │   │   │   ├── services/             # API servisi
│   │   │   │   └── hooks/                # React hooks
│   │   │   ├── package.json
│   │   │   └── vite.config.ts
│   │   ├── Services/                      # Mikroservisi
│   │   │   ├── UserManagement/           # Korisnici i profili
│   │   │   │   ├── MatForum.UserManagement.API/
│   │   │   │   ├── MatForum.UserManagement.Application/
│   │   │   │   ├── MatForum.UserManagement.Domain/
│   │   │   │   └── MatForum.UserManagement.Infrastructure/
│   │   │   ├── ForumQuestion/            # Pitanja i kategorije
│   │   │   │   ├── MatForum.ForumQuestion.API/
│   │   │   │   ├── MatForum.ForumQuestion.Application/
│   │   │   │   ├── MatForum.ForumQuestion.Domain/
│   │   │   │   ├── MatForum.ForumQuestion.Infrastructure/
│   │   │   │   └── MatForum.ForumQuestion.GRPC/  # gRPC servis
│   │   │   ├── QuestionAnswer/           # Odgovori na pitanja
│   │   │   │   ├── MatForum.QuestionAnswer.API/
│   │   │   │   ├── MatForum.QuestionAnswer.Application/
│   │   │   │   ├── MatForum.QuestionAnswer.Domain/
│   │   │   │   └── MatForum.QuestionAnswer.Infrastructure/
│   │   │   └── Voting/                   # Glasanje
│   │   │       ├── MatForum.Voting.API/
│   │   │       ├── MatForum.Voting.Application/
│   │   │       ├── MatForum.Voting.Domain/
│   │   │       └── MatForum.Voting.Infrastructure/
│   │   ├── Security/                     # Autentifikacija i autorizacija
│   │   │   ├── MatForum.IdentityServer.API/
│   │   │   ├── MatForum.IdentityServer.Application/
│   │   │   ├── MatForum.IdentityServer.Domain/
│   │   │   └── MatForum.IdentityServer.Infrastructure/
│   │   └── Shared/                       # Deljeni kod
│   │       ├── MatForum.Shared.Contracts/
│   │       ├── MatForum.Shared.Domain/
│   │       └── MatForum.Shared.Infrastructure/
│   ├── docker-compose.yml               # Glavna Docker konfiguracija
│   └── MatForum.sln                     # Visual Studio solution
└── README.md
```

## 🔧 Servisi i portovi

| Servis | Port | Opis |
|--------|------|------|
| **API Gateway** | 5000 | YARP reverse proxy sa JWT autentifikacijom |
| **User Management** | 5001 | Upravljanje korisnicima i profilima |
| **Forum Question** | 5002 | Upravljanje pitanjima i kategorijama |
| **Question Answer** | 5004 | Upravljanje odgovorima |
| **Voting** | 5003 | Glasovanje na pitanja i odgovore |
| **Identity Server** | 5005 | JWT autentifikacija i autorizacija |
| **Question gRPC** | 5010 | gRPC servis za validaciju pitanja |
| **PostgreSQL** | 15432 | Baza podataka |

## 🎨 Frontend tehnologije

- **React 19** - UI biblioteka
- **TypeScript** - Tipizirani JavaScript
- **Vite** - Build tool i dev server
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI komponente
- **Lucide React** - Ikonice
- **Zod** - Schema validacija
- **Axios** - HTTP klijent

## 🔐 Autentifikacija i sigurnost

- **JWT tokeni** za autentifikaciju
- **API Gateway** centralizuje autentifikaciju
- **Mikroservisi** ne validiraju JWT direktno - veruju API Gateway-u
- **CORS** konfiguracija za frontend
- **HTTPS** za gRPC komunikaciju

## 🗄️ Baza podataka

- **PostgreSQL 15** kao glavna baza
- **Entity Framework Core** za ORM
- **Migracije** se automatski primenjuju pri pokretanju
- **Connection string**: `Host=postgres;Database=matforum;Username=matforum_user;Password=matforum_password`

## 🐳 Docker konfiguracija

### docker-compose.yml
- Svi servisi u jednom fajlu
- Health checks za PostgreSQL
- Volume mounting za certifikate
- Network komunikacija između servisa

## 🔄 Komunikacija između servisa

1. **Frontend → API Gateway**: HTTP REST
2. **API Gateway → Mikroservisi**: HTTP REST
3. **Answer Service → Question gRPC**: gRPC sa HTTPS
4. **Mikroservisi → PostgreSQL**: Entity Framework

## 📚 Dokumentacija

Projekat ima kompletnu dokumentaciju za backend i frontend.

### 🌐 Pregled Dokumentacije

#### Backend Dokumentacija (Doxygen)
Otvorite `docs/doxygen/html/index.html` u browseru ili pokrenite:
```bash
open docs/doxygen/html/index.html
```

Backend dokumentacija uključuje:
- **Pregled svih servisa** - Centralna strana sa linkovima ka svim servisima
- **User Management Service** - Upravljanje korisničkim profilima
- **Forum Question Service** - Upravljanje pitanjima
- **Question Answer Service** - Upravljanje odgovorima
- **Voting Service** - Sistem glasanja
- **Identity Server** - Autentifikacija i autorizacija
- **API Gateway** - YARP reverse proxy
- **API Reference** - Sve klase, interfejsi i metode
- **Dijagrami** - Class diagrams, call graphs

#### Frontend Dokumentacija
Otvorite `docs/frontend/index.html` u browseru ili pokrenite:
```bash
open docs/frontend/index.html
```

Frontend dokumentacija uključuje:
- Pregled tehnologija (React, TypeScript, Vite, TanStack)
- Strukturu projekta
- Instalaciju i pokretanje
- Ključne funkcionalnosti
- API integraciju
- Styling sa Tailwind CSS

### 🔄 Regenerisanje Dokumentacije

#### Backend dokumentacija (Doxygen)
```bash
# Iz root direktorijuma projekta
cd /Users/factoryww/MatForum
doxygen Doxyfile

# Dokumentacija će biti generisana u docs/doxygen/html/
```

#### Frontend dokumentacija
Frontend dokumentacija je već generisana i nalazi se u `docs/frontend/index.html`.

Ako želite da regenerišete backend dokumentaciju:
```bash
# Iz root direktorijuma projekta
cd /Users/factoryww/MatForum
doxygen Doxyfile
```

### 📖 Pristup Dokumentaciji

#### Lokalni pregled
```bash
# Backend dokumentacija
open docs/doxygen/html/index.html

# Frontend dokumentacija
open docs/frontend/index.html

# Ili koristite Python HTTP server za sve
cd docs
python3 -m http.server 8000
# Backend: http://localhost:8000/doxygen/html/
# Frontend: http://localhost:8000/frontend/
```

### Sadržaj dokumentacije

Svaki README fajl sadrži:
- **Pregled servisa** - Opis funkcionalnosti
- **Arhitektura** - Dijagram komunikacije
- **API Endpoints** - Kompletna lista endpoint-a
- **Struktura projekta** - Organizacija fajlova
- **Baza podataka** - Konfiguracija i migracije
- **Komunikacija** - Inter-service komunikacija
- **Autentifikacija** - JWT i autorizacija
- **Docker konfiguracija** - Container setup
- **Pokretanje** - Instrukcije za development
- **Testiranje** - cURL primeri i testovi
- **Troubleshooting** - Rešavanje problema
- **Performance** - Optimizacije
- **Security** - Sigurnosne mere
- **Deployment** - Production setup

### Pisanje dokumentacionih komentara

#### Backend (C# - Doxygen format)
```csharp
/// <summary>
/// Kreira novo forum pitanje
/// </summary>
/// <param name="command">Komanda sa podacima za kreiranje pitanja</param>
/// <returns>DTO kreiranog pitanja</returns>
/// <exception cref="InvalidOperationException">Baca se kada korisnik ne postoji</exception>
public async Task<QuestionDto> CreateQuestion(CreateQuestionCommand command)
{
    // Implementation
}
```

#### Frontend (TypeScript - JSDoc format)
```typescript
/**
 * Komponenta za prikaz liste pitanja
 * @component
 * @param {QuestionListProps} props - Props objekat
 * @param {Question[]} props.questions - Lista pitanja
 * @returns {JSX.Element} JSX element sa listom pitanja
 * @example
 * ```tsx
 * <QuestionList questions={questions} />
 * ```
 */
const QuestionList = ({ questions }: QuestionListProps) => {
    // Implementation
};
```

## 🛠️ Razvoj

### Pokretanje frontend-a za razvoj

```bash
cd MatfForum/src/frontend
npm install --legacy-peer-deps
npm run dev
```

### Build frontend-a

```bash
cd MatfForum/src/frontend
npm run build
```

### Zaustavljanje servisa

```bash
docker-compose down
```

### Brisanje volumena (briše bazu)

```bash
docker-compose down -v
```

## 🚨 Troubleshooting

### Česti problemi

1. **Portovi zauzeti**: Proverite da li su portovi 5000-5010 slobodni
2. **Baza se ne povezuje**: Sačekajte da PostgreSQL završi sa inicijalizacijom
3. **gRPC greške**: Proverite certifikate u `certs/` direktorijumu
4. **Frontend se ne povezuje**: Proverite CORS konfiguraciju u API Gateway-u

### Logovi za debug

```bash
# Detaljni logovi
docker-compose logs --tail=100 -f

# Logovi specifičnog servisa
docker-compose logs -f postgres
docker-compose logs -f matforum.apigateway
```

## 📚 Dodatni resursi

- [YARP dokumentacija](https://microsoft.github.io/reverse-proxy/)
- [TanStack Router](https://tanstack.com/router)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)

## 🤝 Doprinos

1. Fork repozitorijum
2. Kreirajte feature branch (`git checkout -b feature/amazing-feature`)
3. Commit izmene (`git commit -m 'Add amazing feature'`)
4. Push na branch (`git push origin feature/amazing-feature`)
5. Otvorite Pull Request

## 📄 Licenca

Ovaj projekat je licenciran pod MIT licencom - pogledajte [LICENSE](LICENSE) fajl za detalje.
