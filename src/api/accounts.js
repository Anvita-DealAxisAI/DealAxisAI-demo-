import { fetchAccount, fetchAccounts, fetchPortfolio } from './client.js';
import { buildSummaryStats } from '../data/mockData.js';

export { buildSummaryStats };

/**
 * Fetch one bank's landscape: summary stats + opportunities.
 */
export async function fetchAccountLandscape(accountId) {
  const { account } = await fetchAccount(accountId);
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
  const { accounts } = await fetchAccounts();
  return accounts;
}

export async function fetchPortfolioAccounts() {
  const { accounts } = await fetchPortfolio();
  return accounts;
}

export async function fetchAccountById(accountId) {
  const { account } = await fetchAccount(accountId);
  return account;
}
