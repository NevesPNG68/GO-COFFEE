import React, { useEffect, useState } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { Save, RotateCcw } from 'lucide-react';

function toNumOrZero(s: string) {
  if (s.trim() === '') return 0;
  const n = Number(String(s).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const UpdateForm: React.FC = () => {
  const { data, setData, save, resetDefaults } = useMetrics();

  // inputs como STRING para não travar (principalmente dias)
  const [form, setForm] = useState(() => ({
    currentMonth: String(data.currentMonth ?? ''),
    dayOfMonth: String(data.dayOfMonth ?? ''),
    teamSize: String(data.teamSize ?? ''),
    daysRemaining: String(data.daysRemaining ?? ''),

    currentSales: String(data.currentSales ?? ''),
    targetSales: String(data.targetSales ?? ''),
    bonusValueSales: String(data.bonusValueSales ?? ''),

    currentTicket: String(data.currentTicket ?? ''),
    targetTicket: String(data.targetTicket ?? ''),
    bonusValueTicket: String(data.bonusValueTicket ?? ''),

    currentRevenue: String(data.currentRevenue ?? ''),
    targetRevenueTier1: String(data.targetRevenueTier1 ?? ''),
    targetRevenueTier2: String(data.targetRevenueTier2 ?? ''),
    targetRevenueTier3: String(data.targetRevenueTier3 ?? ''),
    bonusValueRevenueT1: String(data.bonusValueRevenueT1 ?? ''),
    bonusValueRevenueT2: String(data.bonusValueRevenueT2 ?? ''),
    bonusValueRevenueT3: String(data.bonusValueRevenueT3 ?? ''),
  }));

  // se resetar no contexto, espelha no form
  useEffect(() => {
    setForm({
      currentMonth: String(data.currentMonth ?? ''),
      dayOfMonth: String(data.dayOfMonth ?? ''),
      teamSize: String(data.teamSize ?? ''),
      daysRemaining: String(data.daysRemaining ?? ''),

      currentSales: String(data.currentSales ?? ''),
      targetSales: String(data.targetSales ?? ''),
      bonusValueSales: String(data.bonusValueSales ?? ''),

      currentTicket: String(data.currentTicket ?? ''),
      targetTicket: String(data.targetTicket ?? ''),
      bonusValueTicket: String(data.bonusValueTicket ?? ''),

      currentRevenue: String(data.currentRevenue ?? ''),
      targetRevenueTier1: String(data.targetRevenueTier1 ?? ''),
      targetRevenueTier2: String(data.targetRevenueTier2 ?? ''),
      targetRevenueTier3: String(data.targetRevenueTier3 ?? ''),
      bonusValueRevenueT1: String(data.bonusValueRevenueT1 ?? ''),
      bonusValueRevenueT2: String(data.bonusValueRevenueT2 ?? ''),
      bonusValueRevenueT3: String(data.bonusValueRevenueT3 ?? ''),
    });
  }, [data]);

  const onSave = () => {
    setData((prev) => ({
      ...prev,
      currentMonth: form.currentMonth,

      dayOfMonth: Math.max(0, Math.floor(toNumOrZero(form.dayOfMonth))),
      teamSize: Math.max(1, Math.floor(toNumOrZero(form.teamSize))),
      daysRemaining: Math.max(0, Math.floor(toNumOrZero(form.daysRemaining))),

      currentSales: Math.max(0, Math.floor(toNumOrZero(form.currentSales))),
      targetSales: Math.max(0, Math.floor(toNumOrZero(form.targetSales))),
      bonusValueSales: Math.max(0, toNumOrZero(form.bonusValueSales)),

      currentTicket: Math.max(0, toNumOrZero(form.currentTicket)),
      targetTicket: Math.max(0, toNumOrZero(form.targetTicket)),
      bonusValueTicket: Math.max(0, toNumOrZero(form.bonusValueTicket)),

      currentRevenue: Math.max(0, toNumOrZero(form.currentRevenue)),
      targetRevenueTier1: Math.max(0, toNumOrZero(form.targetRevenueTier1)),
      targetRevenueTier2: Math.max(0, toNumOrZero(form.targetRevenueTier2)),
      targetRevenueTier3: Math.max(0, toNumOrZero(form.targetRevenueTier3)),
      bonusValueRevenueT1: Math.max(0, toNumOrZero(form.bonusValueRevenueT1)),
      bonusValueRevenueT2: Math.max(0, toNumOrZero(form.bonusValueRevenueT2)),
      bonusValueRevenueT3: Math.max(0, toNumOrZero(form.bonusValueRevenueT3)),
    }));

    // garante gravação imediata
    setTimeout(() => save(), 0);
    alert('Configurações salvas ✅');
  };

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    inputMode = 'decimal',
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  }) => (
    <label className="block">
      <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      <input
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Top info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label="Mês (rótulo)"
            value={form.currentMonth}
            onChange={(v) => setForm((p) => ({ ...p, currentMonth: v }))}
            placeholder="Fevereiro 2026"
            inputMode="text"
          />
          <Field
            label="Dia do mês"
            value={form.dayOfMonth}
            onChange={(v) => setForm((p) => ({ ...p, dayOfMonth: v }))}
            placeholder="19"
            inputMode="numeric"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Equipe"
              value={form.teamSize}
              onChange={(v) => setForm((p) => ({ ...p, teamSize: v }))}
              placeholder="2"
              inputMode="numeric"
            />
            <Field
              label="Dias restantes"
              value={form.daysRemaining}
              onChange={(v) => setForm((p) => ({ ...p, daysRemaining: v }))}
              placeholder="18"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      {/* Meta 01 + Meta 02 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 md:p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">Meta 01: Volume de Vendas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Realizado"
              value={form.currentSales}
              onChange={(v) => setForm((p) => ({ ...p, currentSales: v }))}
              inputMode="numeric"
            />
            <Field
              label="Meta (qtd)"
              value={form.targetSales}
              onChange={(v) => setForm((p) => ({ ...p, targetSales: v }))}
              inputMode="numeric"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Valor do bônus (se atingido)"
              value={form.bonusValueSales}
              onChange={(v) => setForm((p) => ({ ...p, bonusValueSales: v }))}
            />
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 md:p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">Meta 02: Ticket Médio</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Atual"
              value={form.currentTicket}
              onChange={(v) => setForm((p) => ({ ...p, currentTicket: v }))}
            />
            <Field
              label="Meta"
              value={form.targetTicket}
              onChange={(v) => setForm((p) => ({ ...p, targetTicket: v }))}
            />
          </div>
          <div className="mt-4">
            <Field
              label="Valor do bônus (se atingido)"
              value={form.bonusValueTicket}
              onChange={(v) => setForm((p) => ({ ...p, bonusValueTicket: v }))}
            />
          </div>
        </div>
      </div>

      {/* Meta 03 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">Meta 03: Faturamento Bruto (Escalonado)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Field
            label="Faturamento atual"
            value={form.currentRevenue}
            onChange={(v) => setForm((p) => ({ ...p, currentRevenue: v }))}
          />
          {/* equipe já fica no topo */}
          <div className="hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Field
              label="Meta Nível 1 (Bronze)"
              value={form.targetRevenueTier1}
              onChange={(v) => setForm((p) => ({ ...p, targetRevenueTier1: v }))}
            />
            <Field
              label="Meta Nível 2 (Prata)"
              value={form.targetRevenueTier2}
              onChange={(v) => setForm((p) => ({ ...p, targetRevenueTier2: v }))}
            />
            <Field
              label="Meta Nível 3 (Ouro)"
              value={form.targetRevenueTier3}
              onChange={(v) => setForm((p) => ({ ...p, targetRevenueTier3: v }))}
            />
          </div>

          <div className="space-y-3">
            <Field
              label="Bônus Nível 1"
              value={form.bonusValueRevenueT1}
              onChange={(v) => setForm((p) => ({ ...p, bonusValueRevenueT1: v }))}
            />
            <Field
              label="Bônus Nível 2"
              value={form.bonusValueRevenueT2}
              onChange={(v) => setForm((p) => ({ ...p, bonusValueRevenueT2: v }))}
            />
            <Field
              label="Bônus Nível 3"
              value={form.bonusValueRevenueT3}
              onChange={(v) => setForm((p) => ({ ...p, bonusValueRevenueT3: v }))}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={resetDefaults}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={18} />
            Restaurar Padrões
          </button>

          <button
            onClick={onSave}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-sm font-black text-white hover:opacity-95"
          >
            <Save size={18} />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
