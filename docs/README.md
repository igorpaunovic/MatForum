# MatForum Dokumentacija

Dobrodošli u MatForum dokumentaciju! Ovde možete pronaći kompletnu tehničku dokumentaciju za backend i frontend deo projekta.

## 📚 Dostupna dokumentacija

### Backend Dokumentacija (Doxygen)
- **Lokacija**: `doxygen/html/index.html`
- **Tehnologija**: Doxygen 1.14.0
- **Pokriva**: 
  - Sve .NET mikroservise
  - API kontrolere
  - Servise i repozitorijume
  - Domain entitete
  - DTOs i interfejse

**Otvorite**: `open doxygen/html/index.html` ili `file:///Users/factoryww/MatForum/docs/doxygen/html/index.html`

### Frontend Dokumentacija (Compodoc)
- **Lokacija**: `frontend/index.html`
- **Tehnologija**: Compodoc
- **Pokriva**:
  - React komponente
  - TypeScript tipove
  - Hooks i servise
  - Routing struktura
  - API klijente

**Otvorite**: `open frontend/index.html` ili `file:///Users/factoryww/MatForum/docs/frontend/index.html`

## 🔄 Regenerisanje dokumentacije

### Backend (Doxygen)
```bash
cd /Users/factoryww/MatForum
doxygen Doxyfile
```

### Frontend (Compodoc)
```bash
cd /Users/factoryww/MatForum/MatfForum/src/frontend
npm run docs:frontend
```

### Sve odjednom
```bash
cd /Users/factoryww/MatForum/MatfForum/src/frontend
npm run docs:all
```

## 🌐 Lokalni server za dokumentaciju

Možete pokrenuti lokalni HTTP server za pregled dokumentacije:

```bash
cd /Users/factoryww/MatForum/docs
python3 -m http.server 8000
```

Zatim otvorite:
- Backend: http://localhost:8000/doxygen/html/
- Frontend: http://localhost:8000/compodoc/

## 📝 Kako doprineti dokumentaciji

### Backend (C# - XML komentari)
Koristite XML komentare za dokumentovanje C# koda:

```csharp
/// <summary>
/// Kratki opis metode
/// </summary>
/// <param name="parametar">Opis parametra</param>
/// <returns>Opis povratne vrednosti</returns>
/// <exception cref="Exception">Kada se baca izuzetak</exception>
/// <remarks>
/// Dodatne napomene i detalji
/// </remarks>
public async Task<Result> Method(string parametar)
{
    // Implementation
}
```

### Frontend (TypeScript - JSDoc)
Koristite JSDoc komentare za dokumentovanje TypeScript/React koda:

```typescript
/**
 * Komponenta za prikaz liste
 * @component
 * @param {Props} props - Props objekat
 * @param {string} props.title - Naslov liste
 * @returns {JSX.Element} JSX element
 * @example
 * ```tsx
 * <MyComponent title="Hello" />
 * ```
 */
const MyComponent = ({ title }: Props) => {
    // Implementation
};
```

## 🔍 Pretraživanje dokumentacije

Obe dokumentacije imaju ugrađenu funkcionalnost pretrage:
- **Doxygen**: Pretraga u gornjem desnom uglu
- **Compodoc**: Pretraga u navigacionom meniju

## 📊 Statistika dokumentacije

Dokumentacija pokriva:
- **Backend**: ~245 fajlova
- **Frontend**: ~31 interfejsa, 14 type aliasa
- **Ukupno**: Kompletna arhitektura mikroservisa

## 🛠️ Alati

- [Doxygen](https://www.doxygen.nl/) - Generator dokumentacije za C++, C#, Java i druge jezike
- [Compodoc](https://compodoc.app/) - Generator dokumentacije za Angular/React/Vue aplikacije

## 📞 Podrška

Za pitanja o dokumentaciji, kontaktirajte tim ili otvorite issue na GitHub-u.

