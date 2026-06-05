/**
 * WhatsApp integration com Zapi
 * https://zapi.ai
 */

export interface WhatsAppMessage {
  phone: string;
  message: string;
  reservationCode: string;
}

/**
 * Enviar mensagem WhatsApp via Zapi
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  reservationCode: string
): Promise<boolean> {
  try {
    const apiKey = process.env.ZAPI_API_KEY;
    const instanceId = process.env.ZAPI_INSTANCE_ID;

    if (!apiKey || !instanceId) {
      console.warn(
        "[WhatsApp] ZAPI_API_KEY ou ZAPI_INSTANCE_ID não configurados"
      );
      console.log(`[WhatsApp] Mock: Enviando para ${phone}`);
      return true;
    }

    // Formatar número: remover caracteres especiais e adicionar 55 se necessário
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55")
      ? cleanPhone
      : `55${cleanPhone}`;

    const response = await fetch("https://api.zapi.ai/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: apiKey,
        instance_id: instanceId,
        phone: formattedPhone,
        message: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[WhatsApp] Zapi error:", error);
      return false;
    }

    const result = await response.json();
    console.log(`[WhatsApp] Enviado com sucesso para ${phone}`);
    console.log(`[WhatsApp] Code: ${reservationCode}`);
    console.log(`[WhatsApp] Response:`, result);

    return true;
  } catch (error) {
    console.error("[WhatsApp] Erro ao enviar:", error);
    return false;
  }
}

/**
 * Formatar mensagem de confirmação
 */
export function formatConfirmationMessage(
  reservationCode: string,
  restaurantName: string,
  date: string,
  guestCount: number
): string {
  const formattedDate = new Date(date).toLocaleString("pt-BR");
  return `Olá! Sua reserva foi confirmada 🎉\n\nRestaurante: ${restaurantName}\nData: ${formattedDate}\nHóspedes: ${guestCount}\nCódigo: ${reservationCode}\n\nAguardamos sua visita!`;
}

/**
 * Formatar mensagem de aprovação pendente
 */
export function formatPendingMessage(reservationCode: string): string {
  return `Olá! Sua reserva foi recebida! ⏳\n\nEstamos verificando a disponibilidade.\nCódigo: ${reservationCode}\n\nVocê receberá uma confirmação em breve.`;
}
