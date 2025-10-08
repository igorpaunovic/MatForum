# Voting System Integration - Frontend

## 📝 Šta je urađeno

Integrisan je sistem glasanja (Voting Service) u frontend aplikaciju. Sada svako pitanje na `/questions` stranici ima Upvote i Downvote dugmad sa statistikom glasova.

## 🆕 Novi fajlovi

### 1. **Voting Service** (`src/frontend/src/services/api-voting-service.ts`)
- API servis za komunikaciju sa Voting mikroservisom
- Endpointi: `vote`, `getVoteSummary`, `removeVote`
- Koristi port 5003 za Voting servis

### 2. **Voting Hooks** (`src/frontend/src/hooks/use-voting.ts`)
- `useVoteSummary(questionId)` - dobija statistiku glasova za pitanje
- `useVote(questionId)` - mutation za glasanje
- `useRemoveVote(questionId)` - mutation za uklanjanje glasa
- **Napomena:** Trenutno koristi hardkodovan `TEMP_USER_ID` - kasnije treba integrisati sa auth sistemom

### 3. **VotingButtons Component** (`src/frontend/src/components/features/voting/VotingButtons.tsx`)
- Prikazuje Upvote i Downvote dugmad
- Real-time prikaz neto rezultata (upvotes - downvotes)
- Vizuelna indikacija aktivnog glasa korisnika
- Boje: zelena za pozitivan skor, crvena za negativan

## 🔄 Izmenjeni fajlovi

### 1. **QuestionCard** (`src/frontend/src/components/features/questions/QuestionCard.tsx`)
- Dodat VotingButtons komponenta sa leve strane svakog pitanja
- Layout sada koristi flex sa voting dugmadima i sadržajem pitanja

### 2. **API Factory** (`src/frontend/src/shared/api/api-factory.ts`)
- Dodata podrška za `port` parametar
- Omogućava direktno targetiranje različitih mikroservisa u dev modu
- U produkciji sve ide kroz API Gateway (port 5000)

### 3. **Types** (`src/frontend/src/lib/types.ts`)
- Dodat `VoteSummary` interface sa poljima:
  - `upvotes`, `downvotes`, `totalVotes`, `userVote`

### 4. **Backend - CORS konfiguracija**
- **Voting Service** (`src/Services/Voting/MatForum.Voting.API/Program.cs`)
  - Dodato CORS za frontend (port 5173 i 5000)
- **Question Service** (`src/Services/ForumQuestion/MatForum.ForumQuestion.API/Program.cs`)
  - Aktiviran CORS (bio je zakomentarisan)

## 🎨 UI/UX Features

- **Upvote dugme**: Zelena boja kada je aktivno, sivo kada nije
- **Downvote dugme**: Crvena boja kada je aktivno, sivo kada nije
- **Neto skor**: Prikazuje se brojčano (upvotes - downvotes)
  - Zeleno za pozitivan skor
  - Crveno za negativan skor
  - Sivo za neutralan (0)
- **Loading state**: Prikazuje "..." dok se podaci učitavaju
- **Disabled state**: Dugmad su onesposobljena tokom mutacije ili ako je već glasano

## 🔧 Tehnički detalji

### Vote Types
```typescript
VOTE_TYPE_UPVOTE = 1
VOTE_TYPE_DOWNVOTE = -1
VOTE_TYPE_NEUTRAL = 0
```

### API Endpoints (Voting Service - Port 5003)
- `POST /api/votes/vote` - Glasanje
- `GET /api/votes/summary/{questionId}?userId={userId}` - Statistika
- `DELETE /api/votes/remove` - Uklanjanje glasa

### React Query Integration
- Automatic cache invalidation nakon glasanja
- Optimistički UI updates
- Stale time: 1 minut za vote summary

## 🚀 Kako pokrenuti

1. **Pokreni Voting servis:**
   ```bash
   cd src/Services/Voting/MatForum.Voting.API
   dotnet run
   ```
   Ili sa Docker Compose:
   ```bash
   docker-compose up voting-service
   ```

2. **Pokreni Question servis:** (ako nije već pokrenut)
   ```bash
   cd src/Services/ForumQuestion/MatForum.ForumQuestion.API
   dotnet run
   ```

3. **Pokreni frontend:**
   ```bash
   cd src/frontend
   npm run dev
   ```

4. **Otvori browser:** `http://localhost:5173/questions`

## 📋 TODO - Budući razvoj

- [ ] Integrisati pravi `userId` iz Auth konteksta (trenutno hardkodovan)
- [x] Dodati opciju za uklanjanje glasa (klik na već aktivan glas) ✅
- [ ] Prikazati tooltip sa brojem upvotes/downvotes pojedinačno
- [ ] Dodati animacije za glasanje
- [ ] Error handling sa Toaster notifikacijama
- [ ] Loading skeleton umesto "..."

## ✅ Update - Funkcionalnost za poništavanje glasa

**Dodato:** Sada možeš kliknuti na već aktivan Upvote ili Downvote da poništiš svoj glas!

- Klik na zeleno Upvote dugme → uklanja upvote (vraća na neutralno)
- Klik na crveno Downvote dugme → uklanja downvote (vraća na neutralno)
- Hover efekat pokazuje da je dugme clickable čak i kada je aktivno
- Tooltip se menja: "Remove upvote" kada je aktivan, "Upvote" kada nije

**Tehnički detalji:**
- Popravljena Postgres `TIMESTAMP WITH TIME ZONE` konfiguracija
- API Gateway ruta za `/api/votes` dodata i funkcioniše
- Frontend sada koristi API Gateway (port 5000) umesto direktnog pristupa

## 🐛 Napomene

- **User ID:** Trenutno se koristi hardkodovan `TEMP_USER_ID = "00000000-0000-0000-0000-000000000001"`
- **CORS:** Konfigurisano za lokalni development (port 5173 i 5000)
- **API Routing:** U dev modu direktno na port 5003, u produkciji kroz API Gateway

## ✅ Testiranje

Da testiraš funkcionalnost:
1. Otvori `/questions` stranicu
2. Klikni na Upvote dugme - trebalo bi da se oboji zeleno i skor da poraste
3. Klikni na Downvote - trebalo bi da se oboji crveno i skor da se promeni
4. Refresh stranicu - tvoj glas bi trebalo da ostane sačuvan
5. Otvori DevTools Network tab da vidiš API pozive ka portu 5003

---

**Napravljeno:** 8. oktobar 2025
**Status:** ✅ Kompletno i funkcionalno
