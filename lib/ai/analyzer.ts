import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return res.content[0].type === 'text' ? res.content[0].text : '';
}

function parseJSON<T>(raw: string, fallback: T): T {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

function formatMessages(messages: Message[]): string {
  return messages
    .map((m) => `[${m.role === 'user' ? 'PROSPECTO' : 'CLOSER'}]: ${m.content}`)
    .join('\n');
}

// ---------------------------------------------------------------------------
// 1. Detect if a deal was closed
// ---------------------------------------------------------------------------

export async function detectClosing(
  messages: Message[],
  closingAction: string
): Promise<{
  isClosed: boolean;
  confidence: number;
  reason: string;
  estimatedValue?: number;
}> {
  const fallback = { isClosed: false, confidence: 0, reason: 'No se pudo analizar', estimatedValue: undefined };

  try {
    const system = `Eres un analista experto en ventas y cierre de negocios con más de 20 años de experiencia. Tu trabajo es determinar si en una conversación de ventas el prospecto ha aceptado la acción de cierre propuesta. Analiza señales explícitas e implícitas de compromiso de compra. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Analiza la siguiente conversación de ventas y determina si el prospecto aceptó la acción de cierre.

ACCIÓN DE CIERRE ESPERADA: ${closingAction}

CONVERSACIÓN:
${formatMessages(messages)}

Responde con este JSON exacto:
{
  "isClosed": boolean (true si el prospecto aceptó la acción de cierre),
  "confidence": number (0-100, nivel de certeza de tu análisis),
  "reason": "string (explicación concisa de por qué consideras que se cerró o no)",
  "estimatedValue": number | null (valor estimado del negocio si se menciona algún precio o plan)
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// 2. Score the lead based on conversation
// ---------------------------------------------------------------------------

export async function scoreLeadAI(
  messages: Message[]
): Promise<{
  score: number;
  temperature: 'cold' | 'warm' | 'hot' | 'ready';
  signals: string[];
  objections: string[];
  nextAction: string;
}> {
  const fallback = {
    score: 50,
    temperature: 'warm' as const,
    signals: [],
    objections: [],
    nextAction: 'Continuar seguimiento',
  };

  try {
    const system = `Eres un experto en calificación de leads y scoring de prospectos. Tienes amplia experiencia analizando conversaciones de ventas para determinar la probabilidad de cierre. Evalúas señales de compra, objeciones, nivel de compromiso y urgencia del prospecto. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Analiza la siguiente conversación de ventas y califica al prospecto.

CONVERSACIÓN:
${formatMessages(messages)}

Evalúa lo siguiente:
- Señales de compra: preguntas sobre precio, disponibilidad, plazos, proceso de compra, referencias.
- Objeciones: precio alto, falta de tiempo, necesidad de consultar, competencia, desconfianza.
- Nivel de engagement: longitud de respuestas, preguntas activas, rapidez de respuesta.
- Urgencia: menciones de plazos, necesidad inmediata, presión externa.

Responde con este JSON exacto:
{
  "score": number (0-100, donde 0 es nulo interés y 100 es compra segura),
  "temperature": "cold" | "warm" | "hot" | "ready" (cold: 0-25, warm: 26-50, hot: 51-75, ready: 76-100),
  "signals": ["señal 1", "señal 2"] (señales de compra detectadas en español),
  "objections": ["objeción 1"] (objeciones detectadas en español),
  "nextAction": "string (acción recomendada para el closer, en español)"
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// 3. Analyze sentiment of the latest message
// ---------------------------------------------------------------------------

export async function analyzeSentiment(
  message: string
): Promise<{
  sentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  emotion: string;
  urgency: 'low' | 'medium' | 'high';
  buyingIntent: number;
}> {
  const fallback = {
    sentiment: 'neutral' as const,
    emotion: 'neutral',
    urgency: 'low' as const,
    buyingIntent: 50,
  };

  try {
    const system = `Eres un experto en análisis de sentimiento y psicología del consumidor aplicada a ventas. Analizas mensajes individuales de prospectos para detectar su estado emocional, intención de compra y nivel de urgencia. Tu análisis es preciso y matizado. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Analiza el sentimiento y la intención de compra del siguiente mensaje de un prospecto.

MENSAJE DEL PROSPECTO:
"${message}"

Considera:
- Tono general del mensaje (positivo, negativo, neutro).
- Emoción predominante (interesado, frustrado, confundido, emocionado, escéptico, impaciente, etc.).
- Indicadores de urgencia (menciones de tiempo, presión, necesidad inmediata).
- Señales de intención de compra (preguntas sobre precio, proceso, disponibilidad).

Responde con este JSON exacto:
{
  "sentiment": "very_negative" | "negative" | "neutral" | "positive" | "very_positive",
  "emotion": "string (emoción predominante en español, ej: interesado, frustrado, confundido, emocionado, escéptico)",
  "urgency": "low" | "medium" | "high",
  "buyingIntent": number (0-100, probabilidad de que este mensaje indique intención de compra)
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// 4. Detect objections in real-time
// ---------------------------------------------------------------------------

export async function detectObjections(
  message: string,
  productContext: string
): Promise<{
  hasObjection: boolean;
  type: string | null;
  suggestedResponse: string;
}> {
  const fallback = {
    hasObjection: false,
    type: null,
    suggestedResponse: '',
  };

  try {
    const system = `Eres un coach de ventas experto especializado en manejo de objeciones. Has entrenado a miles de closers en técnicas avanzadas de persuasión y resolución de objeciones. Tu capacidad para detectar objeciones ocultas y formular respuestas efectivas es excepcional. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Analiza el siguiente mensaje de un prospecto y detecta si contiene alguna objeción de venta.

CONTEXTO DEL PRODUCTO/SERVICIO:
${productContext}

MENSAJE DEL PROSPECTO:
"${message}"

Tipos de objeciones a detectar:
- "price": El prospecto considera que es caro o no tiene presupuesto.
- "time": El prospecto dice que no tiene tiempo o no es el momento.
- "trust": El prospecto no confía en el producto, la empresa o el vendedor.
- "competition": El prospecto menciona o compara con la competencia.
- "need": El prospecto no ve la necesidad o el valor del producto.
- "authority": El prospecto necesita consultar con alguien más para decidir.

Si detectas una objeción, sugiere una respuesta persuasiva pero empática que el closer podría usar. La respuesta sugerida debe ser natural, no agresiva, y enfocada en resolver la preocupación real del prospecto.

Responde con este JSON exacto:
{
  "hasObjection": boolean,
  "type": "price" | "time" | "trust" | "competition" | "need" | "authority" | null,
  "suggestedResponse": "string (respuesta sugerida en español para el closer, vacío si no hay objeción)"
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// 5. Generate conversation summary
// ---------------------------------------------------------------------------

export async function summarizeConversation(
  messages: Message[],
  productName: string
): Promise<{
  summary: string;
  keyTopics: string[];
  prospectNeeds: string[];
  outcome: string;
  followUpRecommendation: string;
}> {
  const fallback = {
    summary: 'No se pudo generar el resumen.',
    keyTopics: [],
    prospectNeeds: [],
    outcome: 'Desconocido',
    followUpRecommendation: 'Revisar la conversación manualmente.',
  };

  try {
    const system = `Eres un analista senior de ventas que genera resúmenes ejecutivos de conversaciones comerciales. Tus resúmenes son concisos, accionables y capturan los puntos clave que un gerente de ventas necesita saber. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Genera un resumen ejecutivo de la siguiente conversación de ventas.

PRODUCTO/SERVICIO: ${productName}

CONVERSACIÓN:
${formatMessages(messages)}

Incluye:
- Un resumen conciso de 2-3 oraciones que capture lo esencial de la conversación.
- Los temas principales discutidos.
- Las necesidades o dolores que expresó el prospecto.
- El resultado de la conversación (venta cerrada, pendiente, perdida, etc.).
- Recomendación de seguimiento específica y accionable.

Responde con este JSON exacto:
{
  "summary": "string (resumen de 2-3 oraciones en español)",
  "keyTopics": ["tema 1", "tema 2"] (temas principales en español),
  "prospectNeeds": ["necesidad 1", "necesidad 2"] (necesidades detectadas en español),
  "outcome": "string (resultado de la conversación en español)",
  "followUpRecommendation": "string (recomendación de seguimiento específica en español)"
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// 6. Generate follow-up message
// ---------------------------------------------------------------------------

export async function generateFollowUp(
  messages: Message[],
  productName: string,
  daysSinceLastContact: number
): Promise<{
  message: string;
  channel: 'email' | 'whatsapp' | 'chat';
  tone: string;
  urgency: 'soft' | 'medium' | 'strong';
}> {
  const fallback = {
    message: 'Hola, quería dar seguimiento a nuestra conversación anterior. ¿Tienes alguna duda que pueda resolver?',
    channel: 'whatsapp' as const,
    tone: 'amigable',
    urgency: 'soft' as const,
  };

  try {
    const system = `Eres un experto en copywriting de ventas y seguimiento comercial. Generas mensajes de follow-up altamente efectivos que reenganchan a prospectos sin ser invasivos. Adaptas el tono, canal y urgencia según el contexto de la conversación previa y el tiempo transcurrido. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Genera un mensaje de seguimiento para un prospecto que no cerró la venta.

PRODUCTO/SERVICIO: ${productName}
DÍAS DESDE ÚLTIMO CONTACTO: ${daysSinceLastContact}

CONVERSACIÓN PREVIA:
${formatMessages(messages)}

Reglas para el mensaje:
- Si han pasado 1-3 días: tono cercano, recordatorio suave, canal WhatsApp.
- Si han pasado 4-7 días: aportar valor adicional, resolver posible duda pendiente.
- Si han pasado 8-14 días: crear ligera urgencia, ofrecer algo especial.
- Si han pasado más de 14 días: reenganche con enfoque fresco, no mencionar la venta directamente.
- El mensaje debe sonar natural y humano, no como un bot.
- Máximo 3 oraciones para WhatsApp, 5 para email.

Responde con este JSON exacto:
{
  "message": "string (mensaje de follow-up listo para enviar en español)",
  "channel": "email" | "whatsapp" | "chat" (canal recomendado),
  "tone": "string (tono del mensaje, ej: amigable, profesional, urgente, casual)",
  "urgency": "soft" | "medium" | "strong"
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// 7. Generate AI insights for dashboard
// ---------------------------------------------------------------------------

export async function generateInsights(stats: {
  totalConversations: number;
  closedWon: number;
  closedLost: number;
  avgResponseTime: number;
  commonObjections: string[];
  avgScore: number;
}): Promise<{
  overallAssessment: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  projectedCloseRate: number;
}> {
  const currentCloseRate =
    stats.totalConversations > 0
      ? Math.round((stats.closedWon / stats.totalConversations) * 100)
      : 0;

  const fallback = {
    overallAssessment: 'No hay suficientes datos para generar un análisis.',
    recommendations: ['Recopilar más datos de conversaciones'],
    strengths: [],
    weaknesses: [],
    projectedCloseRate: currentCloseRate,
  };

  try {
    const system = `Eres un director comercial y consultor de ventas de alto nivel con experiencia en análisis de métricas de equipos de ventas. Generas insights estratégicos basados en datos para mejorar tasas de cierre y rendimiento comercial. Tus recomendaciones son específicas, priorizadas y accionables. Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.`;

    const user = `Analiza las siguientes métricas de rendimiento de ventas y genera insights estratégicos.

MÉTRICAS:
- Total de conversaciones: ${stats.totalConversations}
- Cerradas ganadas: ${stats.closedWon}
- Cerradas perdidas: ${stats.closedLost}
- Tasa de cierre actual: ${currentCloseRate}%
- Tiempo promedio de respuesta: ${stats.avgResponseTime} minutos
- Objeciones más comunes: ${stats.commonObjections.join(', ') || 'Sin datos'}
- Score promedio de leads: ${stats.avgScore}/100

Genera un análisis que incluya:
1. Evaluación general del rendimiento (1-2 oraciones directas y honestas).
2. Recomendaciones priorizadas y específicas (máximo 4).
3. Fortalezas detectadas (basadas en los datos).
4. Debilidades o áreas de mejora (basadas en los datos).
5. Proyección de tasa de cierre si se implementan las mejoras sugeridas.

Responde con este JSON exacto:
{
  "overallAssessment": "string (evaluación general en español)",
  "recommendations": ["recomendación 1", "recomendación 2"] (máximo 4, en español),
  "strengths": ["fortaleza 1"] (en español),
  "weaknesses": ["debilidad 1"] (en español),
  "projectedCloseRate": number (0-100, tasa de cierre proyectada con mejoras)
}`;

    const raw = await callClaude(system, user);
    return parseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}
