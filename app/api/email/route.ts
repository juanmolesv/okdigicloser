import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendClosedDealEmail } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'El campo "type" es obligatorio.' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'welcome': {
        const { to, companyName, closerId } = body;

        if (!to || !companyName || !closerId) {
          return NextResponse.json(
            { error: 'Faltan campos obligatorios: to, companyName, closerId.' },
            { status: 400 }
          );
        }

        const data = await sendWelcomeEmail(to, companyName, closerId);

        return NextResponse.json(
          { success: true, message: 'Email de bienvenida enviado.', data },
          { status: 200 }
        );
      }

      case 'closed_deal': {
        const { to, prospectName, saleValue } = body;

        if (!to || !prospectName || saleValue === undefined) {
          return NextResponse.json(
            { error: 'Faltan campos obligatorios: to, prospectName, saleValue.' },
            { status: 400 }
          );
        }

        const numericValue = Number(saleValue);
        if (isNaN(numericValue)) {
          return NextResponse.json(
            { error: 'El campo saleValue debe ser un número válido.' },
            { status: 400 }
          );
        }

        const data = await sendClosedDealEmail(to, prospectName, numericValue);

        return NextResponse.json(
          { success: true, message: 'Email de venta cerrada enviado.', data },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: `Tipo de email no soportado: "${type}". Usa "welcome" o "closed_deal".` },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error('[OkDigiCloser] Error en /api/email:', error);

    const message =
      error instanceof Error ? error.message : 'Error interno del servidor.';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
