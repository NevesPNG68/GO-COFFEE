import React, { useMemo, useState } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { RotateCcw, Save } from 'lucide-react';

type MetricsData = {
  currentMonth: string;
  daysRemaining: number;
  teamSize: number;

  currentSales: number;
  targetSales: number;
  bonusValueSales: number;

  currentTicket: number;
  targetTicket: number;
  bonusValueTicket: number;

  currentRevenue: number;

  targetRevenueTier1: number;
  targetRevenueTier2: number;
  targetRevenueTier3: number;

  bonusTier1: number;
  bonusTier2: number;
  bonusTier3: number;
};

const DEFAULTS: MetricsData = {
  currentMonth: 'FEVEREIRO 2026',
  daysRemaining: 18,
  teamSize: 2,

  currentSales: 328,
  targetSales: 1200,
  bonusValueSales: 150,

  currentTicket: 29.7,
  targetTicket: 29.5,
  bonusValueTicket: 250,

  currentRevenue: 9700,

  targetRevenueTier1: 35000,
  targetRevenueTier2: 36000,
  targetRevenueTier3: 40000,

  bonusTier1: 100,
  bonusTier2: 200,
  bonusTier3: 300,
};

function num(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const Field: React.FC<{
  label: string;
  value: number | string;
  onChange: (v: string) => void;
  type?: 'text' | 'number';
}> = ({ label, value, onChange, type = 'number' }) => (
  <div>
    <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
    />
  </div>
);

const UpdateForm: React.FC = () => {
  // ⚠️ blindagem: não assumo o tipo exato do contexto (evita quebrar por refactor)
  const ctx = useMetrics() as any;

  // O mínimo que precisamos:
  const data: MetricsData = (ctx?.data ?? DEFAULTS) as MetricsData;

  // setData pode ter nomes diferentes dependendo da versão:
  const setData: (next: MetricsData) => void =
    ctx?.setData ?? ctx?.setMetrics ?? ctx?.updateData ?? ctx?.setMetricsData;

  // alguns contexts têm save() / persist()
  const saveFn: (() => void) | undefined = ctx?.save ?? ctx?.persist ?? ctx?.commit;

  const [local, setLocal] = useState<MetricsData>(() => ({
    ...DEFAULTS,
    ...data,
  }));

  // se o usuário entrar no UpdateForm depois de mudar algo, manter local coerente
  useMemo(() => {
    setLocal((prev) => ({ ...prev, ...data }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const apply = () => {
    if (typeof setData !== 'function') {
      alert('Não encontrei a função de atualizar dados no contexto (setData).');
      return;
    }
    setData(local); // ✅ SEM prev => (corrige o erro do build)
    if (typeof saveFn === 'function') saveFn();
    alert('Configurações salvas!');
  };

  const restore = () => {
    setLocal(DEFAULTS);
    if (typeof setData === 'function') setData(DEFAULTS);
    if (typeof saveFn === 'function') saveFn();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Atualizar Dados</h2>
          <p className="text-sm text-gray-500 mt-1">
            Altere os valores e clique em <span className="font-semibold">Salvar Configurações</span>.
          </p>
        </div>

        <button
          onClick={restore}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          title="Restaurar Padrões"
        >
          <RotateCcw size={16} />
          Restaurar
        </button>
      </div>

      {/* Top fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <Field
          label="Mês (rótulo)"
          value={local.currentMonth}
          type="text"
          onChange={(v) => setLocal({ ...local, currentMonth: v })}
        />
        <Field
          label="Dias restantes"
          value={local.daysRemaining}
          onChange={(v) => setLocal({ ...local, daysRemaining: num(v) })}
        />
        <Field
          label="Equipe (qtd pessoas)"
          value={local.teamSize}
          onChange={(v) => setLocal({ ...local, teamSize: num(v) })}
        />
      </div>

      {/* Meta 01 / 02 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <div className="text-lg font-bold text-orange-600">Meta 01: Volume de Vendas</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Realizado"
              value={local.currentSales}
              onChange={(v) => setLocal({ ...local, currentSales: num(v) })}
            />
            <Field
              label="Meta (Qtd)"
              value={local.targetSales}
              onChange={(v) => setLocal({ ...local, targetSales: num(v) })}
            />
            <div className="sm:col-span-2">
              <Field
                label="Valor do bônus (se atingido)"
                value={local.bonusValueSales}
                onChange={(v) => setLocal({ ...local, bonusValueSales: num(v) })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="text-lg font-bold text-green-700">Meta 02: Ticket Médio</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Atual"
              value={local.currentTicket}
              onChange={(v) => setLocal({ ...local, currentTicket: num(v) })}
            />
            <Field
              label="Meta"
              value={local.targetTicket}
              onChange={(v) => setLocal({ ...local, targetTicket: num(v) })}
            />
            <div className="sm:col-span-2">
              <Field
                label="Valor do bônus (se atingido)"
                value={local.bonusValueTicket}
                onChange={(v) => setLocal({ ...local, bonusValueTicket: num(v) })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meta 03 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="text-lg font-bold text-gray-900">Meta 03: Faturamento Bruto (Escalonado)</div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field
              label="Faturamento atual"
              value={local.currentRevenue}
              onChange={(v) => setLocal({ ...local, currentRevenue: num(v) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Meta Nível 1"
              value={local.targetRevenueTier1}
              onChange={(v) => setLocal({ ...local, targetRevenueTier1: num(v) })}
            />
            <Field
              label="Bônus Nível 1"
              value={local.bonusTier1}
              onChange={(v) => setLocal({ ...local, bonusTier1: num(v) })}
            />

            <Field
              label="Meta Nível 2"
              value={local.targetRevenueTier2}
              onChange={(v) => setLocal({ ...local, targetRevenueTier2: num(v) })}
            />
            <Field
              label="Bônus Nível 2"
              value={local.bonusTier2}
              onChange={(v) => setLocal({ ...local, bonusTier2: num(v) })}
            />

            <Field
              label="Meta Nível 3"
              value={local.targetRevenueTier3}
              onChange={(v) => setLocal({ ...local, targetRevenueTier3: num(v) })}
            />
            <Field
              label="Bônus Nível 3"
              value={local.bonusTier3}
              onChange={(v) => setLocal({ ...local, bonusTier3: num(v) })}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={apply}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-white font-bold hover:opacity-95"
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
