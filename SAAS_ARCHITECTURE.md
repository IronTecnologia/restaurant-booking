# 🏗️ Arquitetura SaaS - Sistema de Reservas

## 📊 Estrutura de Dados

### Multi-Tenant Architecture

```
┌─────────────────────────────────────┐
│         User (Admin/Owner)          │
│  email, name, password, phone       │
└────────────┬────────────────────────┘
             │
             │ (RestaurantAdmin)
             ▼
┌─────────────────────────────────────┐
│      Restaurant (Tenant)            │
│  slug, name, logo, address, etc     │
└────────────┬────────────────────────┘
             │
      ┌──────┼──────┬─────────┐
      ▼      ▼      ▼         ▼
   Tables Settings Operating  Reservas
                   Hours
```

---

## 📋 Modelos de Dados

### 1. **User** (Admin/Owner)
```
id
email (único)
name
password (bcrypted)
phone (WhatsApp)
createdAt, updatedAt
```

### 2. **Restaurant** (Multi-tenant)
```
id
slug (público: /reserva/{slug})

// Info básicas
name
email
phone
whatsapp
instagram

// Mídias
logo (URL)
coverImage (URL)

// Localização
address
city
state
zipCode
latitude, longitude

// Capacidade
totalCapacity

// Status
isActive

// Relations
admins (RestaurantAdmin[])
settings (RestaurantSettings)
tables (Table[])
reservations (Reservation[])
operatingHours (OperatingHours[])
```

### 3. **RestaurantAdmin** (Multi-tenant)
```
id
userId
restaurantId
role (admin, manager, staff)
```

### 4. **RestaurantSettings**
```
// Aprovação
autoApprove (bool)
minGuestCount
maxGuestCount
minAdvanceHours (antecedência mínima)
maxAdvanceHours (máxima)

// Mesas
defaultTableOccupancyMin (minutos)

// WhatsApp
whatsappEnabled
confirmationMessage (template)
```

### 5. **OperatingHours**
```
restaurantId
dayOfWeek (0-6)
openTime (HH:mm)
closeTime (HH:mm)
isClosed (bool)
```

### 6. **Table** (Gestão de Mesas)
```
id
restaurantId
tableNumber
capacity (quantas pessoas)
section (interna, externa, varanda, vip)
isActive (bool)
```

### 7. **Reservation** (Reservas)
```
id
guestName
guestPhone
guestEmail

restaurantId
tableId

// Info
reservationDate
guestCount
notes

// Status: solicitada, confirmada, check-in, finalizada, no-show, cancelada
status

// Confirmação
confirmationCode

// Timestamps
confirmedAt
checkedInAt
finishedAt
cancelledAt
noShowAt
```

### 8. **CheckIn** (Recepção)
```
id
reservationId

// Horários
arrivedAt (check-in)
departedAt (saída)

notes
```

---

## 🔐 Multi-Tenant Security

### ✅ Isolamento de dados

Cada restaurante vê APENAS seus dados:

```typescript
// Exemplo: buscar reservas de um restaurante
const reservations = await prisma.reservation.findMany({
  where: {
    restaurantId: authenticatedRestaurant.id // ← OBRIGATÓRIO
  }
});
```

### ✅ Autenticação em 2 níveis

**Level 1: User** → Login com email/senha
```
/login (qualquer usuário)
/register (novo usuário)
```

**Level 2: Restaurant** → User é admin de um restaurante
```
GET /api/user-restaurants (quais restaurantes o user gerencia)
SELECT restaurante
→ Acesso ao painel daquele restaurante
```

---

## 📱 Fluxos de Negócio

### 1️⃣ **Cadastro do Restaurante**

```
User se registra
↓
User cria/completa perfil do restaurante
- Nome, logo, capa
- Endereço, contato
- Horários de funcionamento
↓
Cria mesas (Gestão de Mesas)
↓
Configura regras (Configurações)
↓
Publica no link público
```

### 2️⃣ **Fluxo de Reserva (Cliente)**

