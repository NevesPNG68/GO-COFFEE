import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MetricsContextValue, MetricsData, MetricsCalculations } from '../types';
import { DEFAULT_METRICS, STORAGE_KEY } from '../constants';

const MetricsContext = createContext<MetricsContextValue | null>(null);

const n = (v: any, fb = 0) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
};

function calc(data: MetricsData): MetricsCalculations {
  const teamSize = Math.max(1, n(data.teamSize, 1));

  const currentSales = n(data.currentSales);
  const targetSales = n(data.targetSales);
  const currentTicket = n(data.currentTicket);
  const targetTicket = n(data.targetTicket);

  const currentRevenue = n(data.currentRevenue);
  const t1 = n(data.targetRevenueTier1);
  const t2 = n(data.targetRevenueTier2);
  const t3 = n(data.targetRevenueTier3);

  const achievedSales = targetSales > 0 ? currentSales >= targetSales : false;
  const achievedTicket = targetTicket > 0 ? currentTicket >= targetTicket : false;

  let achievedRevenueTier: 0 | 1 | 2 | 3 = 0;
  if (t3 > 0 && currentRevenue >= t3) achievedRevenueTier = 3;
  else if (t2 > 0 && currentRevenue >= t2) achievedRevenueTier = 2;
  else if (t1 > 0 && currentRevenue >= t1) achievedRevenueTier = 1;

  const bonusSales = achievedSales ? n(data.bonusValueSales) : 0;
  const bonusTicket = achievedTicket ? n(data.bonusValueTicket) : 0;

  const bonusRevenue =
    achievedRevenueTier === 3 ? n(data.bonusTier3)
    : achievedRevenueTier === 2 ? n(data.bonusTier2)
    : achievedRevenueTier === 1 ? n(data.bonusTier1)
    : 0;

  const bonusIndividual = bonusSales + bonusTicket + bonusRevenue;
  const bonusTeam = bonusIndividual * teamSize;

  const pctSales = targetSales > 0 ? (currentSales / targetSales) * 100 : 0;
  const pctTicket = targetTicket > 0 ? (currentTicket / targetTicket) * 100 : 0;
  const ref = Math.max(t1, t2, t3);
  const pctRevenue = ref > 0 ? (currentRevenue / ref) * 100 : 0;

  return {
    achievedSales,
    achievedTicket,
    achievedRevenueTier,
    bonusIndividual,
    totalIndividual: bonusIndividual, // <- chave exigida pelo Dashboard
    bonusTeam,
    totalTeam: bonusTeam,
    pctSales,
    pctTicket,
    pctRevenue,
  };
}

function load(): MetricsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_METRICS;
    const parsed = JSON.parse(raw);
    const incoming = (parsed?.data ?? parsed) as Partial<MetricsData>;

    return { ...DEFAULT_METRICS, ...incoming };
  } catch {
    return DEFAULT_METRICS;
  }
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MetricsData>(() => load());

  const calculations = useMemo(() => calc(data), [data]);

  // grava sempre que alterar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data }));
    } catch {}
  }, [data]);

  const updateData = (patch: Partial<MetricsData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const reset = () => setData(DEFAULT_METRICS);

  return (
    <MetricsContext.Provider value={{ data, calculations, setData, updateData, reset }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider');
  return ctx;
};
