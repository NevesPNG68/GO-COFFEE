import React, { useMemo } from 'react';
import { useMetrics } from '../context/MetricsContext';

function toNum(v: string) {
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function Field({
  label,
  value,
  onChange,
  prefix,
  small,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  prefix?: string;
  small?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        {prefix ? (
          <span className="text-sm font-semibold text-gray-500">{prefix}</span>
        ) : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-md border border-gray-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200 ${
            small ? 'text-sm' : 'text-base'
          }`}
        />
      </div>
    </label>
  );
}

const UpdateForm: React.FC = () => {
  const { data, update, resetDefaults, calculations } = useMetrics();

  const headerOk = useMemo(() => {
    return data.currentMonthLabel?.trim().length > 0 && data.dayOfMonth > 0;
  }, [data.currentMonthLabel, data.dayOfMonth]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Configurações</h2>
            <p className="mt-1 text-sm text-gray-500">
              Altere os valores e o sistema <b>grava automaticamente</b> (localStorage) e o dashboard recalcula.
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>
              Status:{' '}
              {headerOk ? (
                <span className="font-bold text-green-600">OK</span>
              ) : (
                <span className="font-bold text-red-600">Ajuste o mês/dia</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label="Mês (ex: FEVEREIRO 2026)"
            value={data.currentMonthLabel}
            onChange={(v) => update({ currentMonthLabel: v.toUpperCase() })}
          />
          <Field
            label="Dia do mês"
            value={data.dayOfMonth}
            onChange={(v) => update({ dayOfMonth: Math.max(1, Math.floor(toNum(v))) })}
          />
          <Field
            label="Equipe (qtd pessoas)"
            value={data.teamSize}
            onChange={(v) => update({ teamSize: Math.max(1, Math.floor(toNum(v))) })}
          />
        </div>
      </div>

      {/* Meta 01 / 02 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta 01 */}
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 md:p-6">
          <h3 className="text-base font-bold text-orange-700">Meta 01: Volume de Vendas</h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Realizado"
              value={data.currentSales}
              onChange={(v) => update({ currentSales: toNum(v) })}
            />
            <Field
              label="Meta (qtd)"
              value={data.targetSales}
              onChange={(v) => update({ targetSales: toNum(v) })}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Valor do bônus (se atingido)"
              value={data.bonusValueSales}
              onChange={(v) => update({ bonusValueSales: toNum(v) })}
              prefix="R$"
            />
            <p className="mt-2 text-xs text-orange-700/80">
              Progresso: <b>{calculations.salesPct.toFixed(1)}%</b> {calculations.salesDone ? '✅' : ''}
            </p>
          </div>
        </div>

        {/* Meta 02 */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 md:p-6">
          <h3 className="text-base font-bold text-emerald-700">Meta 02: Ticket Médio</h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Atual"
              value={data.currentTicket}
              onChange={(v) => update({ currentTicket: toNum(v) })}
              prefix="R$"
            />
            <Field
              label="Meta"
              value={data.targetTicket}
              onChange={(v) => update({ targetTicket: toNum(v) })}
              prefix="R$"
            />
          </div>

          <div className="mt-4">
            <Field
              label="Valor do bônus (se atingido)"
              value={data.bonusValueTicket}
              onChange={(v) => update({ bonusValueTicket: toNum(v) })}
              prefix="R$"
            />
            <p className="mt-2 text-xs text-emerald-700/80">
              Progresso: <b>{calculations.ticketPct.toFixed(1)}%</b> {calculations.ticketDone ? '✅' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Meta 03 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
        <h3 className="text-base font-bold text-gray-900">
          Meta 03: Faturamento Bruto (Escalonado)
        </h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Faturamento Atual"
            value={data.currentRevenue}
            onChange={(v) => update({ currentRevenue: toNum(v) })}
            prefix="R$"
          />
          <Field
            label="Equipe (qtd pessoas)"
            value={data.teamSize}
            onChange={(v) => update({ teamSize: Math.max(1, Math.floor(toNum(v))) })}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field
              label="Meta Nível 1 (Bronze)"
              value={data.targetRevenueTier1}
              onChange={(v) => update({ targetRevenueTier1: toNum(v) })}
              prefix="R$"
            />
            <Field
              label="Meta Nível 2 (Prata)"
              value={data.targetRevenueTier2}
              onChange={(v) => update({ targetRevenueTier2: toNum(v) })}
              prefix="R$"
            />
            <Field
              label="Meta Nível 3 (Ouro)"
              value={data.targetRevenueTier3}
              onChange={(v) => update({ targetRevenueTier3: toNum(v) })}
              prefix="R$"
            />
          </div>

          <div className="space-y-4">
            <Field
              label="Bônus Nível 1"
              value={data.bonusValueRevenueT1}
              onChange={(v) => update({ bonusValueRevenueT1: toNum(v) })}
              prefix="R$"
            />
            <Field
              label="Bônus Nível 2"
              value={data.bonusValueRevenueT2}
              onChange={(v) => update({ bonusValueRevenueT2: toNum(v) })}
              prefix="R$"
            />
            <Field
              label="Bônus Nível 3"
              value={data.bonusValueRevenueT3}
              onChange={(v) => update({ bonusValueRevenueT3: toNum(v) })}
              prefix="R$"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Nível atingido: <b>{calculations.revenueTierAchieved}</b> • Próximo gap:{' '}
          <b>R$ {calculations.gapRevenueToNextTier.toFixed(2)}</b>
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <button
          onClick={resetDefaults}
          className="w-full md:w-auto rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Restaurar Padrões
        </button>

        <div className="w-full md:w-auto rounded-lg bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white">
          ✅ As alterações já ficam gravadas e o dashboard recalcula automaticamente
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
