const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

export function fetchHealth() {
  return request('/api/health');
}

export function fetchAccounts() {
  return request('/api/accounts');
}

export function fetchAccount(accountId) {
  return request(`/api/accounts/${accountId}`);
}

export function fetchOpportunity(accountId, opportunityId) {
  return request(`/api/accounts/${accountId}/opportunities/${opportunityId}`);
}

export function fetchPortfolio() {
  return request('/api/portfolio');
}
