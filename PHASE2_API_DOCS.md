# 🚀 Fase 2: APIs de Restaurant

## 📋 Endpoints Implementados

### 1. Listar Restaurantes do Usuário

```http
GET /api/restaurants
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "rest_123",
    "name": "Pizza Joy",
    "slug": "pizza-joy",
    "email": "contato@pizza.com",
    "phone": "+55 11 98765-4321",
    "whatsapp": "+55 11 98765-4321",
    "address": "Rua A, 123",
    "city": "São Paulo",
    "totalCapacity": 50,
    "isActive": true,
    "role": "admin",
    "reservationCount": 3,
    "settings": {...},
    "tables": [...]
  }
]
```

---

### 2. Registrar Novo Restaurante

```http
POST /api/restaurants/register
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Pizza Joy",
  "slug": "pizza-joy",
  "email": "contato@pizza.com",
  "phone": "+55 11 98765-4321",
  "whatsapp": "+55 11 98765-4321",
  "instagram": "@pizzajoy",
  "address": "Rua A, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01310-100",
  "totalCapacity": 50
}
```

**Response (201):**
```json
{
  "message": "Restaurante criado com sucesso!",
  "restaurant": {
    "id": "rest_123",
    "name": "Pizza Joy",
    "slug": "pizza-joy"
  }
}
```

**O que é criado automaticamente:**
- ✅ Restaurante
- ✅ Admin do restaurante (owner)
- ✅ Settings com configurações padrão
- ✅ Operating hours para seg-dom (11:00-23:00)

---

### 3. Obter Dados do Restaurante

```http
GET /api/restaurants/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "rest_123",
  "name": "Pizza Joy",
  "slug": "pizza-joy",
  "email": "contato@pizza.com",
  "phone": "+55 11 98765-4321",
  "logo": "https://cdn.com/logo.png",
  "coverImage": "https://cdn.com/cover.png",
  "address": "Rua A, 123",
  "city": "São Paulo",
  "totalCapacity": 50,
  "isActive": true,
  "settings": {
    "autoApprove": false,
    "minGuestCount": 1,
    "maxGuestCount": 100,
    "minAdvanceHours": 1,
    "maxAdvanceHours": 720,
    "whatsappEnabled": true
  },
  "tables": [
    {
      "id": "table_1",
      "tableNumber": 1,
      "capacity": 4,
      "section": "interna",
      "isActive": true
    }
  ],
  "operatingHours": [
    {
      "dayOfWeek": 0,
      "openTime": "12:00",
      "closeTime": "23:00",
      "isClosed": false
    }
  ]
}
```

---

### 4. Atualizar Dados do Restaurante

```http
PATCH /api/restaurants/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Pizza Joy Express",
  "email": "novo@pizza.com",
  "logo": "https://cdn.com/new-logo.png",
  "whatsapp": "+55 11 99999-9999",
  "totalCapacity": 60,
  "isActive": true
}
```

**Response:**
```json
{
  "id": "rest_123",
  "name": "Pizza Joy Express",
  "email": "novo@pizza.com",
  "...": "..."
}
```

---

## 📊 Gestão de Mesas (Tables)

### 5. Listar Mesas

```http
GET /api/restaurants/{id}/tables
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "table_1",
    "tableNumber": 1,
    "capacity": 4,
    "section": "interna",
    "isActive": true
  },
  {
    "id": "table_2",
    "tableNumber": 2,
    "capacity": 6,
    "section": "externa",
    "isActive": true
  }
]
```

---

### 6. Criar Mesa

```http
POST /api/restaurants/{id}/tables
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "tableNumber": 3,
  "capacity": 4,
  "section": "varanda"
}
```

**Response (201):**
```json
{
  "id": "table_3",
  "tableNumber": 3,
  "capacity": 4,
  "section": "varanda",
  "isActive": true
}
```

