import type { MetricsData } from './types';

export const STORAGE_KEY = 'go-coffee-metrics-v1';

export const DEFAULT_METRICS: MetricsData = {
  currentMonth: 'Fevereiro 2026',
  daysRemaining: 18,
  teamSize: 2,

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

  bonusTier1: 100,
  bonusTier2: 200,
  bonusTier3: 300,
};
