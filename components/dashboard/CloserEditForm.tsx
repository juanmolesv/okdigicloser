'use client';

import { useState, type FormEvent } from 'react';

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

const closingActions = [
  'Pagar ahora',
  'Agendar llamada',
  'Firmar contrato',
  'Reservar plaza',
];

const tones = [
  'Profesional',
  'Cercano y amigable',
  'Urgente',
  'Consultivo',
];

const inputClasses =
  'w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors';

const labelClasses = 'block text-sm font-medium text-slate-300 mb-1.5';

export default function CloserEditForm({
  closer,
  onSaved,
  onCancel,
}: {
  closer: CloserData;
  onSaved: (updated: CloserData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: closer.name,
    product_name: closer.product_name,
    product_description: closer.product_description,
    product_price: closer.product_price,
    product_benefits: closer.product_benefits,
    common_objections: closer.common_objections || '',
    closing_goal: closer.closing_goal,
    closing_action: closer.closing_action,
    tone: closer.tone,
    avatar_name: closer.avatar_name,
    is_active: closer.is_active,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/closer/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closerId: closer.id, ...form }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error guardando');
      }

      const { closer: updated } = await res.json();
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando cambios');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Nombre del cerrador</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Nombre del avatar</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={form.avatar_name}
            onChange={(e) => update('avatar_name', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Producto</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={form.product_name}
            onChange={(e) => update('product_name', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Precio</label>
          <input
            type="text"
            required
            className={inputClasses}
            value={form.product_price}
            onChange={(e) => update('product_price', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Descripcion del producto</label>
        <textarea
          required
          rows={3}
          className={inputClasses + ' resize-none'}
          value={form.product_description}
          onChange={(e) => update('product_description', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClasses}>Beneficios</label>
        <textarea
          required
          rows={3}
          className={inputClasses + ' resize-none'}
          value={form.product_benefits}
          onChange={(e) => update('product_benefits', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClasses}>Objeciones comunes</label>
        <textarea
          rows={3}
          className={inputClasses + ' resize-none'}
          value={form.common_objections}
          onChange={(e) => update('common_objections', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClasses}>Objetivo de cierre</label>
        <input
          type="text"
          required
          className={inputClasses}
          value={form.closing_goal}
          onChange={(e) => update('closing_goal', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Accion de cierre</label>
          <select
            className={inputClasses}
            value={form.closing_action}
            onChange={(e) => update('closing_action', e.target.value)}
          >
            {closingActions.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Tono</label>
          <select
            className={inputClasses}
            value={form.tone}
            onChange={(e) => update('tone', e.target.value)}
          >
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={form.is_active}
            onChange={(e) => update('is_active', e.target.checked)}
          />
          <div className="h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-400 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
        </label>
        <span className="text-sm text-slate-300">Cerrador activo</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
