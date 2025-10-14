# MatForum Frontend

## Pregled

**MatForum Frontend** je React aplikacija napisana u TypeScript-u koja koristi Vite kao build tool, TanStack Router za rutiranje, Tailwind CSS za stilizovanje i TanStack Query za state management.

## Arhitektura

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                │
│                    (localhost:5173)                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   React     │  │ TanStack    │  │   Tailwind  │            │
│  │ Components  │  │   Router    │  │     CSS     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ TanStack    │  │   Vite      │  │ TypeScript  │            │
│  │   Query     │  │ Build Tool  │  │   Language  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS API Calls
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
│                     (localhost:5000)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Tehnologije

### Core Framework
- **React 18** - UI biblioteka
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 5** - Build tool i dev server

### Routing
- **TanStack Router** - Type-safe routing
- **File-based routing** - Automatsko generisanje ruta

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Komponente UI biblioteke
- **Lucide React** - Ikonice

### State Management
- **TanStack Query** - Server state management
- **React Context** - Local state management
- **Zod** - Schema validacija

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Struktura Projekta

```
src/
├── app/                          # App konfiguracija
│   ├── main.tsx                  # Entry point
│   ├── router.tsx                # Router konfiguracija
│   └── providers/                # Context providers
│       └── index.tsx
├── components/                   # React komponente
│   ├── common/                   # Zajedničke komponente
│   │   └── Taglist.tsx
│   ├── features/                 # Feature-specific komponente
│   │   ├── answers/              # Answer komponente
│   │   │   ├── AnswerForm.tsx
│   │   │   ├── AnswerItem.tsx
│   │   │   └── AnswerList.tsx
│   │   ├── questions/            # Question komponente
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── QuestionDetail.tsx
│   │   │   ├── QuestionList.tsx
│   │   │   └── SimilarQuestions.tsx
│   │   └── voting/               # Voting komponente
│   │       └── VotingButtons.tsx
│   ├── layout/                   # Layout komponente
│   │   └── navbar.tsx
│   ├── sections/                 # Page sekcije
│   │   ├── CTASection.tsx
│   │   ├── GuidelinesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PopularTopicsSection.tsx
│   │   └── QuickStartSection.tsx
│   └── ui/                       # UI komponente (shadcn/ui)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       └── ...
├── hooks/                        # Custom React hooks
│   ├── use-contributor-profile.ts
│   ├── use-create-question.ts
│   ├── use-get-questions.ts
│   ├── use-question-details.ts
│   ├── use-search-questions.ts
│   ├── use-theme.tsx
│   ├── use-top-contributors.ts
│   ├── use-user-profile.ts
│   ├── use-voting.ts
│   ├── useSlideIn.ts
│   └── useTypewriter.ts
├── lib/                          # Utility funkcije
│   ├── types.ts                  # TypeScript tipovi
│   └── utils.ts                  # Utility funkcije
├── routes/                       # TanStack Router rute
│   ├── ~__root.tsx               # Root layout
│   ├── ~_protected/              # Zaštićene rute
│   │   ├── ~route.tsx            # Protected layout
│   │   ├── ~ask/                 # Ask question
│   │   │   ├── ~route.tsx
│   │   │   └── components/
│   │   │       └── CreateQuestionForm.tsx
│   │   └── ~profile/             # User profile
│   │       └── ~route.tsx
│   └── ~(public)/                # Javne rute
│       ├── ~_auth/               # Autentifikacija
│       │   ├── ~route.tsx        # Auth layout
│       │   ├── ~login/           # Login
│       │   │   ├── ~route.tsx
│       │   │   └── api/
│       │   │       └── login-email.ts
│       │   └── ~signup/          # Signup
│       │       ├── ~route.tsx
│       │       └── api/
│       │           └── signup.ts
│       ├── ~index/               # Home page
│       │   └── ~route.tsx
│       ├── ~members/             # Members
│       │   ├── ~index.tsx        # Members list
│       │   └── ~$userId.tsx      # Member profile
│       └── ~questions/           # Questions
│           ├── ~index.tsx        # Questions list
│           └── ~$questionId.tsx  # Question detail
├── services/                     # API servisi
│   ├── api-answer-service.ts
│   ├── api-contributor-service.ts
│   ├── api-question-service.ts
│   ├── api-statistics-service.ts
│   ├── api-user-profile-service.ts
│   ├── api-voting-service.ts
│   └── auth-service.ts
├── shared/                       # Shared utilities
│   ├── api/                      # API konfiguracija
│   │   ├── api-factory.ts
│   │   └── queryClient.ts
│   └── config/                   # Konfiguracija
│       └── index.ts
└── api/                          # API hooks
    └── auth/
        ├── index.ts
        └── me.ts
```

