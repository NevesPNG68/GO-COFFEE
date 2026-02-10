import React, { useMemo } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

function moneyBR(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function pct(a: number, b: number) {
  if (!b || b <= 0) return 0;
  const p = (a / b) * 100;
  return Math.max(0, p);
}

function clampPct(v: number) {
  return Math.min(100, Math.max(0, v));
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const p = clampPct(value);
  return (
    <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
      <div className="h-full bg-brand-orange" style={{ width: `${p}%` }} />
    </div>
  );
};

const Card: React.FC<{ title: string; tone?: 'orange' | 'green' | 'white'; children: React.ReactNode }> = ({
  title,
  tone = 'white',
  children,
}) => {
  const wrap =
    tone === 'orange'
      ? 'bg-orange-50 border-orange-100'
      : tone === 'green'
      ? 'bg-green-50 border-green-100'
      : 'bg-white border-gray-200';

  const titleColor =
    tone === 'orange' ? 'text-orange-600' : tone === 'green' ? 'text-green-700' : 'text-gray-900';

  return (
    <div className={`rounded-2xl border p-5 ${wrap}`}>
      <div className={`text-lg font-bold ${titleColor}`}>{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { data } = useMetrics();

  const {
    currentMonth,
    daysRemaining,
    teamSize,

    currentSales,
    targetSales,
    bonusValueSales,

    currentTicket,
    targetTicket,
    bonusValueTicket,

    currentRevenue,

    targetRevenueTier1,
    targetRevenueTier2,
    targetRevenueTier3,

    bonusTier1,
    bonusTier2,
    bonusTier3,
  } = data;

  // ===== Cálculos (tudo aqui dentro, sem "calculations") =====
  const salesPct = useMemo(() => pct(currentSales, targetSales), [currentSales, targetSales]);
  const ticketPct = useMemo(() => pct(currentTicket, targetTicket), [currentTicket, targetTicket]);

  const revenuePctT1 = useMemo(() => pct(currentRevenue, targetRevenueTier1), [currentRevenue, targetRevenueTier1]);
  const revenuePctT2 = useMemo(() => pct(currentRevenue, targetRevenueTier2), [currentRevenue, targetRevenueTier2]);
  const revenuePctT3 = useMemo(() => pct(currentRevenue, targetRevenueTier3), [currentRevenue, targetRevenueTier3]);

  const salesHit = targetSales > 0 && currentSales >= targetSales;
  const ticketHit = targetTicket > 0 && currentTicket >= targetTicket;

  const achievedTier = useMemo(() => {
    // maior tier atingido
    if (targetRevenueTier3 > 0 && currentRevenue >= targetRevenueTier3) return 3;
    if (targetRevenueTier2 > 0 && currentRevenue >= targetRevenueTier2) return 2;
    if (targetRevenueTier1 > 0 && currentRevenue >= targetRevenueTier1) return 1;
    return 0;
  }, [currentRevenue, targetRevenueTier1, targetRevenueTier2, targetRevenueTier3]);

  const tierBonusPerPerson = useMemo(() => {
    if (achievedTier === 3) return bonusTier3 || 0;
    if (achievedTier === 2) return bonusTier2 || 0;
    if (achievedTier === 1) return bonusTier1 || 0;
    return 0;
  }, [achievedTier, bonusTier1, bonusTier2, bonusTier3]);

  const team = Math.max(1, Number(teamSize) || 1);

  const bonusSalesEarned = salesHit ? Number(bonusValueSales) || 0 : 0;
  const bonusTicketEarned = ticketHit ? Number(bonusValueTicket) || 0 : 0;
  const bonusRevenueTotal = tierBonusPerPerson * team;

  const totalBonus = bonusSalesEarned + bonusTicketEarned + bonusRevenueTotal;

  const statusMsg = useMemo(() => {
    const parts: string[] = [];
    if (!salesHit) parts.push('Meta de Volume ainda não atingida.');
    else parts.push('Volume atingido.');

    if (!ticketHit) parts.push('Ticket abaixo da meta.');
    else parts.push('Ticket atingido.');

    if (achievedTier === 0) parts.push('Faturamento ainda não bateu nenhum nível.');
    else parts.push(`Faturamento atingiu Nível ${achievedTier}.`);

    return parts.join(' ');
  }, [salesHit, ticketHit, achievedTier]);

  return (
    <div className="space-y-6">
      {/* Top line */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-green-700">{currentMonth}</span>
            {typeof daysRemaining === 'number' ? (
              <>
                {' '}
                • <span className="font-semibold text-green-700">{daysRemaining}</span> dias restantes
              </>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
          <div className="text-xs font-semibold text-gray-500">Bônus total (se condições atingidas)</div>
          <div className="text-xl font-extrabold text-gray-900">{moneyBR(totalBonus)}</div>
          <div className="text-xs text-gray-500 mt-1">
            (Faturamento escalonado considera equipe: <span className="font-semibold">{team}</span>)
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 flex gap-3 items-start">
        <div className="mt-0.5">
          {totalBonus > 0 ? (
            <CheckCircle2 className="text-green-600" size={20} />
          ) : (
            <AlertTriangle className="text-orange-500" size={20} />
          )}
        </div>
        <div>
          <div className="font-bold text-gray-900">Status Geral</div>
          <div className="text-sm text-gray-600 mt-1">{statusMsg}</div>
        </div>
      </div>

      {/* Meta 01 + 02 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Meta 01: Volume de Vendas" tone="orange">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500">Realizado</div>
              <div className="text-2xl font-extrabold text-gray-900">{currentSales}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500">Meta (Qtd)</div>
              <div className="text-2xl font-extrabold text-gray-900">{targetSales}</div>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar value={salesPct} />
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-bold text-brand-orange">{salesPct.toFixed(1)}%</span> do objetivo
              {salesHit ? (
                <span className="ml-2 text-green-700 font-semibold">• Bônus: {moneyBR(bonusSalesEarned)}</span>
              ) : (
                <span className="ml-2 text-gray-500">• Bônus: {moneyBR(0)}</span>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-700">
            <span className="font-semibold">Bônus se atingir:</span> {moneyBR(Number(bonusValueSales) || 0)}
          </div>
        </Card>

        <Card title="Meta 02: Ticket Médio" tone="green">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500">Atual</div>
              <div className="text-2xl font-extrabold text-gray-900">{moneyBR(Number(currentTicket) || 0)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500">Meta</div>
              <div className="text-2xl font-extrabold text-gray-900">{moneyBR(Number(targetTicket) || 0)}</div>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar value={ticketPct} />
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-bold text-brand-orange">{ticketPct.toFixed(1)}%</span> do objetivo
              {ticketHit ? (
                <span className="ml-2 text-green-700 font-semibold">• Bônus: {moneyBR(bonusTicketEarned)}</span>
              ) : (
                <span className="ml-2 text-gray-500">• Bônus: {moneyBR(0)}</span>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-700">
            <span className="font-semibold">Bônus se atingir:</span> {moneyBR(Number(bonusValueTicket) || 0)}
          </div>
        </Card>
      </div>

      {/* Meta 03 */}
      <Card title="Meta 03: Faturamento Bruto (Escalonado)">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold text-gray-500">Faturamento atual</div>
            <div className="text-3xl font-extrabold text-gray-900">{moneyBR(Number(currentRevenue) || 0)}</div>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp size={18} className="text-brand-orange" />
              <span>
                Nível atingido:{' '}
                <span className="font-bold text-gray-900">{achievedTier === 0 ? 'Nenhum' : `Nível ${achievedTier}`}</span>
                {' '}• Bônus por pessoa: <span className="font-bold">{moneyBR(tierBonusPerPerson)}</span>
                {' '}• Total equipe: <span className="font-bold">{moneyBR(bonusRevenueTotal)}</span>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-bold text-gray-900 mb-3">Progresso por nível</div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Meta Nível 1</span>
                  <span className="font-semibold">{moneyBR(Number(targetRevenueTier1) || 0)} • {revenuePctT1.toFixed(1)}%</span>
                </div>
                <ProgressBar value={revenuePctT1} />
                <div className="mt-1 text-xs text-gray-500">Bônus: {moneyBR(Number(bonusTier1) || 0)}</div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Meta Nível 2</span>
                  <span className="font-semibold">{moneyBR(Number(targetRevenueTier2) || 0)} • {revenuePctT2.toFixed(1)}%</span>
                </div>
                <ProgressBar value={revenuePctT2} />
                <div className="mt-1 text-xs text-gray-500">Bônus: {moneyBR(Number(bonusTier2) || 0)}</div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Meta Nível 3</span>
                  <span className="font-semibold">{moneyBR(Number(targetRevenueTier3) || 0)} • {revenuePctT3.toFixed(1)}%</span>
                </div>
                <ProgressBar value={revenuePctT3} />
                <div className="mt-1 text-xs text-gray-500">Bônus: {moneyBR(Number(bonusTier3) || 0)}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
