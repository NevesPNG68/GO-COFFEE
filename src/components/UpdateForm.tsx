import React, { useState, useEffect } from 'react';
import { useMetrics } from '../context/MetricsContext';
import { Save, RotateCcw, DollarSign, Calendar } from 'lucide-react';
import { INITIAL_DATA } from '../constants';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatQuantity = (value: number) => {
  return value.toLocaleString('pt-BR');
};

const UpdateForm: React.FC = () => {
  const { data, updateData } = useMetrics();
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    let val = e.target.value.replace(/\D/g, '');
    const numberVal = val ? parseFloat(val) / 100 : 0;
    setLocalData(prev => ({ ...prev, [field]: numberVal }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    let val = e.target.value.replace(/\D/g, '');
    const numberVal = val ? parseInt(val, 10) : 0;
    setLocalData(prev => ({ ...prev, [field]: numberVal }));
  };
  
  const handleGenericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(localData);
    alert('Dados atualizados com sucesso!');
  };

  const handleReset = () => {
    if(confirm('Tem certeza que deseja restaurar os valores padrão?')) {
        setLocalData(INITIAL_DATA);
        updateData(INITIAL_DATA);
    }
  };

  const baseInputClasses = "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition text-brand-lime font-bold text-lg bg-white placeholder-gray-300";
  const currencyInputClasses = `${baseInputClasses} pl-10`; 

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 max-w-4xl mx-auto border border-gray-100 mb-8">
      <div className="mb-6 md:mb-8 border-b pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Atualizar Métricas</h2>
        <p className="text-sm md:text-base text-gray-500">Configure as metas, mês de referência e os valores das bonificações.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Period Settings */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
               <Calendar size={20} className="text-gray-500"/>
               Configurações do Período
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mês de Referência</label>
                  <input
                    type="text"
                    name="currentMonth"
                    value={localData.currentMonth}
                    onChange={handleTextChange}
                    className={baseInputClasses}
                    placeholder="Ex: Fevereiro 2026"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dias Restantes</label>
                   <input
                    type="number"
                    name="daysRemaining"
                    value={localData.daysRemaining}
                    onChange={handleGenericChange}
                    className={baseInputClasses}
                  />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Sales Section */}
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h3 className="font-bold text-brand-orange mb-4 flex items-center gap-2 text-lg">
              Meta 01: Volume de Vendas
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Realizado</label>
                    <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0.000"
                    value={localData.currentSales === 0 ? '' : formatQuantity(localData.currentSales)}
                    onChange={(e) => handleQuantityChange(e, 'currentSales')}
                    className={baseInputClasses}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta (Qtd)</label>
                    <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0.000"
                    value={localData.targetSales === 0 ? '' : formatQuantity(localData.targetSales)}
                    onChange={(e) => handleQuantityChange(e, 'targetSales')}
                    className={baseInputClasses}
                    />
                </div>
              </div>
              
              <div className="pt-4 border-t border-orange-200">
                 <label className="block text-xs font-bold text-orange-800 uppercase mb-1 flex items-center gap-1">
                    <DollarSign size={12}/> Valor do Bônus (Se atingido)
                 </label>
                 <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="00,00"
                    value={localData.bonusValueSales === 0 ? '' : formatCurrency(localData.bonusValueSales)}
                    onChange={(e) => handleCurrencyChange(e, 'bonusValueSales')}
                    className={currencyInputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Section */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-lg">
              Meta 02: Ticket Médio
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Atual</label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none">R$</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="00,00"
                        value={localData.currentTicket === 0 ? '' : formatCurrency(localData.currentTicket)}
                        onChange={(e) => handleCurrencyChange(e, 'currentTicket')}
                        className={currencyInputClasses}
                    />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta</label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none">R$</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="00,00"
                        value={localData.targetTicket === 0 ? '' : formatCurrency(localData.targetTicket)}
                        onChange={(e) => handleCurrencyChange(e, 'targetTicket')}
                        className={currencyInputClasses}
                    />
                    </div>
                </div>
              </div>

              <div className="pt-4 border-t border-green-200">
                 <label className="block text-xs font-bold text-green-800 uppercase mb-1 flex items-center gap-1">
                    <DollarSign size={12}/> Valor do Bônus (Se atingido)
                 </label>
                 <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="00,00"
                    value={localData.bonusValueTicket === 0 ? '' : formatCurrency(localData.bonusValueTicket)}
                    onChange={(e) => handleCurrencyChange(e, 'bonusValueTicket')}
                    className={currencyInputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 md:col-span-2">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              Meta 03: Faturamento Bruto (Escalonado)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faturamento Atual</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none">R$</span>
                   <input
                    type="text"
                    inputMode="numeric"
                    placeholder="00,00"
                    value={localData.currentRevenue === 0 ? '' : formatCurrency(localData.currentRevenue)}
                    onChange={(e) => handleCurrencyChange(e, 'currentRevenue')}
                    className={currencyInputClasses}
                  />
                </div>
              </div>
               <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Equipe (Qtd Pessoas)</label>
                <input
                  type="number"
                  name="teamSize"
                  value={localData.teamSize}
                  onChange={handleGenericChange}
                  className={baseInputClasses}
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <p className="text-sm font-bold text-gray-700">Configuração dos Níveis</p>
                
                {/* Tier 1 */}
                <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Meta Nível 1 (Bronze)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatCurrency(localData.targetRevenueTier1)}
                            disabled
                            className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium" 
                        />
                    </div>
                     <div>
                        <label className="block text-xs text-gray-500 mb-1">Bônus Nível 1</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none text-xs">R$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={localData.bonusValueRevenueT1 === 0 ? '' : formatCurrency(localData.bonusValueRevenueT1)}
                                onChange={(e) => handleCurrencyChange(e, 'bonusValueRevenueT1')}
                                className={`${currencyInputClasses} py-1 text-sm`}
                            />
                        </div>
                    </div>
                </div>

                {/* Tier 2 */}
                <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Meta Nível 2 (Prata)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatCurrency(localData.targetRevenueTier2)}
                            disabled
                             className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium" 
                        />
                    </div>
                     <div>
                        <label className="block text-xs text-gray-500 mb-1">Bônus Nível 2</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none text-xs">R$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={localData.bonusValueRevenueT2 === 0 ? '' : formatCurrency(localData.bonusValueRevenueT2)}
                                onChange={(e) => handleCurrencyChange(e, 'bonusValueRevenueT2')}
                                className={`${currencyInputClasses} py-1 text-sm`}
                            />
                        </div>
                    </div>
                </div>

                 {/* Tier 3 */}
                 <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Meta Nível 3 (Ouro)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatCurrency(localData.targetRevenueTier3)}
                            disabled
                            className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium" 
                        />
                    </div>
                     <div>
                        <label className="block text-xs text-gray-500 mb-1">Bônus Nível 3</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime font-bold pointer-events-none text-xs">R$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={localData.bonusValueRevenueT3 === 0 ? '' : formatCurrency(localData.bonusValueRevenueT3)}
                                onChange={(e) => handleCurrencyChange(e, 'bonusValueRevenueT3')}
                                className={`${currencyInputClasses} py-1 text-sm`}
                            />
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white/90 backdrop-blur pb-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex justify-center items-center gap-2 px-6 py-3 md:py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition w-full md:w-auto border md:border-none border-gray-200"
          >
            <RotateCcw size={18} />
            Restaurar Padrões
          </button>
          <button
            type="submit"
            className="flex justify-center items-center gap-2 px-8 py-3 md:py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition transform hover:-translate-y-0.5 w-full md:w-auto font-bold"
          >
            <Save size={18} />
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
