import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'go-coffee-metas-v1';

/**
 * DADOS (state) — pode crescer depois sem quebrar
 * Ajuste os valores padrão se quiser.
 */
export type MetricsData = {
  referenceMonth: string;

  meta01: { current: number; target: number; bonus: number }; // Volume de vendas
  meta02: { current: number; target: number; bonus: number }; // Ticket médio
  meta03: {
    revenueCurrent: number;
    teamSize: number;
    levels: Array<{ target: number; bonus: number }>; // Escalonado
  };
};

export type MetricsCalculations = {
  meta01Pct: number;
  meta01Reached: boolean;

  meta02Reached: boolean;

  meta03ReachedLevel: number; // 0,1,2,3...
  meta03NextTarget: number | null;

  totalBonus: number;
};

export type MetricsContextValue = {
  // ✅ O Dashboard está pedindo isto:
  data: MetricsData;
  calculations: MetricsCalculations;

  // ✅ Utilitários para atualizar/salvar:
  setData: React.Dispatch<React.SetStateAction<MetricsData>>;
  updateData: (patch: Partial<MetricsData>) => void;
  resetDefaults: () => void;

  // (compatibilidade extra, se algum componente antigo usar)
  metrics: MetricsData;
};

const DEFAULT_DATA: MetricsData = {
  referenceMonth: 'Fevereiro 2026',

  meta01: { current: 328, target: 1200, bonus: 150 },
  meta02: { current: 29.7, target: 29.5, bonus: 250 },
  meta03: {
    revenueCurrent: 9700,
    teamSize: 2,
    levels: [
      { target: 35000, bonus: 100 },
      { target: 36000, bonus: 200 },
      { target: 40000, bonus: 300 },
    ],
  },
};

const MetricsContext = createContext<MetricsContextValue | null>(null);

function safeNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function clampPct(p: number) {
  if (!Number.isFinite(p)) return 0;
  return Math.max(0, Math.min(100, p));
}

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1) Carrega do localStorage (se existir)
  const [data, setData] = useState<MetricsData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;
      const parsed = JSON.parse(raw);
      return (parsed?.data as MetricsData) ?? DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  // 2) Recalcula sempre que data muda
  const calculations: MetricsCalculations = useMemo(() => {
    const m1c = safeNumber(data.meta01?.current);
    const m1t = safeNumber(data.meta01?.target);
    const meta01Pct = m1t > 0 ? clampPct((m1c / m1t) * 100) : 0;
    const meta01Reached = m1t > 0 && m1c >= m1t;

    const m2c = safeNumber(data.meta02?.current);
    const m2t = safeNumber(data.meta02?.target);
    const meta02Reached = m2t > 0 && m2c >= m2t; // ticket: quanto maior, melhor

    const rev = safeNumber(data.meta03?.revenueCurrent);
    const levels = Array.isArray(data.meta03?.levels) ? data.meta03.levels : [];

    // nível atingido = maior nível cujo target foi alcançado
    let reachedLevel = 0;
    for (let i = 0; i < levels.length; i++) {
      const t = safeNumber(levels[i]?.target);
      if (t > 0 && rev >= t) reachedLevel = i + 1;
    }

    const nextTarget =
      reachedLevel < levels.length ? safeNumber(levels[reachedLevel]?.target) : null;

    // bônus
    const bonus1 = meta01Reached ? safeNumber(data.meta01?.bonus) : 0;
    const bonus2 = meta02Reached ? safeNumber(data.meta02?.bonus) : 0;

    let bonus3 = 0;
    if (reachedLevel > 0) {
      // paga o bônus do nível atingido (último)
      bonus3 = safeNumber(levels[reachedLevel - 1]?.bonus);
    }

    return {
      meta01Pct,
      meta01Reached,
      meta02Reached,
      meta03ReachedLevel: reachedLevel,
      meta03NextTarget: nextTarget,
      totalBonus: bonus1 + bonus2 + bonus3,
    };
  }, [data]);

  // 3) Salva automaticamente (sem botão, mas o seu botão pode chamar updateData)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data }));
    } catch {
      // não quebra o app se storage falhar
    }
  }, [data]);

  const updateData = (patch: Partial<MetricsData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const resetDefaults = () => setData(DEFAULT_DATA);

  const value: MetricsContextValue = {
    data,
    calculations,
    setData,
    updateData,
    resetDefaults,
    metrics: data, // compat
  };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
};

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider');
  return ctx;
}
