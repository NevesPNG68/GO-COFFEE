import { KPIData } from './types';

export const INITIAL_DATA: KPIData = {
  currentMonth: 'Fevereiro 2026',
  currentSales: 328,
  targetSales: 1200,
  currentTicket: 29.70,
  targetTicket: 29.50,
  currentRevenue: 9700,
  targetRevenueTier1: 35000,
  targetRevenueTier2: 36000,
  targetRevenueTier3: 40000,
  
  // Default Bonus Values (previously hardcoded)
  bonusValueSales: 150,
  bonusValueTicket: 250,
  bonusValueRevenueT1: 100,
  bonusValueRevenueT2: 200,
  bonusValueRevenueT3: 400,

  teamSize: 2,
  daysRemaining: 18,
};

// Deprecated: Values are now inside INITIAL_DATA to be editable
export const BONUS_VALUES = {};