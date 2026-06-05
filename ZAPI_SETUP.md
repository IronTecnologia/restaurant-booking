# 📱 Setup Zapi - WhatsApp Integration

Guia para integrar WhatsApp via Zapi no sistema de reservas.

## 1️⃣ Criar conta no Zapi

1. Acesse [zapi.ai](https://zapi.ai)
2. Clique em **"Criar Conta"** ou **"Sign Up"**
3. Preencha email e senha
4. Confirme email
5. Login na plataforma

## 2️⃣ Obter Instance ID

1. Na dashboard Zapi, vá para **"Instâncias"** ou **"Instances"**
2. Crie uma nova instância:
   - Nome: `Restaurant Booking`
   - Descrição: `Sistema de reservas com WhatsApp`
3. Clique em **"Adicionar"** ou **"Create"**
4. **Escaneie o QR Code** com seu WhatsApp (seu número de bot)
5. Após conectar, você verá o **Instance ID**

## 3️⃣ Obter API Key

1. Vá para **"API"** ou **"Integrations"**
2. Procure por **"API Key"** ou **"Chave de API"**
3. Copie sua **API Key**
4. Se não houver, clique em **"Generate"** ou **"Gerar"**

## 4️⃣ Configurar no projeto

Edite `.env` e adicione:

```env
ZAPI_API_KEY=your_actual_api_key_here
ZAPI_INSTANCE_ID=your_actual_instance_id_here
```

**Exemplo:**
```env
ZAPI_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ZAPI_INSTANCE_ID=inst_a1b2c3d4e5f6g7h8i9j0
```

## 5️⃣ Testar a integração

1. Reinicie o servidor: `npm run dev`
2. Vá para **Dashboard → ⚙️ Configurações**
3. **Ativa WhatsApp**
4. **Salva**
5. Crie uma nova reserva
6. Você deve receber a mensagem WhatsApp!

## 🔧 Troubleshooting

### Mensagem não foi enviada

**Problema:** `[WhatsApp] Zapi error`

**Soluções:**
1. Verifica se ZAPI_API_KEY e ZAPI_INSTANCE_ID estão corretos no `.env`
2. Verifica se a instância está **conectada** (status verde em Zapi)
3. Verifica se o número do cliente tem **WhatsApp instalado**
4. Verifica logs do Zapi em `https://zapi.ai/dashboard`

### Número inválido

**Problema:** `phone format invalid`

**Solução:**
- O sistema formata números automaticamente
- Adicione WhatsApp do cliente em formato: `+55 11 99999-9999` ou `11 99999-9999`

### Instância desconectada

**Problema:** Messages não são enviadas e status está vermelho

**Solução:**
1. Vá para Zapi Dashboard
2. Clique em sua instância
3. Escaneie o QR Code novamente
4. Aguarde "Conectado"

## 📊 Monitorar envios

No Zapi Dashboard:
1. Vá para **"Logs"** ou **"History"**
2. Veja todas as mensagens enviadas
3. Status: Enviado ✓, Entregue ✓✓, Lido ✓✓✓

## 💰 Preços Zapi

- **Plano Free:** Até 100 mensagens/mês
- **Plano Starter:** R$ 49/mês (3.000 mensagens)
- **Plano Professional:** R$ 199/mês (15.000 mensagens)

[Ver planos em zapi.ai/pricing](https://zapi.ai/pricing)

## 🔐 Segurança

- ✅ API Key é privada (não compartilha!)
- ✅ Instance ID também é privado
- ✅ Nunca commit `.env` no Git
- ✅ Regenere API Key se suspeitar de vazamento

## 📝 Exemplo de mensagem personalizada

Na aba Configurações, você pode customizar a mensagem:

**Padrão:**
```
Olá! Sua reserva foi confirmada 🎉

Restaurante: {restaurant}
Data: {date}
Hóspedes: {guests}
Código: {code}

Aguardamos sua visita!
```

## 🚀 Próximos passos

1. ✅ Configure Zapi
2. Teste primeiro envio
3. Monitore logs
4. Customize mensagens conforme necessário
5. Escale para mais restaurantes

---

**Dúvidas?** Acesse [zapi.ai/docs](https://zapi.ai/docs) ou [suporte](https://zapi.ai/support)
