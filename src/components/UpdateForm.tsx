import React, { useState } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { Save, RotateCcw } from 'lucide-react';

const UpdateForm: React.FC = () => {
  const { data, setData, resetDefaults } = useMetrics();

  // Inicializa o estado local apenas uma vez com os dados do contexto
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

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const toNum = (val: string) => {
      const n = parseFloat(val.replace(',', '.'));
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
      // O resetDefaults vai mudar o 'data' no contexto, mas para atualizar o form local:
      window.location.reload(); 
    }
  };

  const InputField = ({ label, field, type = "text" }: { label: string, field: keyof typeof form, type?: string }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold uppercase text-gray-500">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-brand-orange"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-gray-900">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField label="Mês" field="currentMonth" />
          <InputField label="Dia Atual" field="dayOfMonth" />
          <InputField label="Equipe (Qtd)" field="teamSize" />
          <InputField label="Dias Restantes" field="daysRemaining" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-4">
          <h2 className="text-lg font-black text-orange-900">Meta 01: Volume</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Realizado" field="currentSales" />
            <InputField label="Meta" field="targetSales" />
          </div>
          <InputField label="Valor do Bônus" field="bonusValueSales" />
        </div>

        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 space-y-4">
          <h2 className="text-lg font-black text-green-900">Meta 02: Ticket</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Atual" field="currentTicket" />
            <InputField label="Meta" field="targetTicket" />
          </div>
          <InputField label="Valor do Bônus" field="bonusValueTicket" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-gray-900">Meta 03: Faturamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <InputField label="Faturamento Atual" field="currentRevenue" />
            <InputField label="Meta Nível 1" field="targetRevenueTier1" />
            <InputField label="Meta Nível 2" field="targetRevenueTier2" />
            <InputField label="Meta Nível 3" field="targetRevenueTier3" />
          </div>
          <div className="space-y-4">
            <div className="h-[68px] hidden md:block" /> {/* Spacer */}
            <InputField label="Bônus Nível 1" field="bonusValueRevenueT1" />
            <InputField label="Bônus Nível 2" field="bonusValueRevenueT2" />
            <InputField label="Bônus Nível 3" field="bonusValueRevenueT3" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-end pt-4">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
        >
          <RotateCcw size={18} />
          Restaurar Padrões
        </button>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-orange text-white font-black shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default UpdateForm;
