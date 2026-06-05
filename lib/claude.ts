import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt com contexto do restaurante (reutilizado com cache)
const RESTAURANT_SYSTEM_PROMPT = `You are an AI assistant for a restaurant booking system. Your role is to:
1. Help analyze restaurant availability and capacity
2. Suggest optimal table assignments based on guest count and preferences
3. Generate personalized reservation confirmations
4. Provide insights about booking patterns and optimization suggestions

Always be concise, professional, and customer-focused. Return JSON responses when asked for structured data.

Guidelines:
- Consider guest count, special requests, and table capacity
- Suggest tables that match guest needs (quiet corner, window seat, etc.)
- Calculate optimal seating arrangements
- Provide confirmation messages in a friendly tone`;

interface ReservationData {
  guestCount: number;
  date: string;
  specialRequests?: string;
  tables: Array<{
    number: number;
    seats: number;
    status: string;
  }>;
}

/**
 * Analyze reservation request and suggest best table assignment
 * Uses prompt caching to save tokens on repeated calls
 */
export async function analyzeReservation(data: ReservationData) {
  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: RESTAURANT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }, // Cache this system prompt
      },
    ],
    messages: [
      {
        role: "user",
        content: `Analyze this reservation request and suggest the best available table:

Guest Count: ${data.guestCount}
Date: ${data.date}
Special Requests: ${data.specialRequests || "None"}

Available Tables:
${data.tables.map((t) => `- Table ${t.number}: ${t.seats} seats (${t.status})`).join("\n")}

Return a JSON response with:
{
  "suggestedTable": number,
  "reasoning": "string",
  "confirmation": "string"
}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return JSON.parse(content.text);
  }
  throw new Error("Invalid response from Claude");
}

/**
 * Generate personalized confirmation message with cached context
 */
export async function generateConfirmation(
  guestName: string,
  reservationDetails: string
) {
  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: RESTAURANT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Generate a warm, personalized confirmation message for this reservation:

Guest Name: ${guestName}
Details: ${reservationDetails}

Keep it under 150 words and include:
1. Confirmation of booking details
2. Check-in instructions
3. Cancellation policy mention
4. Contact info request`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  throw new Error("Invalid response from Claude");
}

/**
 * Get booking insights (cache helps on repeated calls)
 */
export async function getBookingInsights(
  restaurantData: string
): Promise<{
  busyTimes: string[];
  recommendations: string[];
  occupancyRate: number;
}> {
  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: RESTAURANT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Analyze these booking patterns and provide insights:

${restaurantData}

Return JSON with:
{
  "busyTimes": ["string"],
  "recommendations": ["string"],
  "occupancyRate": number (0-100)
}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return JSON.parse(content.text);
  }
  throw new Error("Invalid response from Claude");
}

// Export usage tracking for cost monitoring
export function getUsageInfo() {
  return {
    modelUsed: "claude-opus-4-7",
    cacheEnabled: true,
    cacheNote:
      "System prompt uses ephemeral cache (5min TTL, 90% token savings)",
  };
}
