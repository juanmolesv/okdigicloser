// Cliente para WhatsApp Business Cloud API (Meta Graph API v18.0)
// Gestiona el envio de mensajes, plantillas, lectura de mensajes y descarga de media

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

function getHeaders(): Record<string, string> {
  const token = process.env.WHATSAPP_API_TOKEN;
  if (!token) throw new Error('WHATSAPP_API_TOKEN no configurado');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Envia un mensaje de texto plano a un numero de WhatsApp.
 * @param phoneNumberId - ID del numero de telefono de WhatsApp Business
 * @param to - Numero del destinatario con codigo de pais (ej: 5491155551234)
 * @param text - Texto del mensaje
 */
export async function sendMessage(
  phoneNumberId: string,
  to: string,
  text: string
): Promise<{ messageId: string }> {
  const url = `${GRAPH_API_URL}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[WhatsApp sendMessage Error]', error);
    throw new Error(
      `Error al enviar mensaje WhatsApp: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return { messageId: data.messages?.[0]?.id ?? '' };
}

/**
 * Envia un mensaje de plantilla (template) pre-aprobada por Meta.
 * @param phoneNumberId - ID del numero de telefono de WhatsApp Business
 * @param to - Numero del destinatario
 * @param templateName - Nombre de la plantilla aprobada
 * @param params - Parametros dinamicos de la plantilla (body components)
 */
export async function sendTemplate(
  phoneNumberId: string,
  to: string,
  templateName: string,
  params: string[] = []
): Promise<{ messageId: string }> {
  const url = `${GRAPH_API_URL}/${phoneNumberId}/messages`;

  // Construir los componentes de parametros del body
  const components =
    params.length > 0
      ? [
          {
            type: 'body',
            parameters: params.map((value) => ({
              type: 'text',
              text: value,
            })),
          },
        ]
      : [];

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'es' },
        components,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[WhatsApp sendTemplate Error]', error);
    throw new Error(
      `Error al enviar plantilla WhatsApp: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return { messageId: data.messages?.[0]?.id ?? '' };
}

/**
 * Marca un mensaje como leido (doble check azul).
 * @param phoneNumberId - ID del numero de telefono de WhatsApp Business
 * @param messageId - ID del mensaje a marcar como leido
 */
export async function markAsRead(
  phoneNumberId: string,
  messageId: string
): Promise<void> {
  const url = `${GRAPH_API_URL}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[WhatsApp markAsRead Error]', error);
    // No lanzamos error ya que marcar como leido no es critico
  }
}

/**
 * Obtiene la URL de descarga de un archivo multimedia.
 * @param mediaId - ID del media enviado por el usuario
 * @returns URL temporal para descargar el archivo
 */
export async function getMediaUrl(
  mediaId: string
): Promise<{ url: string; mimeType: string }> {
  const url = `${GRAPH_API_URL}/${mediaId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[WhatsApp getMediaUrl Error]', error);
    throw new Error(
      `Error al obtener URL de media: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return {
    url: data.url,
    mimeType: data.mime_type,
  };
}
