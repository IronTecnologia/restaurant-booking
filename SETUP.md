# Setup e Primeiros Passos

## Pré-requisitos

- Node.js 20+ e npm
- Uma chave de API Anthropic (obtém em https://console.anthropic.com)

## Instalação

### 1. Dependências Instaladas ✅
```bash
npm install
```

### 2. Banco de Dados Inicializado ✅
```bash
npx prisma migrate dev
# Já executado - database criado em prisma/dev.db
```

### 3. Configurar Variáveis de Ambiente

Editar `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"          # Já configurado
ANTHROPIC_API_KEY=sk_...                      # Adicionar sua chave
JWT_SECRET=seu_secret_super_seguro_aqui      # Mudar em produção
NEXT_PUBLIC_APP_URL=http://localhost:3000    # Para desenvolvimento
```

**Obtendo ANTHROPIC_API_KEY**:
1. Ir para https://console.anthropic.com
2. Criar uma nova chave (API Key)
3. Copiar para `.env` em `ANTHROPIC_API_KEY=`

### 4. Rodar Desenvolvimento

```bash
npm run dev
```

Acessar http://localhost:3000

## Fluxo de Teste

### 1. Criar Conta
- Ir para `/register`
- Preencher: email, nome, senha (mín 8 caracteres)
- Clicar em "Sign Up"

### 2. Login
- Ir para `/login`
- Usar email e senha criados
- Botão "Sign In"

### 3. Criar Reservação
- Dashboard → "New Reservation"
- Preencher:
  - Date & Time
  - Number of Guests
  - Special Requests (opcional)
- Clicar "Reserve Table"
- Claude AI recomenda a melhor mesa automaticamente ✨

### 4. Ver Reservações
- Dashboard → "My Reservations"
- Listar todas as suas reservações
- Cancelar se necessário

## Estrutura do Projeto

```
restaurant-booking/
├── app/
│   ├── api/routes da API
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/page.tsx
│   └── page.tsx (home)
├── components/
│   ├── AuthForm.tsx
│   ├── ReservationForm.tsx
│   └── ReservationList.tsx
├── lib/
│   ├── claude.ts (Claude AI com cache)
│   ├── auth.ts (JWT, bcrypt)
│   └── db.ts (Prisma)
├── prisma/
│   ├── schema.prisma (modelos)
│   ├── dev.db (banco SQLite)
│   └── migrations/
├── .env (configuração - NÃO commitar!)
├── README.md (documentação)
├── COST_OPTIMIZATION.md (estratégias de economia)
└── package.json
```

## Próximos Passos

### Desenvolvimento
1. Adicionar mais restaurantes (seed database)
2. Implementar autenticação OAuth
3. Adicionar sistema de pagamento
4. Enviar emails de confirmação

### Otimização (ver COST_OPTIMIZATION.md)
1. ✅ Prompt Caching (implementado: 90% desconto)
2. Batch Processing (próximo: +40% economia)
3. Cached Insights (+60% economia)
4. Rate Limiting (+5% segurança)

### Deploy
```bash
# Para Vercel
npm install -g vercel
vercel

# Ou manualmente
git add .
git commit -m "initial commit"
git push origin main
# Conectar GitHub ao Vercel Dashboard
```

## Troubleshooting

### "DATABASE_URL not found"
- Verificar se `.env` existe na raiz
- Executar `npx prisma migrate dev`

### "ANTHROPIC_API_KEY is undefined"
- Adicionar chave em `.env`
- Reiniciar `npm run dev`

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Database locked
```bash
rm prisma/dev.db*
npx prisma migrate dev
```

## Comandos Úteis

```bash
# Visualizar database
npx prisma studio

# Resetar database
npx prisma migrate reset

# Gerar Prisma Client
npx prisma generate

# Fazer backup
cp prisma/dev.db prisma/dev.db.backup

# Limpar cache
rm -rf .next node_modules
npm install
```

## Documentação

- [README.md](./README.md) - Visão geral e features
- [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md) - Estratégias de economia de tokens
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Claude API Docs](https://docs.anthropic.com/)

---

**Pronto para começar! 🚀**

Qualquer dúvida, abrir issue ou PR no GitHub.
