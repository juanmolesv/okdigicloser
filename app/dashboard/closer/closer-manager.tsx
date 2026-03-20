'use client';

import { useState } from 'react';
import Link from 'next/link';
import CloserEditForm from '@/components/dashboard/CloserEditForm';

interface CloserData {
  id: string;
  name: string;
  product_name: string;
  product_description: string;
  product_price: string;
  product_benefits: string;
  common_objections: string | null;
  closing_goal: string;
  closing_action: string;
  tone: string;
  avatar_name: string;
  is_active: boolean;
}

export default function CloserManager({
  initialCloser,
  appUrl,
}: {
  initialCloser: CloserData;
  appUrl: string;
}) {
  const [closer, setCloser] = useState(initialCloser);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Editar Cerrador</h2>
        <CloserEditForm
          closer={closer}
          onSaved={(updated) => {
            setCloser(updated);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{closer.name}</h2>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                closer.is_active
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-red-900/30 text-red-400'
              }`}
            >
              {closer.is_active ? 'Activo' : 'Inactivo'}
            </span>
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-700"
            >
              Editar
            </button>
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <div>
            <span className="text-slate-400">Producto:</span>
            <p className="text-white">{closer.product_name}</p>
          </div>
          <div>
            <span className="text-slate-400">Precio:</span>
            <p className="text-white">{closer.product_price}</p>
          </div>
          <div>
            <span className="text-slate-400">Descripcion:</span>
            <p className="text-white">{closer.product_description}</p>
          </div>
          <div>
            <span className="text-slate-400">Beneficios:</span>
            <p className="whitespace-pre-line text-white">{closer.product_benefits}</p>
          </div>
          <div>
            <span className="text-slate-400">Objeciones:</span>
            <p className="whitespace-pre-line text-white">
              {closer.common_objections || 'No configuradas'}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Objetivo de cierre:</span>
            <p className="text-white">{closer.closing_goal}</p>
          </div>
          <div>
            <span className="text-slate-400">Accion de cierre:</span>
            <p className="text-white">{closer.closing_action}</p>
          </div>
          <div>
            <span className="text-slate-400">Tono:</span>
            <p className="capitalize text-white">{closer.tone}</p>
          </div>
          <div>
            <span className="text-slate-400">Avatar:</span>
            <p className="text-white">{closer.avatar_name}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-3 font-semibold">Link directo</h3>
        <code className="block rounded-lg bg-slate-800 p-3 text-sm text-blue-400">
          {appUrl}/closer/{closer.id}
        </code>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-3 font-semibold">Widget embebible</h3>
        <code className="block whitespace-pre-wrap rounded-lg bg-slate-800 p-3 text-sm text-green-400">
          {`<script src="${appUrl}/widget.js" data-closer-id="${closer.id}" async></script>`}
        </code>
      </div>

      <div className="flex gap-4">
        <Link
          href={`/closer/${closer.id}`}
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          Probar Cerrador
        </Link>
      </div>
    </div>
  );
}
