# 📊 Fase 4: Dashboard do Restaurante (Admin)

## 🎯 Visão Geral

Dashboard para o admin do restaurante gerenciar todas as reservas do dia.

**URL**: `/dashboard/restaurant/{id}`

---

## 📱 Layout do Dashboard

```
┌─────────────────────────────────────────┐
│  Dashboard                      [Sair]  │
├─────────────────────────────────────────┤
│  Filtrar por data: [Select Date]        │
├─────────────────────────────────────────┤
│ ⏳ Solicitadas (3) │ ✓ Confirmadas (5)  │
│ 👤 Check-in (2)   │ ✓ Finalizadas (12) │
│ ✗ No-show (1)     │ ✗ Canceladas (0)   │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ João Silva   │  │ Maria Santos │   │
│  │ ABC12345     │  │ DEF67890     │   │
│  │              │  │              │   │
│  │ 10/06 19:00  │  │ 10/06 20:00  │   │
│  │ 4 pessoas    │  │ 6 pessoas    │   │
│  │ Mesa 5       │  │ Mesa 3       │   │
│  │              │  │              │   │
│  │ [Aprovar]    │  │ [Check-in]   │   │
│  │ [Rejeitar]   │  │ [Finalizar]  │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 Abas de Status

### 1. **⏳ Solicitadas**
Reservas aguardando aprovação
- Ações: [Aprovar] [Rejeitar]
- Prioridade: Alta

### 2. **✓ Confirmadas**
Reservas aprovadas, aguardando chegada
- Ações: [Check-in] [No-show] [Cancelar]
- Prioridade: Alta

### 3. **👤 Check-in**
Clientes já chegaram e estão na mesa
- Ações: [Finalizar] [No-show]

### 4. **✓ Finalizadas**
Atendimento concluído
- Apenas visualização
- Histórico

### 5. **✗ No-show**
Clientes que não compareceram
- Apenas visualização
- Análise

### 6. **✗ Canceladas**
Reservas canceladas
- Apenas visualização
- Histórico

---

## 📋 Informações em Cada Card

```
┌──────────────────────────────────┐
│ João Silva          ✓ Confirmada │
│ ABC12345                         │
├──────────────────────────────────┤
│ Data e Hora: 10/06 19:00         │
│ Hóspedes: 4 pessoas              │
│ Mesa: Mesa 5                      │
│ Telefone: +55 11 98765-4321      │
├──────────────────────────────────┤
│ Obs: Aniversário! Pedir parabéns │
├──────────────────────────────────┤
│ [Aprovar] [Check-in] [No-show]   │
└──────────────────────────────────┘
```

**Cada card mostra:**
- ✅ Nome do cliente
- ✅ Código de confirmação
- ✅ Status atual (com cor)
- ✅ Data/Hora
- ✅ Quantidade de pessoas
- ✅ Número da mesa
- ✅ Telefone (WhatsApp clicável)
- ✅ Observações
- ✅ Botões de ação (contextuais)

---

## 🔄 Fluxo de Status

### Caminho Normal:

```
solicitada → confirmada → checkin → finalizada
```

### Cancelamentos:

```
solicitada → cancelada (rejeitar)
confirmada → cancelada (cliente desistiu)
```

### Não Comparecimento:

```
confirmada → no-show (cliente não veio)
checkin → no-show (chegou mas saiu sem usar)
```

---

## 🎯 Ações por Status

| Atual | Ações Possíveis |
|-------|-----------------|
| **solicitada** | Aprovar → confirmada<br>Rejeitar → cancelada |
| **confirmada** | Check-in → checkin<br>No-show → no-show<br>Cancelar → cancelada |
| **checkin** | Finalizar → finalizada<br>No-show → no-show |
| **finalizada** | (Apenas view) |
| **no-show** | (Apenas view) |
| **cancelada** | (Apenas view) |

---

## 📡 APIs Utilizadas

### GET `/api/dashboard/reservations`

**Parâmetros:**
```
restaurantId=rest_123 (obrigatório)
status=solicitada (opcional)
date=2026-06-10 (opcional)
```

**Response:**
```json
[
  {
    "id": "res_456",
    "guestName": "João Silva",
    "guestPhone": "+55 11 98765-4321",
    "reservationDate": "2026-06-10T19:00:00",
    "guestCount": 4,
    "status": "confirmada",
    "confirmationCode": "ABC12345",
    "table": {
      "tableNumber": 5
    },
    "notes": "Aniversário"
  }
]
```

### PATCH `/api/dashboard/reservations/[id]`

**Request:**
```json
{
  "restaurantId": "rest_123",
  "newStatus": "confirmada"
}
```

**Response:**
```json
{
  "id": "res_456",
  "status": "confirmada",
  "confirmedAt": "2026-06-10T18:30:00"
}
```

---

## 📅 Filtro de Data

- Seleciona data no calendário
- Lista apenas reservas daquele dia
- Útil para gerenciar dia por dia

**Exemplo:**
```
Data selecionada: 10/06/2026
Mostra: Todas as reservas de 10/06
```

---

## 🔐 Segurança

✅ Autenticação JWT obrigatória  
✅ Verifica se admin do restaurante  
✅ Retorna apenas reservas do restaurante  
✅ Ações confirmam antes de executar

---

## 🎨 Componentes

### `RestaurantDashboard` (Página)
- Layout principal
- Abas de status
- Filtro de data
- Grid de cards

### `ReservationCard` (Componente)
- Exibe informações da reserva
- Botões de ação contextuais
- WhatsApp clicável
- Status com cores

---

## 🔗 Integração com WhatsApp

Quando status muda para **"confirmada"**:

```
Sistema envia WhatsApp:
"Olá João! Sua reserva foi confirmada ✓
Restaurante: Pizza Joy
Data: 10/06 19:00
Hóspedes: 4
Código: ABC12345
Aguardamos sua visita!"
```

---

## 📊 Casos de Uso

### Use Case 1: Aprovar Reserva Solicitada

```
1. Admin abre dashboard
2. Clica aba "Solicitadas"
3. Vê card de João Silva
4. Clica [Aprovar]
5. Sistema:
   - Muda status para "confirmada"
   - Envia WhatsApp ao cliente
   - Remove de "Solicitadas"
   - Aparece em "Confirmadas"
