# MatForum - Dokumentacija Servisa

Dobrodošli u MatForum API dokumentaciju! Ovo je moderni forum aplikacija sa mikroservisnom arhitekturom.

## 📋 Servisi

### Backend Servisi

- **\ref user_management_service "User Management Service"** - Upravljanje korisničkim profilima
- **\ref forum_question_service "Forum Question Service"** - Upravljanje pitanjima na forumu
- **\ref question_answer_service "Question Answer Service"** - Upravljanje odgovorima na pitanja
- **\ref voting_service "Voting Service"** - Sistem glasanja (upvote/downvote)
- **\ref identity_server_service "Identity Server"** - Autentifikacija i autorizacija
- **\ref api_gateway_service "API Gateway"** - Centralni ulaz za sve servise

## 🏗️ Arhitektura

Projekat koristi mikroservisnu arhitekturu sa sledećim komponentama:

```
┌──────────────────┐
│  API Gateway     │  HTTP/1.1 + JWT
│  (localhost:5000)│
└────────┬─────────┘
         │
         ↓
┌─────────────────────────────────────────────────────┐
│                   Mikroservisi                       │
├─────────────┬──────────────┬──────────────┬─────────┤
│   User      │   Question   │   Answer     │ Voting  │
│ Management  │   Service    │   Service    │ Service │
│ (port 5001) │ (port 5002)  │ (port 5004)  │(port 5005)│
└─────────────┴──────────────┴──────────────┴─────────┘
         │
         ↓
┌──────────────────────────┐
│    PostgreSQL Database   │
│    (matforum)            │
└──────────────────────────┘
```

## 🚀 Brzi Start

### Pokretanje Backend-a

```bash
cd MatfForum
docker-compose up --build
```

### Pokretanje Frontend-a

```bash
cd MatfForum/src/frontend
npm install --legacy-peer-deps
npm run dev
```

## 📚 Tehnologije

- **.NET 8** - Backend framework
- **PostgreSQL 15** - Baza podataka
- **React + TypeScript** - Frontend
- **YARP** - API Gateway
- **gRPC** - Inter-service komunikacija
- **Docker** - Kontejnerizacija

## 🔗 Pristupne Tačke

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:5000
- **PostgreSQL**: localhost:5432

### Swagger Dokumentacija

- **User Management**: http://localhost:5001/swagger
- **Forum Question**: http://localhost:5002/swagger
- **Question Answer**: http://localhost:5004/swagger
- **Voting**: http://localhost:5005/swagger
- **Identity Server**: http://localhost:5003/swagger

## 📖 Detaljne Informacije

Za detaljne informacije o svakom servisu, kliknite na linkove iznad ili koristite navigaciju sa leve strane.

