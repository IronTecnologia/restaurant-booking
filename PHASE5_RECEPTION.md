# 🚪 Fase 5: Tela de Recepção (Check-in)

## 🎯 Visão Geral

Tela otimizada para recepcionista gerenciar chegadas do dia com check-in rápido.

**URL**: `/dashboard/restaurant/{id}/recepcao`

---

## 📱 Layout da Recepção

```
┌────────────────────────────────┐
│ 🚪 Recepção      [← Voltar]    │
│ 04/06/2026                     │
├────────────────────────────────┤
│ Total: 12 | ⏳ Chegando: 8     │
│ 👤 Na Casa: 4                  │
├────────────────────────────────┤
│ [Todos] [⏳ Chegando] [👤 Casa]│
├────────────────────────────────┤
│                                │
│  ┌──────────────┐ ┌──────────┐│
│  │ João Silva   │ │ Maria    ││
│  │ ABC12345     │ │ DEF67890 ││
│  │              │ │          ││
│  │ Mesa 5       │ │ Mesa 3   ││
│  │ 4 pessoas    │ │ 6 pess.  ││
│  │              │ │          ││
│  │ ✓ Chega em   │ │ ⏰ 5 min ││
│  │ 10 min       │ │ atrasado ││
│  │ 19:00        │ │ 20:00    ││
│  │              │ │          ││
│  │              │ │ ✓ Check- ││
│  │              │ │ in: 20:05││
│  │              │ │          ││
│  │[✓ Check-in]  │ │[👋 Final]││
│  └──────────────┘ └──────────┘│
│                                │
└────────────────────────────────┘
```

---

## 📊 Componentes

### Stats Superiores:
```
┌─────────────┬─────────────┬─────────────┐
│ Total: 12   │ Chegando: 8 │ Na Casa: 4  │
│ Reservas    │ ⏳ Aguard.  │ 👤 Check-in │
└─────────────┴─────────────┴─────────────┘
```

**Atualizado em tempo real** ao fazer check-in/saída

### Abas de Filtro:
```
[Todos (12)] [⏳ Chegando (8)] [👤 Na Casa (4)]
```

Filtra reservas por status

---

## 🎨 Card de Reserva (Otimizado)

```
┌─────────────────────────────────┐
│ João Silva              Mesa 5   │
│ ABC12345                4 pessoa │
├─────────────────────────────────┤
│ Chega em 10 minutos             │ ← Verde se no horário
│ 19:00                           │ ← Vermelho se atrasado
├─────────────────────────────────┤
│ ⏳ Aguardando chegada           │
│                                 │
│ [✓ Check-in]                    │ ← Botão principal
└─────────────────────────────────┘
```

### Estados do Card:

#### 1. **Aguardando Chegada**
```
Status: ⏳ Aguardando
Botão: [✓ Check-in]
```

#### 2. **Check-in Realizado**
```
Status: ✓ Check-in realizado
       20:05
Botão: [👋 Finalizar]
```

#### 3. **Atendimento Finalizado**
```
Status: ✓ Atendimento Concluído
       Chegada: 20:05
       Saída: 21:45
Botão: (Desabilitado)
```

---

## ⏱️ Indicador de Tempo

### Verde (No Horário):
```
✓ Chega em 10 minutos
```
Mostra quantos minutos até a hora da reserva

### Amarelo (Próximo):
```
✓ Chega em 0 minutos
```
Reserva está próxima ou no horário

### Vermelho (Atrasado):
```
⏰ 15 minutos atrasado
```
Cliente passou do horário

---

## 🔄 Fluxo de Check-in

### 1. Cliente Chega
```
Recepcionista vê card de João
Status: ⏳ Aguardando chegada
Clica: [✓ Check-in]
```

### 2. Sistema registra:
```
- Reserva muda para status "checkin"
- Registra horário de chegada (arrivedAt)
- Card mostra "✓ Check-in realizado"
- Botão muda para [👋 Finalizar]
```

### 3. Cliente Sai
```
Recepcionista clica: [👋 Finalizar]
```

### 4. Sistema registra:
```
- Reserva muda para status "finalizada"
- Registra horário de saída (departedAt)
- Card mostra "✓ Atendimento Concluído"
- Mostra tempo total de permanência
```

---

## 📡 APIs Utilizadas

### POST `/api/dashboard/checkins`

Fazer check-in de cliente

**Request:**
```json
{
  "restaurantId": "rest_123",
  "reservationId": "res_456"
}
```

