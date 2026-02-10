export type MetricsData = {
  // topo
  currentMonth: string;     // ex: "Fevereiro 2026"
  daysRemaining: number;    // ex: 18
  teamSize: number;         // ex: 2

  // Meta 01 (Volume)
  currentSales: number;
  targetSales: number;
  bonusValueSales: number;

  // Meta 02 (Ticket)
  currentTicket: number;
  targetTicket: number;
  bonusValueTicket: number;

  // Meta 03 (Faturamento escalonado)
  currentRevenue: number;
  targetRevenueTier1: number;
  targetRevenueTier2: number;
  targetRevenueTier3: number;

  bonusTier1: number;
  bonusTier2: number;
  bonusTier3: number;

  // deixa flexível se o Dashboard tiver mais campos
  [key: string]: any;
};

export type MetricsCalculations = {
  achievedSales: boolean;
  achievedTicket: boolean;
  achievedRevenueTier: 0 | 1 | 2 | 3;

  bonusIndividual: number;
  totalIndividual: number; // <- ESSA CHAVE É A DO ERRO DO PRINT
  bonusTeam: number;
  totalTeam: number;

  pctSales: number;
  pctTicket: number;
  pctRevenue: number;

  [key: string]: any;
};

export type MetricsContextValue = {
  data: MetricsData;
  calculations: MetricsCalculations;
  setData: (next: MetricsData) => void;
  updateData: (patch: Partial<MetricsData>) => void;
  reset: () => void;
};
