import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MetricsCalculations, MetricsContextValue, MetricsData } from '../types';
import { DEFAULT_METRICS, STORAGE_KEY } from '../constants';

const MetricsContext = createContext<MetricsContextValue | null>(null);

function clampNumber(n: any, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function calc(data: MetricsData): MetricsCalculations {
  const teamSize = Math.max(1, clampNumber(data.teamSize, 1));

  const currentSales = clampNumber(data.currentSales, 0);
  const targetSales = clampNumber(data.targetSales, 0);

  const currentTicket = clampNumber(data.currentTicket, 0);
  const targetTicket = clampNumber(data.targetTicket, 0);

  const currentRevenue = clampNumber(data.currentRevenue, 0);
  const t1 = clampNumber(data.tier1?.target, 0);
  const t2 = clampNumber(data.tier2?.target, 0);
  const t3 = clampNumber(data.tier3?.target, 0);

  const pctSales = targetSales > 0 ? (currentSales / targetSales) * 100 : 0;
  const pctTicket = targetTicket > 0 ? (currentTicket / targetTicket) * 100 : 0;

  // Progresso do faturamento: usa a maior tier como "referência" (padrão do escalonado)
  const revenueRef = Math.max(t1, t2, t3);
  const pctRevenue = revenueRef > 0 ? (currentRevenue / revenueRef) * 100 : 0;

  const achievedSales = targetSales > 0 ? currentSales >= targetSales : false;
  const achievedTicket = targetTicket > 0 ? currentTicket >= targetTicket : false;

  let achievedRevenueTier: 0 | 1 | 2 | 3 = 0;
  if (t3 > 0 && currentRevenue >= t3) achievedRevenueTier = 3;
  else if (t2 > 0 && currentRevenue >= t2) achievedRevenueTier = 2;
  else if (t1 > 0 && currentRevenue >= t1) achievedRevenueTier = 1;

  const bonusSales = achievedSales ? clampNumber(data.bonusValueSales, 0) : 0;
  const bonusTicket = achievedTicket ? clampNumber(data.bonusValueTicket, 0) : 0;

  const bonusRevenue =
    achievedRevenueTier === 3 ? clampNumber(data.tier3?.bonus, 0)
    : achievedRevenueTier === 2 ? clampNumber(data.tier2?.bonus, 0)
    : achievedRevenueTier === 1 ? clampNumber(data.tier1?.bonus, 0)
    : 0;

  const bonusIndividual = bonusSales + bonusTicket + bonusRevenue;
  const bonusTeam = bonusIndividual * teamSize;

  return {
    pctSales,
    pctTicket,
    pctRevenue,
    achievedSales,
    achievedTicket,
    achievedRevenueTier,
    bonusIndividual,
    totalIndividual: bonusIndividual, // compat com o Dashboard
    bonusTeam,
    totalTeam: bonusTeam,
  };
}

function loadFromStorage(): MetricsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_METRICS;
    const parsed = JSON.parse(raw);

    // aceita formatos antigos: {data: ...} ou direto {...}
    const maybe = (parsed?.data ?? parsed) as Partial<MetricsData>;
    return {
      ...DEFAULT_METRICS,
      ...maybe,
      tier1: { ...DEFAULT_METRICS.tier1, ...(maybe.tier1 ?? {}) },
      tier2: { ...DEFAULT_METRICS.tier2, ...(maybe.tier2 ?? {}) },
      tier3: { ...DEFAULT_METRICS.tier3, ...(maybe.tier3 ?? {}) },
    };
  } catch {
    return DEFAULT_METRICS;
  }
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MetricsData>(() => loadFromStorage());

  const calculations = useMemo(() => calc(data), [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data }));
    } catch {
      // não quebra se storage falhar
    }
  }, [data]);

  const updateData = (patch: Partial<MetricsData>) => {
    setData((prev) => {
      const next: MetricsData = {
        ...prev,
        ...patch,
        tier1: { ...prev.tier1, ...(patch.tier1 ?? {}) },
        tier2: { ...prev.tier2, ...(patch.tier2 ?? {}) },
        tier3: { ...prev.tier3, ...(patch.tier3 ?? {}) },
      };
      return next;
    });
  };

  const reset = () => setData(DEFAULT_METRICS);

  const value: MetricsContextValue = { data, calculations, setData, updateData, reset };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
};

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider');
  return ctx;
}
