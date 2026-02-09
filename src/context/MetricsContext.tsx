import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KPIData, BonusCalculation } from '../types';
import { INITIAL_DATA } from '../constants';

interface MetricsContextType {
  data: KPIData;
  updateData: (newData: Partial<KPIData>) => void;
  calculations: BonusCalculation;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const MetricsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<KPIData>(() => {
    // Try to load from localStorage to persist updates on refresh
    const saved = localStorage.getItem('go-coffee-metrics');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [calculations, setCalculations] = useState<BonusCalculation>({
    salesBonus: 0,
    ticketBonus: 0,
    revenueBonus: 0,
    totalIndividual: 0,
    totalTeam: 0,
    isTicketLocked: true,
    maxPotentialIndividual: 0,
  });

  useEffect(() => {
    // Save to local storage whenever data changes
    localStorage.setItem('go-coffee-metrics', JSON.stringify(data));

    // 1. Sales Bonus (Meta 1)
    const salesHit = data.currentSales >= data.targetSales;
    const salesBonus = salesHit ? data.bonusValueSales : 0;

    // 2. Ticket Bonus (Meta 2) - LOCKED if Sales < 1200
    const isTicketLocked = !salesHit;
    const ticketHit = data.currentTicket >= data.targetTicket;
    const ticketBonus = (ticketHit && !isTicketLocked) ? data.bonusValueTicket : 0;

    // 3. Revenue Bonus (Meta 3) - Tiered
    let revenueBonus = 0;
    if (data.currentRevenue >= data.targetRevenueTier3) {
      revenueBonus = data.bonusValueRevenueT3;
    } else if (data.currentRevenue >= data.targetRevenueTier2) {
      revenueBonus = data.bonusValueRevenueT2;
    } else if (data.currentRevenue >= data.targetRevenueTier1) {
      revenueBonus = data.bonusValueRevenueT1;
    }

    const totalIndividual = salesBonus + ticketBonus + revenueBonus;
    const totalTeam = totalIndividual * data.teamSize;

    const maxPotentialIndividual = data.bonusValueSales + data.bonusValueTicket + data.bonusValueRevenueT3;

    setCalculations({
      salesBonus,
      ticketBonus,
      revenueBonus,
      totalIndividual,
      totalTeam,
      isTicketLocked,
      maxPotentialIndividual
    });

  }, [data]);

  const updateData = (newData: Partial<KPIData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <MetricsContext.Provider value={{ data, updateData, calculations }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};
