import React from 'react';
import { useMetrics } from '../context/MetricsContext';
import SalesChart from '../components/SalesChart';
import {
  TrendingUp,
  Target,
  Lock,
  Unlock,
  DollarSign,
  Users,
  AlertCircle,
  Trophy,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, calculations } = useMetrics();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const remainingSales = Math.max(0, data.targetSales - data.currentSales);

  // Calculate daily needed
  const salesNeededPerDay =
    data.daysRemaining > 0 ? Math.ceil(remainingSales / data.daysRemaining) : remainingSales;

  const revenueNeededPerDay =
    data.daysRemaining > 0
      ? (data.targetRevenueTier3 - data.currentRevenue) / data.daysRemaining
      : 0;

  const renderRevenueProgress = (tierLabel: string, target: number, reward: number, current: number) => {
    const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
    const isHit = current >= target;

    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-end mb-1">
          <div>
            <span className="text-xs font-bold text-gray-600 block">{tierLabel}</span>
            <span className="text-[10px] text-gray-400">Meta: {formatCurrency(target)}</span>
          </div>
          <div className="text-right">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isHit ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              Prêmio: {formatCurrency(reward)}
            </span>
          </div>
        </div>

        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isHit ? 'bg-brand-orange' : 'bg-gray-300'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* ✅ TESTE VISUAL (para confirmar que este arquivo é o que está sendo carregado) */}
      <div className="rounded-xl border-2 border-yellow-400 bg-yellow-200 text-black p-3 font-extrabold text-center">
        TESTE DASHBOARD 123 — SE VOCÊ ESTÁ VENDO ISSO, ESTE ARQUIVO É O ATIVO ✅
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-black to-gray-800 rounded-2xl p-5 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-brand-orange px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                {data.currentMonth}
              </span>

              <div className="flex items-center gap-1 border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
                <span className="font-bold text-white text-[10px]">go</span>
                <span className="text-[10px] text-white">coffee</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight">
              Rumo ao <span className="text-brand-orange">Sucesso!</span>
            </h1>

            <p className="mt-2 text-gray-300 max-w-lg text-sm md:text-base">
              Acompanhe suas métricas e conquiste o bônus máximo.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {/* Box 1: Earned */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-full md:min-w-[280px]">
              <p className="text-gray-300 text-xs md:text-sm font-medium mb-1">
                Bônus Individual Conquistado
              </p>
              <div className="text-3xl md:text-4xl font-bold text-brand-green flex items-center gap-1">
                {formatCurrency(calculations.totalIndividual)}
              </div>
            </div>

            {/* Box 2: Potential */}
            <div className="bg-brand-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 w-full md:min-w-[280px] flex justify-between items-center">
              <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
                Potencial Máximo
              </span>
              <span className="text-lg font-bold text-brand-orange">
                {formatCurrency(calculations.maxPotentialIndividual)}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-20 -top-40 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* META 1: VOLUME */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 flex flex-col relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide">
                Meta 01
              </p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Volume de Vendas</h2>
            </div>
            <div className="p-2 bg-orange-100 text-brand-orange rounded-lg">
              <TrendingUp size={20} className="md:w-6 md:h-6" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center">
            <SalesChart current={data.currentSales} target={data.targetSales} />

            <div className="w-full flex justify-between items-end mt-4 border-t pt-4">
              <div>
                <p className="text-[10px] md:text-xs text-gray-500">Realizado</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{data.currentSales}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] md:text-xs text-gray-500">Meta</p>
                <p className="text-xl md:text-2xl font-bold text-gray-400">/ {data.targetSales}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="bg-orange-50 p-3 rounded-lg flex-1 flex justify-center items-center gap-2">
              <span className="text-xs font-medium text-gray-700">Faltam:</span>
              <span className="text-lg font-bold text-brand-orange">{remainingSales}</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-yellow-700 flex items-center gap-1">
                <Trophy size={12} /> Prêmio
              </span>
              <span className="text-sm font-bold text-gray-800">
                {formatCurrency(data.bonusValueSales)}
              </span>
            </div>
          </div>
        </div>

        {/* META 2: TICKET MEDIO */}
        <div
          className={`rounded-2xl shadow-lg border p-5 md:p-6 flex flex-col relative overflow-hidden ${
            calculations.isTicketLocked ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'
          }`}
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide">
                Meta 02
              </p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Ticket Médio</h2>
            </div>
            <div
              className={`p-2 rounded-lg ${
                calculations.isTicketLocked ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-brand-green'
              }`}
            >
              {calculations.isTicketLocked ? (
                <Lock size={20} className="md:w-6 md:h-6" />
              ) : (
                <Unlock size={20} className="md:w-6 md:h-6" />
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center relative z-10">
            <div
              className={`text-5xl md:text-6xl font-black mb-2 ${
                data.currentTicket >= data.targetTicket ? 'text-brand-green' : 'text-gray-800'
              }`}
            >
              {data.currentTicket
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                .replace('R$', '')}
            </div>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              Meta: {formatCurrency(data.targetTicket)}
            </p>

            <div className="mt-4 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase mr-2">Valor do Prêmio:</span>
              <span className="text-sm font-black text-green-700">
                {formatCurrency(data.bonusValueTicket)}
              </span>
            </div>
          </div>

          {calculations.isTicketLocked && (
            <div className="mt-6 bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-3 relative z-10">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-[10px] md:text-xs text-red-600 font-medium leading-snug">
                Trava de Segurança: Alcance 1.200 vendas para liberar este bônus.
              </p>
            </div>
          )}
        </div>

        {/* META 3: FATURAMENTO */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide">
                Meta 03
              </p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Faturamento</h2>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <DollarSign size={20} className="md:w-6 md:h-6" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start space-y-4">
            <div className="text-center mb-2">
              <p className="text-gray-400 text-[10px] md:text-sm font-medium mb-1">Acumulado</p>
              <h3 className="text-3xl md:text-4xl font-black text-gray-800">
                {formatCurrency(data.currentRevenue)}
              </h3>
            </div>

            <div className="space-y-1">
              {renderRevenueProgress(
                'Nível 1 (Bronze)',
                data.targetRevenueTier1,
                data.bonusValueRevenueT1,
                data.currentRevenue
              )}
              {renderRevenueProgress(
                'Nível 2 (Prata)',
                data.targetRevenueTier2,
                data.bonusValueRevenueT2,
                data.currentRevenue
              )}
              {renderRevenueProgress(
                'Nível 3 (Ouro)',
                data.targetRevenueTier3,
                data.bonusValueRevenueT3,
                data.currentRevenue
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flight Plan / Daily Targets */}
      <div className="bg-brand-black text-white rounded-2xl p-5 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8">
          <div>
            <p className="text-brand-orange font-bold text-xs md:text-sm tracking-wider uppercase mb-1">
              Plano de Voo
            </p>
            <h2 className="text-2xl md:text-3xl font-black">Meta Diária</h2>
            <p className="text-gray-400 text-xs md:text-sm mt-2">
              Baseado em {data.daysRemaining} dias restantes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-brand-orange" size={20} />
              <span className="text-gray-300 font-medium text-sm">Vendas por Dia</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">
              {Math.max(0, salesNeededPerDay)}{' '}
              <span className="text-xs md:text-sm font-normal text-gray-400">vendas</span>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-brand-orange" size={20} />
              <span className="text-gray-300 font-medium text-sm">Faturamento/Dia</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">
              {formatCurrency(Math.max(0, revenueNeededPerDay))}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-brand-orange" size={20} />
              <span className="text-gray-300 font-medium text-sm">Ticket Médio</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-brand-green">
              Manter {formatCurrency(data.currentTicket)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
