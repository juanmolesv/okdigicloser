'use client';

import { useState, type FormEvent } from 'react';

export interface BusinessFormData {
  company_name: string;
  product_name: string;
  product_description: string;
  product_price: string;
  product_benefits: string;
  common_objections: string;
  closing_goal: string;
  closing_action: string;
  tone: string;
  avatar_name: string;
}

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => void;
  onChange?: (data: BusinessFormData) => void;
  loading?: boolean;
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

export default function BusinessForm({ onSubmit, onChange, loading }: BusinessFormProps) {
  const [form, setForm] = useState<BusinessFormData>({
    company_name: '',
    product_name: '',
    product_description: '',
    product_price: '',
    product_benefits: '',
    common_objections: '',
    closing_goal: '',
    closing_action: closingActions[0],
    tone: tones[0],
    avatar_name: '',
  });

  function update(field: keyof BusinessFormData, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      onChange?.(next);
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Empresa y producto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Nombre de la empresa</label>
          <input
            type="text"
            required
            placeholder="Ej: OkDigiCloser"
            className={inputClasses}
            value={form.company_name}
            onChange={(e) => update('company_name', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Nombre del producto</label>
          <input
            type="text"
            required
            placeholder="Ej: Closer AI Pro"
            className={inputClasses}
            value={form.product_name}
            onChange={(e) => update('product_name', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Descripcion del producto</label>
        <textarea
          required
          rows={3}
          placeholder="Describe brevemente tu producto o servicio..."
          className={inputClasses + ' resize-none'}
          value={form.product_description}
          onChange={(e) => update('product_description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Precio del producto</label>
          <input
            type="text"
            required
            placeholder="Ej: 497EUR/mes"
            className={inputClasses}
            value={form.product_price}
            onChange={(e) => update('product_price', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Nombre del avatar</label>
          <input
            type="text"
            required
            placeholder="Ej: Sofia"
            className={inputClasses}
            value={form.avatar_name}
            onChange={(e) => update('avatar_name', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Beneficios del producto</label>
        <textarea
          required
          rows={3}
          placeholder="Lista los principales beneficios, uno por linea..."
          className={inputClasses + ' resize-none'}
          value={form.product_benefits}
          onChange={(e) => update('product_benefits', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClasses}>Objeciones comunes</label>
        <textarea
          required
          rows={3}
          placeholder="Que objeciones suelen poner tus clientes?"
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
          placeholder="Ej: Convertir leads en clientes de pago"
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
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Tono de conversacion</label>
          <select
            className={inputClasses}
            value={form.tone}
            onChange={(e) => update('tone', e.target.value)}
          >
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Continuar'}
      </button>
    </form>
  );
}