```

### Use Case 2: Cliente Chega (Check-in)

```
1. Recepcionista abre dashboard
2. Vê "Confirmadas"
3. Clica [Check-in] no card de João
4. Sistema:
   - Muda status para "checkin"
   - Registra horário de chegada
   - Move para aba "Check-in"
```

### Use Case 3: Cliente Saiu (Finalizar)

```
1. Após cliente sair
2. Clica [Finalizar]
3. Sistema:
   - Muda status para "finalizada"
   - Registra horário de saída
   - Move para histórico
```

### Use Case 4: Cliente Não Apareceu

```
1. Se cliente não vem na hora
2. Clica [No-show]
3. Sistema:
   - Muda status para "no-show"
   - Registra não comparecimento
   - Mesa liberada para outros
```

---

## 📈 Relatórios Possíveis

Com os dados de status, é possível gerar:

- Taxa de no-show por dia
- Ocupação média
- Horários mais procurados
- Número médio de pessoas
- Tempo médio de atendimento

---

## 🚀 Próximas Fases

- ⏳ **Fase 5**: Tela de recepção (check-in avançado)
- ⏳ **Fase 6**: Relatórios e analytics
- ⏳ **Fase 7**: Integrações (SMS, email)

---

## 🧪 Testar Localmente

```bash
# 1. Crie um restaurante
POST /api/restaurants/register

# 2. Crie uma reserva pública
POST /api/public/reservations

# 3. Acesse o dashboard
/dashboard/restaurant/{restaurantId}

# 4. Teste as ações
- Clique nas abas
- Selecione data
- Mude status das reservas
```

---

**Status:** Fase 4 - Completa! 🎉