```
Cliente acessa: https://reservamesa.com/pizza-joy
↓
Vê: Logo, capa, horários, informações
↓
Preenche formulário:
  - Data/Hora
  - Quantas pessoas
  - Nome, telefone
↓
Sistema valida:
  - Dentro do horário?
  - Antecedência (min/max)?
  - Mesas disponíveis?
↓
Aloca melhor mesa (AI)
↓
Cria reserva (status: solicitada)
↓
WhatsApp automático
↓
Se autoApprove ativado:
  - Aprova automaticamente
  - Envia confirmação
Senão:
  - Admin aprova/rejeita
```

### 3️⃣ **Painel do Restaurante**

```
Admin vê:
- Reservas do dia
- Filtro: Pendentes, Confirmadas, Check-in, Finalizadas, No-show, Canceladas
- Ações: Aprovar, Rejeitar, Check-in, Finalizar

Relatórios:
- Taxa de ocupação
- No-shows
- Horários mais procurados
```

### 4️⃣ **Tela de Recepção**

```
Na entrada do restaurante:
↓
Sistema mostra lista de chegadas do dia
↓
Cliente chega
↓
Recepcionista faz CHECK-IN
  - registra horário de chegada
  - marca como check-in
↓
Cliente é liberado para mesa
↓
No final, FINALIZAR ATENDIMENTO
  - registra horário de saída
  - marca como finalizada
```

---

## 🔄 Status das Reservas

```
solicitada → confirmada → check-in → finalizada
                  ↓
                cancelada

                 ↓
               no-show (se não chegou na hora)
```

---

## 🛠️ APIs a Implementar (Próximas fases)

### Fase 2: APIs de Restaurant

```
POST   /api/restaurants/register        → Registrar restaurante
GET    /api/restaurants/{id}            → Dados do restaurante
PATCH  /api/restaurants/{id}            → Editar restaurante
GET    /api/restaurants/{id}/settings   → Ler configurações
PATCH  /api/restaurants/{id}/settings   → Salvar configurações

POST   /api/restaurants/{id}/tables     → Criar mesa
GET    /api/restaurants/{id}/tables     → Listar mesas
PATCH  /api/restaurants/{id}/tables/{id} → Editar mesa
DELETE /api/restaurants/{id}/tables/{id} → Deletar mesa

POST   /api/restaurants/{id}/operating-hours → Horários
```

### Fase 3: Página Pública

```
GET    /reserva/{slug}                  → Página pública
POST   /api/public/reservations         → Criar reserva (sem auth)
```

### Fase 4: Dashboard

```
GET    /api/dashboard/reservations      → Listar reservas do dia
PATCH  /api/reservations/{id}           → Aprovar/Rejeitar/Cancelar
```

### Fase 5: Check-in

```
POST   /api/check-ins                   → Fazer check-in
PATCH  /api/check-ins/{id}              → Finalizar atendimento
```

---

## 🔐 Segurança Multi-tenant

### ✅ Middleware de Autenticação

```typescript
// Exemplo
export async function verifyRestaurantAccess(restaurantId, userId) {
  const admin = await prisma.restaurantAdmin.findUnique({
    where: {
      userId_restaurantId: { userId, restaurantId }
    }
  });
  
  if (!admin) throw new Error("Acesso negado");
  return admin;
}
```

### ✅ Validação em cada request

TODOS os endpoints devem:
1. Validar token JWT do admin
2. Validar que ele gerencia esse restaurante
3. Retornar APENAS dados daquele restaurante

---

## 📈 Escalabilidade

- ✅ Multi-tenant by design
- ✅ Índices otimizados
- ✅ Queries eficientes
- ✅ Suporta N restaurantes
- ✅ Suporta N usuários por restaurante

---

## 🚀 Próximos Passos

1. ✅ **Fase 1**: Banco de dados (FEITO!)
2. ⏳ **Fase 2**: APIs de Restaurant
3. ⏳ **Fase 3**: Página pública com slug
4. ⏳ **Fase 4**: Dashboard do restaurante
5. ⏳ **Fase 5**: Tela de recepção

---

**Status**: Estrutura de dados pronta!
**Próxima ação**: Implementar APIs de gestão do restaurante
