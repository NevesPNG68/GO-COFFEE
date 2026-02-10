// src/constants.ts

export const STORAGE_KEY = 'go-coffee-metas-v1';

export const DEFAULT_METRICS = {
  // Informações gerais
  currentMonth: new Date()
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase()),
  daysRemaining: 18, // pode editar no UpdateForm
  teamSize: 2,

  // Meta 01: Volume de Vendas (Qtd)
  currentSales: 328,
  targetSales: 1200,
  bonusValueSales: 150,

  // Meta 02: Ticket Médio
  currentTicket: 29.7,
  targetTicket: 29.5,
  bonusValueTicket: 250,

  // Meta 03: Faturamento Bruto (Escalonado)
  currentRevenue: 9700,

  targetRevenueTier1: 35000,
  targetRevenueTier2: 36000,
  targetRevenueTier3: 40000,

  bonusTier1: 100,
  bonusTier2: 200,
  bonusTier3: 300,
} as const;
