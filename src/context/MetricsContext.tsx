import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';

export type MetricsData = {
  // header
  currentMonth: string;       // ex: "FEVEREIRO 2026"
  dayOfMonth: number;         // ex: 10
  teamSize: number;           // ex: 3
  daysRemaining: number;      // ex: 19

  // metas
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
  totalIndividual: number;
  maxPotentialIndividual: number;
};

type MetricsContextValue = {
  data: MetricsData;
  calculations: MetricsCalculations;
  updateData: (patch: Partial<MetricsData>) => void;
  setAllData: (next: MetricsData) => void;
  reset: () => void;
};

const STORAGE_KEY = 'go-coffee-metrics-v1';

const DEFAULT_DATA: MetricsData = {
  currentMonth: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
  dayOfMonth: Number(new Date().toLocaleDateString('pt-BR', { day: '2-digit' })),
  teamSize: 3,
  daysRemaining: 20,

  currentSales: 682,
  targetSales: 3000,
  bonusValueSales: 200,

  currentTicket: 29.23,
  targetTicket: 32,
  bonusValueTicket: 200,

  currentRevenue: 69634.24,
  targetRevenueTier1: 35000,
  targetRevenueTier2: 36000,
  targetRevenueTier3: 40000,

  bonusValueRevenueT1: 200,
  bonusValueRevenueT2: 250,
  bonusValueRevenueT3: 300,
};

const MetricsContext = createContext<MetricsContextValue | null>(null);

function safeNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function loadFromStorage(): MetricsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);

    // merge seguro com defaults
    const merged: MetricsData = { ...DEFAULT_DATA, ...(parsed as Partial<MetricsData>) };

    // garante tipos numéricos
    return {
      ...merged,
      dayOfMonth: safeNumber(merged.dayOfMonth, DEFAULT_DATA.dayOfMonth),
      teamSize: safeNumber(merged.teamSize, DEFAULT_DATA.teamSize),
      daysRemaining: safeNumber(merged.daysRemaining, DEFAULT_DATA.daysRemaining),

      currentSales: safeNumber(merged.currentSales),
      targetSales: safeNumber(merged.targetSales),
      bonusValueSales: safeNumber(merged.bonusValueSales),

      currentTicket: safeNumber(merged.currentTicket),
      targetTicket: safeNumber(merged.targetTicket),
      bonusValueTicket: safeNumber(merged.bonusValueTicket),

      currentRevenue: safeNumber(merged.currentRevenue),
      targetRevenueTier1: safeNumber(merged.targetRevenueTier1),
      targetRevenueTier2: safeNumber(merged.targetRevenueTier2),
      targetRevenueTier3: safeNumber(merged.targetRevenueTier3),

      bonusValueRevenueT1: safeNumber(merged.bonusValueRevenueT1),
      bonusValueRevenueT2: safeNumber(merged.bonusValueRevenueT2),
      bonusValueRevenueT3: safeNumber(merged.bonusValueRevenueT3),
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MetricsData>(() => loadFromStorage());

  // grava sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // não quebra o app
    }
  }, [data]);

  const calculations = useMemo<MetricsCalculations>(() => {
    // trava do ticket: libera ao atingir 1200 vendas (padrão que você estava usando)
    const isTicketLocked = data.currentSales < 1200;

    // meta volume
    const salesDone = data.currentSales >= data.targetSales;

    // meta ticket (só vale se destravar)
    const ticketDone = !isTicketLocked && data.currentTicket >= data.targetTicket;

    // meta faturamento (pega SOMENTE o maior nível atingido)
    let revenueBonus = 0;
    if (data.currentRevenue >= data.targetRevenueTier3) revenueBonus = data.bonusValueRevenueT3;
    else if (data.currentRevenue >= data.targetRevenueTier2) revenueBonus = data.bonusValueRevenueT2;
    else if (data.currentRevenue >= data.targetRevenueTier1) revenueBonus = data.bonusValueRevenueT1;

    const totalIndividual =
      (salesDone ? data.bonusValueSales : 0) +
      (ticketDone ? data.bonusValueTicket : 0) +
      revenueBonus;

    // potencial máximo = vendas + ticket + nível 3 de faturamento
    const maxPotentialIndividual = data.bonusValueSales + data.bonusValueTicket + data.bonusValueRevenueT3;

    return { isTicketLocked, totalIndividual, maxPotentialIndividual };
  }, [data]);

  const updateData = (patch: Partial<MetricsData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const setAllData = (next: MetricsData) => setData(next);

  const reset = () => setData(DEFAULT_DATA);

  return (
    <MetricsContext.Provider value={{ data, calculations, updateData, setAllData, reset }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider');
  return ctx;
};
