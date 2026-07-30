import { buildSummaryStats } from '../data/mockData.js';
import {
  getStaticPortfolioAccounts,
  getStaticAccountById,
  getStaticClientCapabilities,
  getStaticSignals,
  getStaticOrganization,
  getStaticNews,
} from './staticDemoAccounts.js';

export { buildSummaryStats };

function currentBankCount() {
  try {
    const raw = localStorage.getItem('asi-user');
    if (!raw) return undefined;
    const user = JSON.parse(raw);
    return user?.bankCount;
  } catch {
    return undefined;
  }
}

export async function fetchAccountLandscape(accountId) {
  const account = getStaticAccountById(accountId, currentBankCount());
  if (!account) {
    return { account: null, stats: [], opportunities: [] };
  }
  return {
    account: { id: account.id, name: account.name },
    stats: buildSummaryStats(account.summary),
    opportunities: account.opportunities,
  };
}

export async function fetchAccountsList() {
  return getStaticPortfolioAccounts(currentBankCount());
}

export async function fetchPortfolioAccounts() {
  return {
    accounts: getStaticPortfolioAccounts(currentBankCount()),
    clientCapabilities: getStaticClientCapabilities(),
  };
}

export async function fetchAccountById(accountId) {
  return getStaticAccountById(accountId, currentBankCount());
}

export async function fetchAccountNewsById(accountId) {
  return getStaticNews(accountId);
}

export async function fetchAccountSignalsById(accountId) {
  return getStaticSignals(accountId);
}

export async function fetchAccountOrganizationById(accountId) {
  return getStaticOrganization(accountId);
}
