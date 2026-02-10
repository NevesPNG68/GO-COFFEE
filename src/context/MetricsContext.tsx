// src/context/MetricsContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_METRICS, STORAGE_KEY } from '../constants';
import { MetricsCalculations, MetricsContextValue, MetricsData, RevenueTier } from '../types';

const MetricsContext = createContext<MetricsContextValue | null>(null);

function n(v: unknown): number {
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // CARREGA do localStorage (se existir)
  const [data, setData] = useState<MetricsData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_METRICS } as unknown as MetricsData;

      const parsed = JSON.parse(raw) as Partial<MetricsData>;
      // Mescla com defaults (para não quebrar se faltar campo)
      return {
        ...(DEFAULT_METRICS as unknown as MetricsData),
        ...(parsed || {}),
      };
    } catch {
      return { ...DEFAULT_METRICS } as unknown as MetricsData;
    }
  });

  // SALVA no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // não quebra se storage falhar
    }
  }, [data]);

  // Atualiza por partes (patch)
  const updateData = (patch: Partial<MetricsData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  // Restaurar padrão
  const resetDefaults = () => {
    setData({ ...DEFAULT_METRICS } as unknown as MetricsData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const calculations: MetricsCalculations = useMemo(() => {
    const teamSize = Math.max(1, n(data.teamSize));

    // Meta 01
    const currentSales = n(data.currentSales);
    const targetSales = n(data.targetSales);
    const bonusSales = n(data.bonusValueSales);

    const salesPct = targetSales > 0 ? (currentSales / targetSales) * 100 : 0;
    const salesRemaining = Math.max(0, targetSales - currentSales);
    const salesMet = targetSales > 0 && currentSales >= targetSales;

    // Meta 02
    const currentTicket = n(data.currentTicket);
    const targetTicket = n(data.targetTicket);
    const bonusTicket = n(data.bonusValueTicket);

    const ticketDelta = currentTicket - targetTicket;
    const ticketMet = targetTicket > 0 && currentTicket >= targetTicket;

    // Meta 03 (Escalonado)
    const currentRevenue = n(data.currentRevenue);
    const t1 = n(data.targetRevenueTier1);
    const t2 = n(data.targetRevenueTier2);
    const t3 = n(data.targetRevenueTier3);

    const b1 = n(data.bonusTier1);
    const b2 = n(data.bonusTier2);
    const b3 = n(data.bonusTier3);

    let tier: RevenueTier = 0;
    if (t3 > 0 && currentRevenue >= t3) tier = 3;
    else if (t2 > 0 && currentRevenue >= t2) tier = 2;
    else if (t1 > 0 && currentRevenue >= t1) tier = 1;

    // Próximo alvo (tier atual + 1), ou mantém o último
    const revenueTargetCurrent =
      tier === 0 ? t1 || 0 : tier === 1 ? t2 || t1 || 0 : tier === 2 ? t3 || t2 || 0 : t3 || 0;

    const revenueRemaining = revenueTargetCurrent > 0 ? Math.max(0, revenueTargetCurrent - currentRevenue) : 0;

    const revenuePctToCurrent =
      revenueTargetCurrent > 0 ? clamp((currentRevenue / revenueTargetCurrent) * 100, 0, 999) : 0;

    // Total bônus (equipe)
    let totalTeamBonus = 0;
    if (salesMet) totalTeamBonus += bonusSales;
    if (ticketMet) totalTeamBonus += bonusTicket;

    if (tier >= 1) totalTeamBonus += b1;
    if (tier >= 2) totalTeamBonus += b2;
    if (tier >= 3) totalTeamBonus += b3;

    const totalIndividual = totalTeamBonus / teamSize;

    return {
      salesPct: Math.max(0, salesPct),
      salesRemaining,
      salesMet,

      ticketDelta,
      ticketMet,

      revenueTierAchieved: tier,
      revenueTargetCurrent,
      revenueRemaining,
      revenuePctToCurrent,

      totalTeamBonus,
      totalIndividual,
    };
  }, [data]);

  const value: MetricsContextValue = {
    data,
    setData,
    calculations,
    updateData,
    resetDefaults,
  };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
};

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics deve ser usado dentro de <MetricsProvider>');
  return ctx;
}