## Komponente

### UI Komponente (shadcn/ui)
- **Avatar** - Korisnički avatar
- **Badge** - Status badge
- **Button** - Dugmad sa različitim varijantama
- **Card** - Kartice za sadržaj
- **Dialog** - Modal dijalog
- **Form** - Form komponente
- **Input** - Input polja
- **Select** - Dropdown selektori
- **Textarea** - Multi-line input
- **Toast** - Notifikacije

### Feature Komponente
- **QuestionCard** - Prikaz pitanja u listi
- **QuestionDetail** - Detaljni prikaz pitanja
- **QuestionList** - Lista pitanja
- **AnswerForm** - Forma za kreiranje odgovora
- **AnswerItem** - Prikaz odgovora
- **AnswerList** - Lista odgovora
- **VotingButtons** - Dugmad za glasanje
- **SimilarQuestions** - Slična pitanja

### Layout Komponente
- **Navbar** - Navigaciona traka
- **HeroSection** - Glavna sekcija
- **CTASection** - Call-to-action sekcija
- **GuidelinesSection** - Smernice
- **PopularTopicsSection** - Popularne teme
- **QuickStartSection** - Brzi početak

## Hooks

### Data Fetching Hooks
- **useGetQuestions** - Dohvatanje pitanja
- **useQuestionDetails** - Detalji pitanja
- **useSearchQuestions** - Pretraga pitanja
- **useCreateQuestion** - Kreiranje pitanja
- **useTopContributors** - Top korisnici
- **useContributorProfile** - Profil korisnika
- **useUserProfile** - Korisnički profil
- **useVoting** - Glasanje

### UI Hooks
- **useTheme** - Tema (light/dark)
- **useSlideIn** - Animacija slajda
- **useTypewriter** - Typewriter efekat

## API Servisi

### Question Service
```typescript
// Dohvatanje pitanja
const { data: questions } = useGetQuestions({
  page: 1,
  pageSize: 10
});

// Kreiranje pitanja
const createQuestion = useCreateQuestion();
```

### Answer Service
```typescript
// Dohvatanje odgovora
const { data: answers } = useGetAnswersByQuestionId(questionId);

// Kreiranje odgovora
const createAnswer = useCreateAnswer();
```

### Voting Service
```typescript
// Glasanje
const vote = useVote();
const removeVote = useRemoveVote();

// Statistike glasanja
const { data: voteSummary } = useVoteSummary(questionId);
```

### Auth Service
```typescript
// Prijava
const login = useSignInEmailMutation();

// Registracija
const signup = useSignUpEmailMutation();

// Korisnički podaci
const { data: user } = useMe();
```

## Rutiranje

### File-based Routing
TanStack Router koristi file-based routing sistem:

```
routes/
├── ~__root.tsx              # / (root)
├── ~_protected/             # Zaštićene rute
│   ├── ~route.tsx           # /protected
│   ├── ~ask/~route.tsx      # /protected/ask
│   └── ~profile/~route.tsx  # /protected/profile
└── ~(public)/               # Javne rute
    ├── ~index/~route.tsx    # /
    ├── ~questions/          # /questions
    │   ├── ~index.tsx       # /questions
    │   └── ~$questionId.tsx # /questions/:id
    └── ~members/            # /members
        ├── ~index.tsx       # /members
        └── ~$userId.tsx     # /members/:id
```

### Route Guards
```typescript
// Zaštićene rute
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/protected',
  component: ProtectedLayout,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' });
    }
  }
});
```

## State Management

### TanStack Query
```typescript
// Query konfiguracija
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minuta
      cacheTime: 10 * 60 * 1000, // 10 minuta
    },
  },
});

// Custom hook
const useGetQuestions = (params: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionService.getQuestions(params),
  });
};
```

### React Context
```typescript
// Theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

## Styling

### Tailwind CSS
```typescript
// Utility classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    MatForum
  </h1>
</div>
```

### shadcn/ui Komponente
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Question Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Submit</Button>
  </CardContent>
</Card>
```

## Form Handling

