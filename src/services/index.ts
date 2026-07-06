import { accounts, opportunities, kpiCards, bubbleData, aiRecommendations } from '../mockData';

// Service layer - swap these implementations for real API calls later

export const getDashboardData = async () => {
  return { kpiCards, bubbleData, accounts, aiRecommendations };
};

export const getAccounts = async () => {
  return accounts;
};

export const getAccount = async (id: string) => {
  return accounts.find(a => a.id === id) || accounts[0];
};

export const getOpportunities = async () => {
  return opportunities;
};

export const getOpportunity = async (id: string) => {
  return opportunities.find(o => o.id === id) || opportunities[0];
};
