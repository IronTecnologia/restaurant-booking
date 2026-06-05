# 🌐 Fase 3: Página Pública com Link Slug

## 📍 URL Pública

Cada restaurante tem um link público exclusivo:

```
https://reservamesa.com/reserva/{slug}
```

### Exemplos:
```
https://reservamesa.com/reserva/pizza-joy
https://reservamesa.com/reserva/restaurante-italiano
https://reservamesa.com/reserva/churrascaria-premium
```

---

## 🏗️ Estrutura da Página Pública

### Layout:

```
┌─────────────────────────────┐
│      Foto de Capa           │
├─────────────────────────────┤
│  Logo | Nome do Restaurante │
│  📍 Endereço, Cidade - ST    │
│  ☎️ Telefone | 💬 WhatsApp   │
│  📸 Instagram | Horários    │
├─────────────────────────────┤
│   FORMULÁRIO DE RESERVA     │
│  - Data/Hora                │
│  - Quantidade de Pessoas    │
│  - Nome                     │
│  - WhatsApp                 │
│  - Email (opcional)         │
│  - Observações (opcional)   │
│                             │
│  [Botão: Reservar Mesa]     │
└─────────────────────────────┘
```

---

## 📊 O que a Página Exibe

### Informações do Restaurante:

✅ **Logo** - Imagem da marca  
✅ **Foto de Capa** - Imagem de destaque  
✅ **Nome** - Nome do restaurante  
✅ **Endereço** - Localização completa  
✅ **Contato**:
  - ☎️ Telefone
  - 💬 WhatsApp (clicável)
  - 📸 Instagram (link)

✅ **Horário de Funcionamento** - Todos os dias da semana  
✅ **Hoje** - Horário destacado para o dia atual

---

## 🎯 Fluxo de Reserva Público

```
1. Cliente acessa: /reserva/pizza-joy

2. Página carrega dados públicos do restaurante:
   - Logo, capa
   - Horários
   - Configurações (min/max pessoas, antecedência)

3. Cliente preenche formulário:
   - Data/Hora
   - Quantidade de pessoas
   - Nome e WhatsApp
   - Observações (opcional)

4. Validações:
   ✓ Quantidade dentro do range
   ✓ Data dentro da antecedência (min-max)
   ✓ Restaurante ativo

5. Claude sugere melhor mesa

6. Cria reserva com status:
   - "confirmada" (se autoApprove ativado)
   - "solicitada" (aguardando aprovação)

7. WhatsApp automático:
   - Se confirmada: "Sua reserva foi confirmada! Código: XXX"
   - Se pendente: "Sua reserva foi recebida! Aguardando aprovação."
```

---

## 📱 Validações na Página

### Quantidade de Pessoas:
```
Restaurante configura: minGuestCount=2, maxGuestCount=50
Formulário mostra dropdown: 2-50 pessoas
Se cliente tenta 1 pessoa → Erro: "Mínimo 2 pessoas"
```

### Data/Hora:
```
Restaurante configura: minAdvanceHours=1, maxAdvanceHours=720
Hoje: 10:00
Mínimo: 11:00 (+ 1 hora)
Máximo: 1 mês depois

Se cliente escolhe agora → Erro: "Mínimo 1 hora de antecedência"
```

### Horário de Funcionamento:
```
Se restaurante fecha às 23:00
Cliente tenta reservar 23:30 → Erro: "Fora do horário"
```

---

## 🔌 APIs Usadas

### GET `/api/public/restaurants/[slug]`

Busca dados públicos do restaurante (sem autenticação).

**Response:**
```json
{
  "id": "rest_123",
  "name": "Pizza Joy",
  "slug": "pizza-joy",
  "logo": "https://...",
  "coverImage": "https://...",
  "address": "Rua A, 123",
  "city": "São Paulo",
  "phone": "+55 11 98765-4321",
  "whatsapp": "+55 11 98765-4321",
  "instagram": "@pizzajoy",
  "settings": {
    "minGuestCount": 2,
    "maxGuestCount": 50,
    "minAdvanceHours": 1,
    "maxAdvanceHours": 720
  },
  "operatingHours": [...]
}
```

### POST `/api/public/reservations`

Cria reserva pública (sem autenticação do usuário).

