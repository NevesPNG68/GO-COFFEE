// types.ts
export type RevenueTier = 0 | 1 | 2 | 3;

export type MetricsData = {
  // Cabeçalho
  currentMonthLabel: string; // ex: "Fevereiro 2026"
  dayOfMonth: number;        // ex: 18
  teamSize: number;          // qtd pessoas

  // Meta 01 - Volume de Vendas
  currentSales: number;
  targetSales: number;
  bonusValueSales: number;

  // Meta 02 - Ticket Médio
  currentTicket: number;
  targetTicket: number;
  bonusValueTicket: number;

  // Meta 03 - Faturamento Bruto (Escalonado)
  currentRevenue: number;
  targetRevenueTier1: number;
  targetRevenueTier2: number;
  targetRevenueTier3: number;
  bonusValueRevenueT1: number;
  bonusValueRevenueT2: number;
  bonusValueRevenueT3: number;
};

export type MetricsCalculations = {
  salesPct: number;
  ticketPct: number;
  revenuePct: number;

  salesDone: boolean;
  ticketDone: boolean;

  revenueTierAchieved: RevenueTier;
  revenueDone: boolean;

  totalBonusTeam: number;
  totalBonusIndividual: number;

  gapSales: number;
  gapTicket: number;
  gapRevenueToNextTier: number;
};

export type MetricsContextValue = {
  data: MetricsData;
  calculations: MetricsCalculations;

  // ações
  setData: (next: MetricsData) => void;
  update: (patch: Partial<MetricsData>) => void;
  resetDefaults: () => void;
};
