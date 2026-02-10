import React, { useEffect, useMemo, useState } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { MetricsData } from '../types';

function toNumber(v: string) {
  // aceita "29,70" também
  const normalized = v.replace(/\./g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function formatInputNumber(n: number) {
  // mantém simples para input
  if (!Number.isFinite(n)) return '';
  return String(n);
}

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  right?: React.ReactNode;
}> = ({ label, value, onChange, right }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {right}
    </div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
    />
  </div>
);

const SectionCard: React.FC<{ title: string; tone?: 'orange' | 'green' | 'gray'; children: React.ReactNode }> = ({
  title,
  tone = 'gray',
  children,
}) => {
  const toneClass =
    tone === 'orange'
      ? 'bg-orange-50 border-orange-100'
      : tone === 'green'
      ? 'bg-green-50 border-green-100'
      : 'bg-white border-gray-200';

  const titleClass = tone === 'orange' ? 'text-orange-600' : tone === 'green' ? 'text-green-700' : 'text-gray-800';

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <h3 className={`text-lg font-bold ${titleClass}`}>{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
};

const UpdateForm: React.FC = () => {
  const { data, updateData, resetDefaults } = useMetrics();

  // Draft local (para só salvar quando clicar)
  const [draft, setDraft] = useState<MetricsData>(data);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  const setDraftField = (key: keyof MetricsData, value: string | number) => {
    setDraft((prev) => ({ ...prev, [key]: value } as MetricsData));
  };

  // Inputs (string) para evitar briga com vírgula/ponto
  const inputs = useMemo(() => {
    const d = draft;

    return {
      currentMonth: d.currentMonth ?? '',
      daysRemaining: formatInputNumber(d.daysRemaining ?? 0),
      teamSize: formatInputNumber(d.teamSize ?? 1),

      currentSales: formatInputNumber(d.currentSales ?? 0),
      targetSales: formatInputNumber(d.targetSales ?? 0),
      bonusValueSales: formatInputNumber(d.bonusValueSales ?? 0),

      currentTicket: formatInputNumber(d.currentTicket ?? 0),
      targetTicket: formatInputNumber(d.targetTicket ?? 0),
      bonusValueTicket: formatInputNumber(d.bonusValueTicket ?? 0),

      currentRevenue: formatInputNumber(d.currentRevenue ?? 0),

      targetRevenueTier1: formatInputNumber(d.targetRevenueTier1 ?? 0),
      targetRevenueTier2: formatInputNumber(d.targetRevenueTier2 ?? 0),
      targetRevenueTier3: formatInputNumber(d.targetRevenueTier3 ?? 0),

      bonusTier1: formatInputNumber(d.bonusTier1 ?? 0),
      bonusTier2: formatInputNumber(d.bonusTier2 ?? 0),
      bonusTier3: formatInputNumber(d.bonusTier3 ?? 0),
    };
  }, [draft]);

  const handleSave = () => {
    // Converte números antes de gravar
    updateData({
      currentMonth: inputs.currentMonth,
      daysRemaining: Math.max(0, Math.round(toNumber(inputs.daysRemaining))),
      teamSize: Math.max(1, Math.round(toNumber(inputs.teamSize))),

      currentSales: Math.max(0, Math.round(toNumber(inputs.currentSales))),
      targetSales: Math.max(0, Math.round(toNumber(inputs.targetSales))),
      bonusValueSales: Math.max(0, toNumber(inputs.bonusValueSales)),

      currentTicket: Math.max(0, toNumber(inputs.currentTicket)),
      targetTicket: Math.max(0, toNumber(inputs.targetTicket)),
      bonusValueTicket: Math.max(0, toNumber(inputs.bonusValueTicket)),

      currentRevenue: Math.max(0, toNumber(inputs.currentRevenue)),

      targetRevenueTier1: Math.max(0, toNumber(inputs.targetRevenueTier1)),
      targetRevenueTier2: Math.max(0, toNumber(inputs.targetRevenueTier2)),
      targetRevenueTier3: Math.max(0, toNumber(inputs.targetRevenueTier3)),

      bonusTier1: Math.max(0, toNumber(inputs.bonusTier1)),
      bonusTier2: Math.max(0, toNumber(inputs.bonusTier2)),
      bonusTier3: Math.max(0, toNumber(inputs.bonusTier3)),
    });
  };

  const handleRestore = () => {
    resetDefaults();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Atualizar Dados</h2>
          <p className="text-sm text-gray-500">Edite os valores e clique em “Salvar Configurações”.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestore}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            type="button"
          >
            Restaurar Padrões
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600"
            type="button"
          >
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Top fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard title="Mês" tone="gray">
          <Field
            label="Mês / Ano"
            value={inputs.currentMonth}
            onChange={(v) => setDraftField('currentMonth', v)}
          />
        </SectionCard>

        <SectionCard title="Dias restantes" tone="gray">
          <Field
            label="Dias"
            value={inputs.daysRemaining}
            onChange={(v) => setDraftField('daysRemaining', toNumber(v))}
          />
        </SectionCard>

        <SectionCard title="Equipe" tone="gray">
          <Field
            label="Qtd Pessoas"
            value={inputs.teamSize}
            onChange={(v) => setDraftField('teamSize', toNumber(v))}
          />
        </SectionCard>
      </div>

      {/* Meta 01 + Meta 02 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Meta 01: Volume de Vendas" tone="orange">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Realizado (Qtd)"
              value={inputs.currentSales}
              onChange={(v) => setDraftField('currentSales', toNumber(v))}
            />
            <Field
              label="Meta (Qtd)"
              value={inputs.targetSales}
              onChange={(v) => setDraftField('targetSales', toNumber(v))}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Valor do bônus (se atingido)"
              value={inputs.bonusValueSales}
              onChange={(v) => setDraftField('bonusValueSales', toNumber(v))}
            />
          </div>
        </SectionCard>

        <SectionCard title="Meta 02: Ticket Médio" tone="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Atual (R$)"
              value={inputs.currentTicket}
              onChange={(v) => setDraftField('currentTicket', toNumber(v))}
            />
            <Field
              label="Meta (R$)"
              value={inputs.targetTicket}
              onChange={(v) => setDraftField('targetTicket', toNumber(v))}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Valor do bônus (se atingido)"
              value={inputs.bonusValueTicket}
              onChange={(v) => setDraftField('bonusValueTicket', toNumber(v))}
            />
          </div>
        </SectionCard>
      </div>

      {/* Meta 03 */}
      <SectionCard title="Meta 03: Faturamento Bruto (Escalonado)" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Field
            label="Faturamento Atual (R$)"
            value={inputs.currentRevenue}
            onChange={(v) => setDraftField('currentRevenue', toNumber(v))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Equipe (Qtd Pessoas)"
              value={inputs.teamSize}
              onChange={(v) => setDraftField('teamSize', toNumber(v))}
            />
            <Field
              label="Dias restantes"
              value={inputs.daysRemaining}
              onChange={(v) => setDraftField('daysRemaining', toNumber(v))}
            />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-bold text-gray-800 mb-3">Configuração dos Níveis</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Meta Nível 1"
              value={inputs.targetRevenueTier1}
              onChange={(v) => setDraftField('targetRevenueTier1', toNumber(v))}
            />
            <Field
              label="Bônus Nível 1"
              value={inputs.bonusTier1}
              onChange={(v) => setDraftField('bonusTier1', toNumber(v))}
            />

            <Field
              label="Meta Nível 2"
              value={inputs.targetRevenueTier2}
              onChange={(v) => setDraftField('targetRevenueTier2', toNumber(v))}
            />
            <Field
              label="Bônus Nível 2"
              value={inputs.bonusTier2}
              onChange={(v) => setDraftField('bonusTier2', toNumber(v))}
            />

            <Field
              label="Meta Nível 3"
              value={inputs.targetRevenueTier3}
              onChange={(v) => setDraftField('targetRevenueTier3', toNumber(v))}
            />
            <Field
              label="Bônus Nível 3"
              value={inputs.bonusTier3}
              onChange={(v) => setDraftField('bonusTier3', toNumber(v))}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleRestore}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            type="button"
          >
            Restaurar Padrões
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600"
            type="button"
          >
            Salvar Configurações
          </button>
        </div>
      </SectionCard>
    </div>
  );
};

export default UpdateForm;
