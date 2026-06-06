# 🚀 Guia: Configurar Variáveis de Ambiente no Netlify

## Passo 1: Acessar o Painel do Netlify

1. Vai em: https://app.netlify.com
2. Faz login com sua conta
3. Clica no seu projeto **restaurant-booking**

## Passo 2: Ir para Configurações

```
Site name (no topo)
    ↓
Site settings (lado esquerdo)
    ↓
Build & deploy
    ↓
Environment
```

Ou acessa direto: `https://app.netlify.com/sites/[seu-site]/settings/deploys`

## Passo 3: Adicionar Variáveis de Ambiente

Na seção **Environment variables**, clica em **"Edit variables"**

Vai aparecer um formulário assim:

```
Key          | Value
─────────────┼─────────────────────────
DATABASE_URL | postgresql://...
JWT_SECRET   | sua-chave-secreta
NODE_ENV     | production
```

### 🔧 O que adicionar:

#### 1️⃣ **DATABASE_URL** (Banco de Dados PostgreSQL)

Se você tem um banco de dados PostgreSQL, use a string de conexão:

```
postgresql://usuario:senha@host:5432/nomebanco
```

**Exemplo real:**
```
postgresql://admin:minha_senha@neon.tech:5432/restaurante_db
```

**Onde conseguir?**
- Se usar **Neon** (recomendado - grátis): https://neon.tech
- Se usar **Supabase**: https://supabase.com
- Se usar **Railway**: https://railway.app

#### 2️⃣ **JWT_SECRET** (Chave de Segurança)

Coloca uma string aleatória e segura. Por exemplo:

```
your-super-secret-key-2024-change-this-in-production
```

Ou gera uma aleatória online: https://www.uuidgenerator.net/

#### 3️⃣ **NODE_ENV** (Ambiente)

Deixa como:
```
production
```

## Passo 4: Salvar e Fazer Deploy

1. Depois de adicionar as variáveis, clica em **"Save"**
2. Volta para o painel principal do site
3. Clica em **"Trigger deploy"** ou **"Deploy site"**
4. Aguarda o deploy terminar (deve levar 1-2 minutos)

## ✅ Verificar se funcionou

Depois do deploy:

1. Vai em: https://seu-site.netlify.app/login
2. Tenta criar uma conta com email/senha
3. Se for criado com sucesso → **Configuração OK!** ✨

---

## 🎯 Próximas Etapas (Quando tiver o Banco de Dados)

Depois que configurar o `DATABASE_URL`, você precisa:

1. **Rodar as migrations:**
   ```bash
   npx prisma migrate deploy
   ```

2. **Gerar o Prisma Client:**
   ```bash
   npx prisma generate
   ```

Isso vai criar as tabelas no seu banco de dados.

---

## 🚨 Se der erro:

### Erro: "Erro ao conectar"
- Verifica se o `DATABASE_URL` está correto
- Testa a conexão no terminal local: 
  ```bash
  psql [seu-database-url]
  ```

### Erro: "Token inválido"
- Regenera um novo `JWT_SECRET`
- Faz novo deploy

### Ainda não funcionou?
Envia uma mensagem com:
- URL do site
- O que você tentou
- O erro que recebeu

---

## 📚 Links Úteis:

- **Neon (Banco PostgreSQL Grátis):** https://neon.tech
- **Supabase (Alternativa):** https://supabase.com  
- **Documentação Netlify:** https://docs.netlify.com/configure-builds/environment-variables/
- **Documentação Prisma:** https://www.prisma.io/docs/

---

## 💡 Dica: Arquivo .env.example

No seu projeto tem um arquivo `.env.example` que mostra quais variáveis são necessárias!
