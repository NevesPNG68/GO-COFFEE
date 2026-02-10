import React, { useMemo, useState } from 'react';
import { useMetrics } from '../context/MetricsContext';

function toNum(v: string) {
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const UpdateForm: React.FC = () => {
  const { data, updateData, reset } = useMetrics();

  // formulário local (evita travar enquanto digita)
  const [form, setForm] = useState(() => ({ ...data }));

  // sempre que abrir/voltar na aba, garante que pega o que está salvo
  useMemo(() => {
    setForm({ ...data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.currentMonth]);

  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateData({
      currentMonth: String(form.currentMonth || '').toUpperCase(),
      dayOfMonth: toNum(String(form.dayOfMonth)),
      teamSize: toNum(String(form.teamSize)),
      daysRemaining: toNum(String(form.daysRemaining)),

      currentSales: toNum(String(form.currentSales)),
      targetSales: toNum(String(form.targetSales)),
      bonusValueSales: toNum(String(form.bonusValueSales)),

      currentTicket: toNum(String(form.currentTicket)),
      targetTicket: toNum(String(form.targetTicket)),
      bonusValueTicket: toNum(String(form.bonusValueTicket)),

      currentRevenue: toNum(String(form.currentRevenue)),
      targetRevenueTier1: toNum(String(form.targetRevenueTier1)),
      targetRevenueTier2: toNum(String(form.targetRevenueTier2)),
      targetRevenueTier3: toNum(String(form.targetRevenueTier3)),

      bonusValueRevenueT1: toNum(String(form.bonusValueRevenueT1)),
      bonusValueRevenueT2: toNum(String(form.bonusValueRevenueT2)),
      bonusValueRevenueT3: toNum(String(form.bonusValueRevenueT3)),
    });

    alert('Salvo ✅ (fica gravado no navegador)');
  };

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <h2 className="text-lg font-bold text-gray-900">Atualizar Dados</h2>
        <p className="text-sm text-gray-500 mt-1">
          Depois de salvar, o Dashboard recalcula automaticamente e fica gravado.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600">Mês (rótulo)</label>
            <input
              value={form.currentMonth}
              onChange={(e) => set('currentMonth', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              placeholder="FEVEREIRO 2026"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Dia do mês</label>
            <input
              value={form.dayOfMonth}
              onChange={(e) => set('dayOfMonth', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Equipe</label>
            <input
              value={form.teamSize}
              onChange={(e) => set('teamSize', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Dias restantes</label>
            <input
              value={form.daysRemaining}
              onChange={(e) => set('daysRemaining', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      {/* META 01 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-base font-bold text-gray-900">Meta 01 — Volume</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Realizado</label>
            <input
              value={form.currentSales}
              onChange={(e) => set('currentSales', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Meta</label>
            <input
              value={form.targetSales}
              onChange={(e) => set('targetSales', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Prêmio</label>
            <input
              value={form.bonusValueSales}
              onChange={(e) => set('bonusValueSales', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* META 02 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-base font-bold text-gray-900">Meta 02 — Ticket Médio</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Atual</label>
            <input
              value={form.currentTicket}
              onChange={(e) => set('currentTicket', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Meta</label>
            <input
              value={form.targetTicket}
              onChange={(e) => set('targetTicket', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Prêmio</label>
            <input
              value={form.bonusValueTicket}
              onChange={(e) => set('bonusValueTicket', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          * Trava: ticket só libera quando <b>currentSales ≥ 1200</b>.
        </p>
      </div>

      {/* META 03 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        <h3 className="text-base font-bold text-gray-900">Meta 03 — Faturamento (3 níveis)</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-gray-600">Acumulado</label>
            <input
              value={form.currentRevenue}
              onChange={(e) => set('currentRevenue', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Meta N1</label>
            <input
              value={form.targetRevenueTier1}
              onChange={(e) => set('targetRevenueTier1', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
            <label className="text-xs font-semibold text-gray-600 mt-3 block">Prêmio N1</label>
            <input
              value={form.bonusValueRevenueT1}
              onChange={(e) => set('bonusValueRevenueT1', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Meta N2</label>
            <input
              value={form.targetRevenueTier2}
              onChange={(e) => set('targetRevenueTier2', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
            <label className="text-xs font-semibold text-gray-600 mt-3 block">Prêmio N2</label>
            <input
              value={form.bonusValueRevenueT2}
              onChange={(e) => set('bonusValueRevenueT2', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Meta N3</label>
            <input
              value={form.targetRevenueTier3}
              onChange={(e) => set('targetRevenueTier3', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
            <label className="text-xs font-semibold text-gray-600 mt-3 block">Prêmio N3</label>
            <input
              value={form.bonusValueRevenueT3}
              onChange={(e) => set('bonusValueRevenueT3', e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              inputMode="decimal"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          * No bônus, o faturamento conta <b>apenas o maior nível atingido</b> (não soma os níveis).
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-sm hover:opacity-90"
        >
          Salvar
        </button>

        <button
          type="button"
          onClick={() => {
            reset();
            setForm({ ...data });
            alert('Resetado ✅');
          }}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 font-bold text-sm hover:bg-gray-50"
        >
          Resetar
        </button>
      </div>
    </form>
  );
};

export default UpdateForm;
