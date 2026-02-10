import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_METRICS } from '../constants';
import { MetricsCalculations, MetricsContextValue, MetricsData, RevenueTier } from '../types';

const STORAGE_KEY = 'go-coffee-metas-v1';

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function safeNum(n: unknown) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

function calculate(data: MetricsData): MetricsCalculations {
  const teamSize = Math.max(1, Math.floor(safeNum(data.teamSize)));

  const currentSales = safeNum(data.currentSales);
  const targetSales = Math.max(0, safeNum(data.targetSales));
  const salesPct = targetSales > 0 ? clampPct((currentSales / targetSales) * 100) : 0;
  const salesDone = targetSales > 0 ? currentSales >= targetSales : false;
  const gapSales = Math.max(0, targetSales - currentSales);

  const currentTicket = safeNum(data.currentTicket);
  const targetTicket = safeNum(data.targetTicket);
  // Ticket: se target = 0, pct 0. Se ticket >= target, 100.
  const ticketPct =
    targetTicket > 0 ? clampPct((currentTicket / targetTicket) * 100) : 0;
  const ticketDone = targetTicket > 0 ? currentTicket >= targetTicket : false;
  const gapTicket = targetTicket > 0 ? Math.max(0, targetTicket - currentTicket) : 0;

  const currentRevenue = safeNum(data.currentRevenue);
  const t1 = Math.max(0, safeNum(data.targetRevenueTier1));
  const t2 = Math.max(0, safeNum(data.targetRevenueTier2));
  const t3 = Math.max(0, safeNum(data.targetRevenueTier3));

  let tier: RevenueTier = 0;
  if (t1 > 0 && currentRevenue >= t1) tier = 1;
  if (t2 > 0 && currentRevenue >= t2) tier = 2;
  if (t3 > 0 && currentRevenue >= t3) tier = 3;

  const nextTarget =
    tier === 0 ? t1 : tier === 1 ? t2 : tier === 2 ? t3 : t3;

  const revenuePct =
    nextTarget > 0 ? clampPct((currentRevenue / nextTarget) * 100) : 0;

  const revenueDone = tier > 0;
  const gapRevenueToNextTier =
    nextTarget > 0 ? Math.max(0, nextTarget - currentRevenue) : 0;

  // Bônus (se atingido)
  const bonusSales = salesDone ? safeNum(data.bonusValueSales) : 0;
  const bonusTicket = ticketDone ? safeNum(data.bonusValueTicket) : 0;

  let bonusRevenue = 0;
  if (tier === 1) bonusRevenue = safeNum(data.bonusValueRevenueT1);
  if (tier === 2) bonusRevenue = safeNum(data.bonusValueRevenueT2);
  if (tier === 3) bonusRevenue = safeNum(data.bonusValueRevenueT3);

  const totalBonusTeam = Math.max(0, bonusSales + bonusTicket + bonusRevenue);
  const totalBonusIndividual = totalBonusTeam / teamSize;

  return {
    salesPct,
    ticketPct,
    revenuePct,
    salesDone,
    ticketDone,
    revenueTierAchieved: tier,
    revenueDone,
    totalBonusTeam,
    totalBonusIndividual,
    gapSales,
    gapTicket,
    gapRevenueToNextTier,
  };
}

function loadInitial(): MetricsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_METRICS;
    const parsed = JSON.parse(raw) as Partial<MetricsData>;
    return { ...DEFAULT_METRICS, ...parsed };
  } catch {
    return DEFAULT_METRICS;
  }
}

function persist(data: MetricsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // não quebra
  }
}

const MetricsContext = createContext<MetricsContextValue | null>(null);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<MetricsData>(() => loadInitial());

  const calculations = useMemo(() => calculate(data), [data]);

  const setData = (next: MetricsData) => {
    setDataState(next);
    persist(next);
  };

  const update = (patch: Partial<MetricsData>) => {
    setDataState((prev: MetricsData) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  };

  const resetDefaults = () => {
    setDataState(DEFAULT_METRICS);
    persist(DEFAULT_METRICS);
  };

  const value: MetricsContextValue = {
    data,
    calculations,
    setData,
    update,
    resetDefaults,
  };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
}

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics deve ser usado dentro de <MetricsProvider>');
  return ctx;
}
