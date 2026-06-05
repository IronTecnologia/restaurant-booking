# Restaurant Booking System with AI-Powered Token Optimization

Um sistema moderno de reserva de restaurantes construído com Next.js, Prisma e Claude API com **prompt caching para economizar 90% em custos de tokens**.

## 🚀 Features

- ✅ Autenticação de usuários com JWT
- ✅ Gerenciamento de reservações (CRUD)
- ✅ AI-powered table recommendations usando Claude
- ✅ Códigos de confirmação únicos
- ✅ **Prompt caching para economia massiva de tokens**
- ✅ Banco de dados SQLite (facilmente migrável para PostgreSQL)
- ✅ TypeScript para type safety
- ✅ Tailwind CSS para UI moderno

## 🔧 Setup

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Criar `.env.local`:

```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY=sk_... # sua chave da API Anthropic
JWT_SECRET=seu_secret_super_seguro
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Inicializar Banco de Dados

```bash
npx prisma migrate dev --name init
```

### 4. Rodar Desenvolvimento

```bash
npm run dev
```

Abrir http://localhost:3000

## 💰 Otimização de Tokens - Como Funciona

### O Problema
Cada chamada à Claude API custa tokens. Sem otimização:
- **Sistema prompt**: 1000 tokens/chamada
- **Contexto do restaurante**: 500 tokens/chamada
- **100 reservas por dia** = 150,000 tokens = ~$2.25/dia

### A Solução: Prompt Caching
Claude API suporta **cache ephemeral** de prompts:

```typescript
const response = await client.messages.create({
  model: "claude-opus-4-7",
  system: [
    {
      type: "text",
      text: RESTAURANT_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" }, // ← Cache por 5 minutos
    },
  ],
  messages: [...]
});
```

**Resultado**:
- 1ª chamada: 1500 tokens (full)
- 2-20ª chamadas (próximos 5 min): ~150 tokens cada (90% desconto!)
- **Economia**: ~85% em custos com 10+ requisições/hora

### Implementação

Veja `lib/claude.ts` para exemplos práticos:

1. **`analyzeReservation()`** - Recomenda melhor mesa
   - System prompt é cachado por 5 minutos
   - Reutilizado para cada reserva

2. **`generateConfirmation()`** - Cria mensagens personalizadas
   - Context do restaurante é cachado

3. **`getBookingInsights()`** - Análise de padrões
   - Prompt de análise é cachado

## 📊 Arquitetura

```
restaurant-booking/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── reservations/route.ts
│   │   ├── reservations/[id]/route.ts
│   │   └── tables/route.ts
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── page.tsx (home)
├── components/
│   ├── AuthForm.tsx
│   ├── ReservationForm.tsx
│   └── ReservationList.tsx
├── lib/
│   ├── claude.ts (Claude API com cache)
│   ├── auth.ts (JWT, bcrypt)
│   ├── db.ts (Prisma)
├── prisma/
│   └── schema.prisma
└── package.json
```

## 🗄️ Banco de Dados

### Modelos

- **User**: Email, nome, senha (bcrypted)
- **Restaurant**: Nome, capacidade total
- **Table**: Número, assentos, status
- **Reservation**: Data, hóspedes, status, código de confirmação

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name seu_nome

# Ver schema
npx prisma studio
```

## 🔐 Segurança

- ✅ Senhas com bcrypt (cost factor 12)
- ✅ JWT tokens (24h expiration)
- ✅ Authorization headers em todas as requisições
- ✅ Validação de entrada em todas as APIs
- ✅ Parametrized queries via Prisma

## 📡 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Reservations
```
GET /api/reservations (requer token)
POST /api/reservations (requer token)
PATCH /api/reservations/[id] (requer token)
DELETE /api/reservations/[id] (requer token)
```

### Tables
```
GET /api/tables?restaurantId=xxx&date=2026-06-04
```

## 🚀 Deploy em Vercel

```bash
# 1. Push para GitHub
git add .
git commit -m "initial commit"
git push origin main

# 2. No Vercel Dashboard
# - Conectar repositório GitHub
# - Adicionar variáveis de ambiente
# - Deploy automático

# 3. Migrar banco de dados
npx prisma migrate deploy
```

## 💡 Próximas Otimizações

1. **Batch de requisições**: Agrupar múltiplas análises em 1 chamada
2. **Cached insights**: Guardar análises por 24h
3. **Edge Functions**: Mover validações para Edge
4. **Database índices**: Otimizar queries frequentes
5. **CDN**: Servir assets estáticos globalmente

## 📚 Referências

- [Anthropic Docs - Prompt Caching](https://docs.anthropic.com/en/docs/build-a-database-powered-agent#caching-prompt-blocks)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Claude Models](https://docs.anthropic.com/en/docs/about-claude/models/overview)

## 📝 Licença

MIT

---

**Desenvolvido com ❤️ para máxima economia de tokens**
