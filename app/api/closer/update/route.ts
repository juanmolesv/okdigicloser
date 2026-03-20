import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { closerId, ...fields } = body;

    if (!closerId) {
      return NextResponse.json({ error: 'closerId requerido' }, { status: 400 });
    }

    // Only allow updating specific fields
    const allowed = [
      'product_name',
      'product_description',
      'product_price',
      'product_benefits',
      'common_objections',
      'closing_goal',
      'closing_action',
      'tone',
      'avatar_name',
      'name',
      'welcome_message',
      'is_active',
    ];

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (key in fields) {
        updateData[key] = fields[key];
      }
    }

    const { data: closer, error } = await supabase
      .from('closers')
      .update(updateData)
      .eq('id', closerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating closer:', error);
      return NextResponse.json({ error: 'Error actualizando cerrador' }, { status: 500 });
    }

    return NextResponse.json({ closer });
  } catch (err) {
    console.error('[Closer Update Error]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