**Response:**
```json
{
  "message": "Check-in realizado com sucesso!",
  "checkIn": {
    "id": "checkin_1",
    "arrivedAt": "2026-06-04T20:05:00Z",
    "departedAt": null
  },
  "reservation": {
    "id": "res_456",
    "status": "checkin",
    "checkedInAt": "2026-06-04T20:05:00Z"
  }
}
```

### PATCH `/api/dashboard/checkins`

Finalizar atendimento (saída)

**Request:**
```json
{
  "restaurantId": "rest_123",
  "reservationId": "res_456"
}
```

**Response:**
```json
{
  "message": "Atendimento finalizado!",
  "checkIn": {
    "id": "checkin_1",
    "arrivedAt": "2026-06-04T20:05:00Z",
    "departedAt": "2026-06-04T21:45:00Z"
  },
  "reservation": {
    "id": "res_456",
    "status": "finalizada",
    "finishedAt": "2026-06-04T21:45:00Z"
  }
}
```

---

## 🎯 Casos de Uso

### Use Case 1: Cliente Chega no Horário

```
1. Recepcionista abre /recepcao
2. Vê João Silva - "Chega em 3 minutos"
3. Cliente chega às 19:00
4. Clica [✓ Check-in]
5. Sistema registra chegada
6. Card mostra: "✓ Check-in realizado (19:00)"
7. Botão muda para [👋 Finalizar]
```

### Use Case 2: Cliente Atrasado

```
1. Recepcionista vê João - "⏰ 15 min atrasado"
2. Cliente chega
3. Clica [✓ Check-in]
4. Sistema registra horário real: 19:15
5. Card mostra: "Check-in (19:15)"
```

### Use Case 3: Cliente Sai

```
1. Após cliente comer
2. Clica [👋 Finalizar]
3. Sistema registra saída (21:45)
4. Card mostra:
   "✓ Atendimento Concluído
    Chegada: 19:00
    Saída: 21:45
    Duração: 1h45min"
5. Move para histórico
```

---

## 📋 Dados Exibidos em Cada Card

- ✅ Nome do cliente
- ✅ Código de confirmação
- ✅ Número da mesa
- ✅ Quantidade de pessoas
- ✅ Horário da reserva
- ✅ Indicador de tempo (verde/amarelo/vermelho)
- ✅ Status de check-in
- ✅ Botões contextuais

---

## 🎯 Vantagens desta Tela

✅ **Otimizada para recepção** - Foco apenas em chegadas  
✅ **Rápida** - Botões grandes, ações claras  
✅ **Visual** - Cores indicam status  
✅ **Precisa** - Registra horários exatos  
✅ **Histórico** - Mantém dados de chegada/saída  
✅ **Real-time** - Stats atualizam em tempo real  

---

## 🔐 Dados Capturados

### No Check-in:
```
- Horário exato de chegada (arrivedAt)
- Status muda para "checkin"
- Timestamp do evento
```

### Na Saída:
```
- Horário exato de saída (departedAt)
- Status muda para "finalizada"
- Tempo total de permanência (calculado)
- Timestamp do evento
```

---

## 📊 Relatórios Possíveis

Com os dados de check-in/saída:

- Tempo médio de permanência
- Hora de pico (mais chegadas)
- Taxa de no-show (confirmadas sem check-in)
- Ocupação real vs. planejada
- Análise de fluxo de clientes

---

## 🚀 Integração Futura

- ⏳ Enviar SMS/WhatsApp quando cliente atrasa
- ⏳ Integrar com sistema de mesas
- ⏳ Controle de taxa de ocupação em tempo real
- ⏳ Relatórios de throughput

---

## 🧪 Testar Localmente

```bash
# 1. Crie um restaurante e mesas
POST /api/restaurants/register
POST /api/restaurants/{id}/tables

# 2. Crie reservas públicas
POST /api/public/reservations

# 3. Acesse o dashboard
/dashboard/restaurant/{id}

# 4. Vá para recepção
/dashboard/restaurant/{id}/recepcao

# 5. Teste check-in/finalização
- Clique em [✓ Check-in]
- Clique em [👋 Finalizar]
```

---

**Status:** Fase 5 - Completa! 🎉

Todas as 5 fases do SaaS implementadas:
1. ✅ Banco de dados multi-tenant
2. ✅ APIs de restaurante
3. ✅ Página pública com slug
4. ✅ Dashboard do admin
5. ✅ Tela de recepção
