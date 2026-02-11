import React, { createContext, useContext, useMemo, useState } from 'react';

export type MetricsData = {
  currentMonth: string;
  dayOfMonth: number;
  teamSize: number;
  daysRemaining: number;
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
  bonusValueRevenueT1: number;
  bonusValueRevenueT2: number;
  bonusValueRevenueT3: number;
};

export type MetricsCalculations = {
  isTicketLocked: boolean;
  totalTeam: number;
  totalIndividual: number;
  maxPotentialTeam: number;
  maxPotentialIndividual: number;
};

type MetricsContextValue = {
  data: MetricsData;
  calculations: MetricsCalculations;
  setData: (data: MetricsData) => void;
  save: () => void;
  resetDefaults: () => void;
};

const STORAGE_KEY = 'go-coffee-metrics-v1';

const DEFAULT_DATA: MetricsData = {
  currentMonth: 'Fevereiro 2026',
  dayOfMonth: 18,
  teamSize: 2,
  daysRemaining: 18,
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
  bonusValueRevenueT1: 100,
  bonusValueRevenueT2: 200,
  bonusValueRevenueT3: 300,
};

const MetricsContext = createContext<MetricsContextValue | null>(null);

function clampNonNeg(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, v);
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<MetricsData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;
      const parsed = JSON.parse(raw) as Partial<MetricsData> | null;
      return { ...DEFAULT_DATA, ...(parsed ?? {}) };
    } catch {
      return DEFAULT_DATA;
    }
  });

  // Função para atualizar dados e salvar imediatamente
  const setData = (newData: MetricsData) => {
    setDataState(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  };

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  };

  const resetDefaults = () => {
    setData(DEFAULT_DATA);
  };

  const calculations = useMemo<MetricsCalculations>(() => {
    const team = Math.max(1, clampNonNeg(data.teamSize));
    const salesDone = clampNonNeg(data.currentSales) >= clampNonNeg(data.targetSales) && data.targetSales > 0;
    const isTicketLocked = !salesDone;
    const ticketDone = clampNonNeg(data.currentTicket) >= clampNonNeg(data.targetTicket) && data.targetTicket > 0 && !isTicketLocked;

    const curRev = clampNonNeg(data.currentRevenue);
    const t1 = clampNonNeg(data.targetRevenueTier1);
    const t2 = clampNonNeg(data.targetRevenueTier2);
    const t3 = clampNonNeg(data.targetRevenueTier3);

    let revenueBonus = 0;
    if (t3 > 0 && curRev >= t3) revenueBonus = clampNonNeg(data.bonusValueRevenueT3);
    else if (t2 > 0 && curRev >= t2) revenueBonus = clampNonNeg(data.bonusValueRevenueT2);
    else if (t1 > 0 && curRev >= t1) revenueBonus = clampNonNeg(data.bonusValueRevenueT1);

    const teamBonus =
      (salesDone ? clampNonNeg(data.bonusValueSales) : 0) +
      (ticketDone ? clampNonNeg(data.bonusValueTicket) : 0) +
      revenueBonus;

    const maxRevenueBonus = Math.max(
      clampNonNeg(data.bonusValueRevenueT1),
      clampNonNeg(data.bonusValueRevenueT2),
      clampNonNeg(data.bonusValueRevenueT3),
    );

    const maxTeam =
      clampNonNeg(data.bonusValueSales) +
      clampNonNeg(data.bonusValueTicket) +
      maxRevenueBonus;

    return {
      isTicketLocked,
      totalTeam: teamBonus,
      totalIndividual: teamBonus / team,
      maxPotentialTeam: maxTeam,
      maxPotentialIndividual: maxTeam / team,
    };
  }, [data]);

  return (
    <MetricsContext.Provider value={{ data, calculations, setData, save, resetDefaults }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider');
  return ctx;
};