**Request:**
```json
{
  "restaurantId": "rest_123",
  "reservationDate": "2026-06-10T19:00:00",
  "guestCount": 4,
  "guestName": "João Silva",
  "guestPhone": "+55 11 98765-4321",
  "guestEmail": "joao@email.com",
  "notes": "Aniversário, preferência de perto da janela"
}
```

**Response:**
```json
{
  "message": "Reserva confirmada! Verifique seu WhatsApp.",
  "reservation": {
    "id": "res_456",
    "confirmationCode": "ABC12345",
    "status": "confirmada",
    "restaurantName": "Pizza Joy",
    "tableNumber": 5,
    "reservationDate": "2026-06-10T19:00:00",
    "guestCount": 4
  }
}
```

---

## 🎨 Componentes Usados

### `PublicRestaurantInfo`
Exibe informações públicas do restaurante:
- Logo
- Foto de capa
- Nome e endereço
- Contato (telefone, WhatsApp, Instagram)
- Horários de funcionamento
- Status "Aberto/Fechado" para hoje

### `PublicReservationForm`
Formulário de reserva pública:
- Campo de data/hora (com validação de antecedência)
- Select de quantidade (minGuestCount até maxGuestCount)
- Campos de nome, WhatsApp, email
- Textarea de observações
- Validações em tempo real
- Feedback de sucesso/erro

### Página `/reserva/[slug]`
Junta tudo:
- Busca dados do restaurante
- SSR (Server-Side Rendering)
- Cache por 5 minutos
- SEO (meta tags dinâmicas)
- Suspense com loading state

---

## 🔒 Segurança & Privacy

### Dados Públicos (exibidos):
✅ Nome, logo, capa
✅ Endereço, telefone
✅ Horários
✅ Instagram, WhatsApp

### Dados Privados (NÃO exibidos):
❌ Email (não pública)
❌ Admin do restaurante
❌ Outras reservas
❌ Configurações avançadas

### Validações:
✅ Restaurante deve estar `isActive: true`
✅ Validações no cliente (antecedência, quantidade)
✅ Validações no servidor (segurança)
✅ Claude valida mesa disponível

---

## 📊 Exemplo de Fluxo Real

### Cliente quer reservar na Pizza Joy:

1. **Acessa**: `/reserva/pizza-joy`
2. **Vê**:
   - Logo Pizza Joy
   - Foto do restaurante
   - "Aberto até 23:00 hoje"
   - Telefone e WhatsApp clicáveis
   - Formulário

3. **Preenche**:
   - Data: 10 jun, 19:00
   - Pessoas: 4
   - Nome: João Silva
   - WhatsApp: +55 11 98765-4321
   - Obs: "Aniversário!"

4. **Clica**: "Reservar Mesa"

5. **Sistema**:
   - Valida (4 pessoas OK, 1h antecedência OK)
   - Claude sugere mesa 5
   - Cria reserva (confirmada ou pendente)
   - Envia WhatsApp

6. **Cliente vê**: "✓ Reserva confirmada! Código: ABC12345"

7. **Recebe no WhatsApp**:
   ```
   Olá! Sua reserva foi confirmada 🎉
   
   Restaurante: Pizza Joy
   Data: 10/06 19:00
   Hóspedes: 4
   Código: ABC12345
   
   Aguardamos sua visita!
   ```

---

## 📈 Estatísticas & Monitoramento

### O que rastrear:

- Total de reservas por restaurante
- Taxa de conversão (quem vê → quem reserva)
- Horários mais procurados
- Quantidade média de pessoas
- Tempo para aprovação
- Taxa de no-show

---

## 🚀 Próximas Fases

- ⏳ **Fase 4**: Dashboard do restaurante (admin)
- ⏳ **Fase 5**: Tela de recepção (check-in)

---

## 🧪 Testar Localmente

```bash
# 1. Crie um restaurante via API
POST /api/restaurants/register
{
  "name": "Teste Pizza",
  "slug": "teste-pizza",
  "phone": "+55 11 98765-4321",
  "totalCapacity": 20
}

# 2. Acesse a página pública
http://localhost:3000/reserva/teste-pizza

# 3. Faça uma reserva
# Preencha o formulário e clique "Reservar Mesa"
```

---

**Status:** Fase 3 - Completa! 🎉