**Seções válidas:**
- `interna` - Dentro do restaurante
- `externa` - Pátio/Área externa
- `varanda` - Varanda
- `vip` - VIP/Premium

---

### 7. Atualizar Mesa

```http
PATCH /api/restaurants/{id}/tables/{tableId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "capacity": 5,
  "section": "vip",
  "isActive": true
}
```

---

### 8. Deletar Mesa

```http
DELETE /api/restaurants/{id}/tables/{tableId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

---

## ⏰ Horários de Funcionamento

### 9. Listar Horários

```http
GET /api/restaurants/{id}/operating-hours
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "hours_1",
    "dayOfWeek": 0,
    "openTime": "12:00",
    "closeTime": "23:00",
    "isClosed": false
  },
  {
    "id": "hours_2",
    "dayOfWeek": 1,
    "openTime": "11:00",
    "closeTime": "23:00",
    "isClosed": false
  }
]
```

**dayOfWeek:**
- 0 = Domingo
- 1 = Segunda
- 2 = Terça
- 3 = Quarta
- 4 = Quinta
- 5 = Sexta
- 6 = Sábado

---

### 10. Atualizar Horários

```http
PATCH /api/restaurants/{id}/operating-hours
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
[
  {
    "dayOfWeek": 0,
    "openTime": "12:00",
    "closeTime": "23:00",
    "isClosed": false
  },
  {
    "dayOfWeek": 1,
    "openTime": "11:00",
    "closeTime": "23:30",
    "isClosed": false
  },
  {
    "dayOfWeek": 3,
    "openTime": "11:00",
    "closeTime": "23:00",
    "isClosed": true
  }
]
```

---

## ⚙️ Configurações (Settings)

### 11. Obter Configurações

```http
GET /api/restaurants/{id}/settings
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "settings_1",
  "autoApprove": false,
  "minGuestCount": 1,
  "maxGuestCount": 100,
  "minAdvanceHours": 1,
  "maxAdvanceHours": 720,
  "defaultTableOccupancyMin": 60,
  "whatsappEnabled": true,
  "confirmationMessage": "Olá! Sua reserva foi confirmada..."
}
```

---

### 12. Atualizar Configurações

```http
PATCH /api/restaurants/{id}/settings
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "autoApprove": true,
  "minGuestCount": 2,
  "maxGuestCount": 50,
  "minAdvanceHours": 2,
  "maxAdvanceHours": 1440,
  "defaultTableOccupancyMin": 90,
  "whatsappEnabled": true,
  "confirmationMessage": "Olá! Sua reserva foi confirmada ✓\n\nAguardamos sua visita!"
}
```

---

## 🔐 Segurança

### Multi-tenant Verificado

✅ Cada endpoint verifica:
1. **Token válido** do usuário
2. **Acesso ao restaurante** (verifica se é admin)
3. **Retorna apenas dados** daquele restaurante

### Exemplo de Acesso Negado:

```json
{
  "error": "Acesso negado a este restaurante",
  "status": 403
}
```

---

## 🧪 Teste com CURL

### Registrar Restaurante:
```bash
curl -X POST http://localhost:3000/api/restaurants/register \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Joy",
    "slug": "pizza-joy",
    "phone": "+55 11 98765-4321",
    "totalCapacity": 50
  }'
```

### Listar Restaurantes:
```bash
curl http://localhost:3000/api/restaurants \
  -H "Authorization: Bearer {token}"
```

### Criar Mesa:
```bash
curl -X POST http://localhost:3000/api/restaurants/{id}/tables \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": 1,
    "capacity": 4,
    "section": "interna"
  }'
```

---

## ✅ Próximas Fases

- ⏳ **Fase 3**: Página pública com `/reserva/{slug}`
- ⏳ **Fase 4**: Dashboard do restaurante
- ⏳ **Fase 5**: Tela de recepção (check-in)

---

**Status:** Fase 2 - Completa! 🎉
