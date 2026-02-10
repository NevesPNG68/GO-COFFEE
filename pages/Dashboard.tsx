import React from 'react';
import { useMetrics } from '../context/MetricsContext';

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-3">
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div className="h-2 rounded-full bg-orange-500" style={{ width: `${v}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{pct(v)}</span>
        <span>Concluído</span>
      </div>
    </div>
  );
}

const Dashboard: React.FC = () => {
  const { data, calculations } = useMetrics();

  const revenueTierLabel =
    calculations.revenueTierAchieved === 0
      ? 'Nenhum nível'
      : calculations.revenueTierAchieved === 1
      ? 'Nível 1 (Bronze)'
      : calculations.revenueTierAchieved === 2
      ? 'Nível 2 (Prata)'
      : 'Nível 3 (Ouro)';

  return (
    <div className="space-y-6">
      {/* Header infos */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-gray-500">Mês</div>
            <div className="text-lg font-bold text-gray-900">{data.currentMonthLabel}</div>
          </div>

          <div className="flex gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500">Dia</div>
              <div className="text-lg font-bold text-gray-900">{data.dayOfMonth}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500">Equipe</div>
              <div className="text-lg font-bold text-gray-900">{data.teamSize}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Faturamento */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="text-sm font-semibold text-gray-600">Faturamento</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">{fmtBRL(data.currentRevenue)}</div>
          <div className="mt-1 text-xs text-gray-500">
            Próximo nível: {fmtBRL(calculations.gapRevenueToNextTier)} para bater
          </div>
          <ProgressBar value={calculations.revenuePct} />
        </div>

        {/* Volume Vendas */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="text-sm font-semibold text-gray-600">Volume de Vendas</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">{data.currentSales}</div>
          <div className="mt-1 text-xs text-gray-500">Meta: {data.targetSales}</div>
          <ProgressBar value={calculations.salesPct} />
        </div>

        {/* Ticket */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="text-sm font-semibold text-gray-600">Ticket Médio</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">{fmtBRL(data.currentTicket)}</div>
          <div className="mt-1 text-xs text-gray-500">Meta: {fmtBRL(data.targetTicket)}</div>
          <ProgressBar value={calculations.ticketPct} />
        </div>

        {/* Bônus */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="text-sm font-semibold text-gray-600">Bônus</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">
            {fmtBRL(calculations.totalBonusTeam)}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Individual: <b>{fmtBRL(calculations.totalBonusIndividual)}</b>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            Faturamento: <b>{revenueTierLabel}</b>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Volume: <b>{calculations.salesDone ? '✅' : '—'}</b> • Ticket: <b>{calculations.ticketDone ? '✅' : '—'}</b>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
        <h3 className="text-base font-bold text-gray-900">Resumo</h3>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500">Falta (Vendas)</div>
            <div className="mt-1 text-lg font-extrabold text-gray-900">{calculations.gapSales}</div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500">Gap Ticket</div>
            <div className="mt-1 text-lg font-extrabold text-gray-900">
              {fmtBRL(calculations.gapTicket)}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500">Próximo nível faturamento</div>
            <div className="mt-1 text-lg font-extrabold text-gray-900">
              {fmtBRL(calculations.gapRevenueToNextTier)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
