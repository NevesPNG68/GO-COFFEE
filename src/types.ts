export interface KPIData {
  currentMonth: string;
  currentSales: number;
  targetSales: number;
  currentTicket: number;
  targetTicket: number;
  currentRevenue: number;
  targetRevenueTier1: number;
  targetRevenueTier2: number;
  targetRevenueTier3: number;
  
  // Dynamic Bonus Values
  bonusValueSales: number;
  bonusValueTicket: number;
  bonusValueRevenueT1: number;
  bonusValueRevenueT2: number;
  bonusValueRevenueT3: number;

  teamSize: number;
  daysRemaining: number;
}

export interface BonusCalculation {
  salesBonus: number;
  ticketBonus: number;
  revenueBonus: number;
  totalIndividual: number;
  totalTeam: number;
  isTicketLocked: boolean;
  maxPotentialIndividual: number;
}
