import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'OkDigiCloser <noreply@okdigicloser.com>';
const DASHBOARD_URL = 'https://okdigicloser.com/dashboard';

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#2563eb;padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">OkDigiCloser</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">
                &copy; ${new Date().getFullYear()} OkDigiCloser. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export async function sendWelcomeEmail(
  to: string,
  companyName: string,
  closerId: string
) {
  const closerUrl = `https://okdigicloser.com/closer/${closerId}`;
  const embedSnippet = `&lt;script src=&quot;https://okdigicloser.com/widget.js&quot; data-closer-id=&quot;${closerId}&quot;&gt;&lt;/script&gt;`;

  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#18181b;">
      ¡Bienvenido a OkDigiCloser, ${companyName}!
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:#3f3f46;line-height:1.6;">
      Tu closer de ventas con inteligencia artificial ya está listo para trabajar.
      A partir de ahora podrás cerrar ventas las 24 horas del día, los 7 días de la semana,
      sin necesidad de intervención humana.
    </p>

    <h3 style="margin:24px 0 8px;font-size:16px;color:#18181b;">Tu enlace de closer</h3>
    <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">
      Comparte este enlace con tus prospectos para que hablen directamente con tu closer:
    </p>
    <p style="margin:0 0 20px;">
      <a href="${closerUrl}" style="color:#2563eb;font-size:14px;word-break:break-all;">${closerUrl}</a>
    </p>

    <h3 style="margin:24px 0 8px;font-size:16px;color:#18181b;">Panel de control</h3>
    <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">
      Accede a tu dashboard para ver estadísticas, conversaciones y configurar tu closer:
    </p>
    <p style="margin:0 0 20px;">
      <a href="${DASHBOARD_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
        Ir al Dashboard
      </a>
    </p>

    <h3 style="margin:24px 0 8px;font-size:16px;color:#18181b;">Instala el widget en tu web</h3>
    <p style="margin:0 0 8px;font-size:14px;color:#3f3f46;">
      Copia y pega este código justo antes de la etiqueta <code>&lt;/body&gt;</code> de tu sitio web:
    </p>
    <div style="background:#f4f4f5;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:13px;color:#18181b;word-break:break-all;border:1px solid #e4e4e7;">
      ${embedSnippet}
    </div>

    <p style="margin:24px 0 0;font-size:14px;color:#3f3f46;line-height:1.6;">
      Si tienes alguna duda, responde a este correo y te ayudaremos encantados.<br><br>
      — El equipo de <strong>OkDigiCloser</strong>
    </p>
  `);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `¡Bienvenido a OkDigiCloser, ${companyName}!`,
    html,
  });

  if (error) {
    console.error('[OkDigiCloser] Error enviando email de bienvenida:', error);
    throw new Error(`Error enviando email de bienvenida: ${error.message}`);
  }

  return data;
}

export async function sendClosedDealEmail(
  to: string,
  prospectName: string,
  saleValue: number
) {
  const formattedValue = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(saleValue);

  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#18181b;">
      &#127881; ¡Venta cerrada!
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">
      Tu closer de OkDigiCloser acaba de cerrar una nueva venta. Aquí tienes los detalles:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e4e4e7;">
          <span style="font-size:13px;color:#71717a;display:block;margin-bottom:2px;">Prospecto</span>
          <span style="font-size:16px;color:#18181b;font-weight:600;">${prospectName}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <span style="font-size:13px;color:#71717a;display:block;margin-bottom:2px;">Valor de la venta</span>
          <span style="font-size:22px;color:#16a34a;font-weight:700;">${formattedValue}</span>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 20px;font-size:14px;color:#3f3f46;line-height:1.6;">
      Puedes ver todos los detalles de esta conversación y el historial completo de ventas
      desde tu panel de control.
    </p>

    <p style="margin:0 0 24px;">
      <a href="${DASHBOARD_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
        Ver en el Dashboard
      </a>
    </p>

    <p style="margin:0;font-size:14px;color:#3f3f46;">
      ¡Sigue así! Tu closer trabaja sin parar para ti.<br><br>
      — El equipo de <strong>OkDigiCloser</strong>
    </p>
  `);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `¡Venta cerrada! ${prospectName} — ${formattedValue}`,
    html,
  });

  if (error) {
    console.error('[OkDigiCloser] Error enviando email de venta cerrada:', error);
    throw new Error(`Error enviando email de venta cerrada: ${error.message}`);
  }

  return data;
}
