import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// AJUSTE ESSE IMPORT se você já tem defaults em outro lugar:
// Ex: import { DEFAULT_METRICS } from '../constants';
import { DEFAULT_METRICS } from '../constants';

type MetricsContextValue = {
  metrics: any; // se você tiver tipo pronto, troque "any" pelo seu tipo (ex: MetricsState)
  setMetrics: React.Dispatch<React.SetStateAction<any>>;
  resetMetrics: () => void;
};

const MetricsContext = createContext<MetricsContextValue | null>(null);

const STORAGE_KEY = 'go-coffee-metrics-v1';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const MetricsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1) CARREGA DO LOCALSTORAGE
  const [metrics, setMetrics] = useState<any>(() => {
    const saved = safeParse<any>(localStorage.getItem(STORAGE_KEY));
    return saved ?? DEFAULT_METRICS;
  });

  // 2) GRAVA AUTOMATICAMENTE AO ALTERAR
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    } catch {
      // não quebra o app se storage falhar
    }
  }, [metrics]);

  const resetMetrics = () => {
    setMetrics(DEFAULT_METRICS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_METRICS));
    } catch {}
  };

  const value = useMemo(
    () => ({ metrics, setMetrics, resetMetrics }),
    [metrics]
  );

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
};

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within a MetricsProvider');
  return ctx;
}