### React Hook Form + Zod
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const questionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const QuestionForm = () => {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = (data: QuestionFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

## Development

### Pokretanje
```bash
# Instalacija dependencies
npm install --legacy-peer-deps

# Development server
npm run dev

# Build za production
npm run build

# Preview production build
npm run preview
```

### Scripts
```json
{
  "scripts": {
    "dev": "vite --port 5173 --host",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "docs:frontend": "compodoc -c .compodocrc.json",
    "docs:frontend:serve": "compodoc -c .compodocrc.json -s",
    "docs:backend": "cd ../../../ && doxygen Doxyfile",
    "docs:all": "npm run docs:backend && npm run docs:frontend"
  }
}
```

## Konfiguracija

### Vite Config
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind Config
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... ostale boje
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

## API Integracija

### API Factory
```typescript
import { createApi } from '@/shared/api/api-factory';

export const questionApi = createApi({
  baseURL: '/api/questions',
  endpoints: {
    getQuestions: {
      method: 'GET',
      url: '/',
    },
    createQuestion: {
      method: 'POST',
      url: '/',
    },
    getQuestionById: {
      method: 'GET',
      url: '/:id',
    },
  },
});
```

### Query Hooks
```typescript
export const useGetQuestions = (params: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionApi.getQuestions(params),
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateQuestionDTO) => questionApi.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};
```

## Performance Optimizacije

### Code Splitting
```typescript
// Lazy loading komponenti
const QuestionDetail = lazy(() => import('./QuestionDetail'));
const UserProfile = lazy(() => import('./UserProfile'));

// Suspense wrapper
<Suspense fallback={<PageLoader />}>
  <QuestionDetail />
</Suspense>
```

### Memoization
```typescript
// React.memo za komponente
const QuestionCard = memo(({ question }: QuestionCardProps) => {
  return (
    <Card>
      <CardContent>{question.title}</CardContent>
    </Card>
  );
});

// useMemo za izračunate vrednosti
const filteredQuestions = useMemo(() => {
  return questions.filter(q => q.tags.includes(selectedTag));
}, [questions, selectedTag]);
```

### Virtual Scrolling
```typescript
// Za velike liste
import { FixedSizeList as List } from 'react-window';

const QuestionList = ({ questions }: QuestionListProps) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <QuestionCard question={questions[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={questions.length}
      itemSize={120}
    >
      {Row}
    </List>
  );
};
```

## Testing

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import { QuestionCard } from './QuestionCard';

describe('QuestionCard', () => {
  it('renders question title', () => {
    const question = {
      id: '1',
      title: 'Test Question',
      content: 'Test content',
      tags: ['test'],
    };

    render(<QuestionCard question={question} />);
    
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuestionList } from './QuestionList';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('QuestionList Integration', () => {
  it('loads and displays questions', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <QuestionList />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Test Question')).toBeInTheDocument();
  });
});
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Build output
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [hash].png
└── favicon.ico
```

### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=MatForum
VITE_APP_VERSION=1.0.0
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# TypeScript errors
npm run build
```

#### 2. Runtime Errors
```bash
# Check console for errors
# Verify API endpoints
# Check network requests
```

#### 3. Performance Issues
```bash
# Bundle analysis
npm run build
npx vite-bundle-analyzer dist

# Check for memory leaks
# Use React DevTools Profiler
```

## Best Practices

### Code Organization
- Koristite feature-based folder strukturu
- Separirajte UI komponente od business logike
- Koristite TypeScript za type safety
- Implementirajte proper error handling

### Performance
- Koristite React.memo za expensive komponente
- Implementirajte proper loading states
- Koristite virtual scrolling za velike liste
- Optimizujte bundle size

### Accessibility
- Koristite semantic HTML
- Implementirajte proper ARIA attributes
- Osigurajte keyboard navigation
- Testirajte sa screen readers

### Security
- Validirajte sve user inputs
- Koristite HTTPS u production
- Implementirajte proper authentication
- Sanitizujte HTML content

## Status

✅ React 18 sa TypeScript  
✅ TanStack Router implementiran  
✅ Tailwind CSS konfigurisan  
✅ shadcn/ui komponente  
✅ TanStack Query za state management  
✅ Form handling sa Zod  
✅ Responsive design  
✅ Dark mode podrška  
✅ Error handling  
✅ Loading states  
✅ Testovano i verifikovano  

## Autor

Implementirano: 14. Oktobar 2025  
Branch: main  
Pristup: Modern React sa TypeScript

---

**Za dodatne informacije, proveri kod ili dokumentaciju!**