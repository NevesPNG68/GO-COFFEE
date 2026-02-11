import React, { useState, useCallback } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { Save, RotateCcw } from 'lucide-react';

const UpdateForm: React.FC = () => {
  const { data, setData, resetDefaults } = useMetrics();

  // Estado local inicializado apenas uma vez
  const [form, setForm] = useState({
    currentMonth: String(data.currentMonth || ''),
    dayOfMonth: String(data.dayOfMonth || ''),
    teamSize: String(data.teamSize || ''),
    daysRemaining: String(data.daysRemaining || ''),
    currentSales: String(data.currentSales || ''),
    targetSales: String(data.targetSales || ''),
    bonusValueSales: String(data.bonusValueSales || ''),
    currentTicket: String(data.currentTicket || ''),
    targetTicket: String(data.targetTicket || ''),
    bonusValueTicket: String(data.bonusValueTicket || ''),
    currentRevenue: String(data.currentRevenue || ''),
    targetRevenueTier1: String(data.targetRevenueTier1 || ''),
    targetRevenueTier2: String(data.targetRevenueTier2 || ''),
    targetRevenueTier3: String(data.targetRevenueTier3 || ''),
    bonusValueRevenueT1: String(data.bonusValueRevenueT1 || ''),
    bonusValueRevenueT2: String(data.bonusValueRevenueT2 || ''),
    bonusValueRevenueT3: String(data.bonusValueRevenueT3 || ''),
  });

  const handleChange = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = () => {
    const toNum = (val: string) => {
      const n = parseFloat(String(val).replace(',', '.'));
      return isNaN(n) ? 0 : n;
    };

    setData({
      currentMonth: form.currentMonth,
      dayOfMonth: Math.floor(toNum(form.dayOfMonth)),
      teamSize: Math.max(1, Math.floor(toNum(form.teamSize))),
      daysRemaining: Math.floor(toNum(form.daysRemaining)),
      currentSales: Math.floor(toNum(form.currentSales)),
      targetSales: Math.floor(toNum(form.targetSales)),
      bonusValueSales: toNum(form.bonusValueSales),
      currentTicket: toNum(form.currentTicket),
      targetTicket: toNum(form.targetTicket),
      bonusValueTicket: toNum(form.bonusValueTicket),
      currentRevenue: toNum(form.currentRevenue),
      targetRevenueTier1: toNum(form.targetRevenueTier1),
      targetRevenueTier2: toNum(form.targetRevenueTier2),
      targetRevenueTier3: toNum(form.targetRevenueTier3),
      bonusValueRevenueT1: toNum(form.bonusValueRevenueT1),
      bonusValueRevenueT2: toNum(form.bonusValueRevenueT2),
      bonusValueRevenueT3: toNum(form.bonusValueRevenueT3),
    });
    alert('Dados salvos com sucesso! ✅');
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar os valores padrão?')) {
      resetDefaults();
      window.location.reload(); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-gray-900">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">Mês</label>
            <input type="text" value={form.currentMonth} onChange={(e) => handleChange('currentMonth', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">Dia Atual</label>
            <input type="text" value={form.dayOfMonth} onChange={(e) => handleChange('dayOfMonth', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">Equipe (Qtd)</label>
            <input type="text" value={form.teamSize} onChange={(e) => handleChange('teamSize', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">Dias Restantes</label>
            <input type="text" value={form.daysRemaining} onChange={(e) => handleChange('daysRemaining', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-4">
          <h2 className="text-lg font-black text-orange-900">Meta 01: Volume</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Realizado</label>
              <input type="text" value={form.currentSales} onChange={(e) => handleChange('currentSales', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Meta</label>
              <input type="text" value={form.targetSales} onChange={(e) => handleChange('targetSales', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">Valor do Bônus</label>
            <input type="text" value={form.bonusValueSales} onChange={(e) => handleChange('bonusValueSales', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
          </div>
        </div>

        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 space-y-4">
          <h2 className="text-lg font-black text-green-900">Meta 02: Ticket</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Atual</label>
              <input type="text" value={form.currentTicket} onChange={(e) => handleChange('currentTicket', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Meta</label>
              <input type="text" value={form.targetTicket} onChange={(e) => handleChange('targetTicket', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">Valor do Bônus</label>
            <input type="text" value={form.bonusValueTicket} onChange={(e) => handleChange('bonusValueTicket', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-gray-900">Meta 03: Faturamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Faturamento Atual</label>
              <input type="text" value={form.currentRevenue} onChange={(e) => handleChange('currentRevenue', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Meta Nível 1</label>
              <input type="text" value={form.targetRevenueTier1} onChange={(e) => handleChange('targetRevenueTier1', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Meta Nível 2</label>
              <input type="text" value={form.targetRevenueTier2} onChange={(e) => handleChange('targetRevenueTier2', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Meta Nível 3</label>
              <input type="text" value={form.targetRevenueTier3} onChange={(e) => handleChange('targetRevenueTier3', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-[68px] hidden md:block" />
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Bônus Nível 1</label>
              <input type="text" value={form.bonusValueRevenueT1} onChange={(e) => handleChange('bonusValueRevenueT1', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Bônus Nível 2</label>
              <input type="text" value={form.bonusValueRevenueT2} onChange={(e) => handleChange('bonusValueRevenueT2', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">Bônus Nível 3</label>
              <input type="text" value={form.bonusValueRevenueT3} onChange={(e) => handleChange('bonusValueRevenueT3', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-end pt-4">
        <button onClick={handleReset} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition">
          <RotateCcw size={18} /> Restaurar Padrões
        </button>
        <button onClick={handleSave} className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-orange text-white font-black shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition">
          <Save size={18} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default UpdateForm;
