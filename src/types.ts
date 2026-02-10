// src/types.ts
import React from 'react';

export type MetricsData = {
  // Gerais
  currentMonth: string;
  daysRemaining: number;
  teamSize: number;

  // Meta 01
  currentSales: number;
  targetSales: number;
  bonusValueSales: number;

  // Meta 02
  currentTicket: number;
  targetTicket: number;
  bonusValueTicket: number;

  // Meta 03
  currentRevenue: number;

  targetRevenueTier1: number;
  targetRevenueTier2: number;
  targetRevenueTier3: number;

  bonusTier1: number;
  bonusTier2: number;
  bonusTier3: number;
};

export type RevenueTier = 0 | 1 | 2 | 3;

export type MetricsCalculations = {
  // Meta 01
  salesPct: number;
  salesRemaining: number;
  salesMet: boolean;

  // Meta 02
  ticketDelta: number; // atual - meta
  ticketMet: boolean;

  // Meta 03
  revenueTierAchieved: RevenueTier;
  revenueTargetCurrent: number; // alvo do próximo tier
  revenueRemaining: number;     // quanto falta para o próximo tier
  revenuePctToCurrent: number;  // % até o próximo tier

  // Total bônus
  totalTeamBonus: number;       // total para a equipe
  totalIndividual: number;      // quanto dá por pessoa
};

export type MetricsContextValue = {
  data: MetricsData;

  // Setter REAL do React => aceita setData(prev => ...)
  setData: React.Dispatch<React.SetStateAction<MetricsData>>;

  calculations: MetricsCalculations;

  updateData: (patch: Partial<MetricsData>) => void;
  resetDefaults: () => void;
};
