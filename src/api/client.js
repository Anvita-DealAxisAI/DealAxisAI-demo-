/**
 * Static stubs that match the main app's api/client surface.
 * No network calls — demo repo stays offline with static data.
 */
import {
  getStaticPortfolioAccounts,
  getStaticAccountById,
  getStaticClientCapabilities,
  getStaticOpportunity,
  getStaticNotifications,
  getStaticNews,
  getStaticOrganization,
  getStaticSignals,
} from './staticDemoAccounts.js';

export function clearApiCache() {}

function currentBankCount() {
  try {
    const raw = localStorage.getItem('asi-user');
    if (!raw) return undefined;
    return JSON.parse(raw)?.bankCount;
  } catch {
    return undefined;
  }
}

export async function bootstrapWorkspace() {
  const accounts = getStaticPortfolioAccounts(currentBankCount());
  const byAccount = {};
  for (const account of accounts) {
    byAccount[account.id] = {
      signals: getStaticSignals(account.id),
      news: getStaticNews(account.id),
      org: getStaticOrganization(account.id),
    };
  }
  return {
    accounts,
    clientCapabilities: getStaticClientCapabilities(),
    byAccount,
  };
}

export async function fetchWorkspace() {
  return {
    workspace: {
      clientId: 'demo-client',
      clientName: 'AccountSignal Demo',
      status: 'active',
    },
  };
}

export async function fetchAccounts() {
  return { accounts: getStaticPortfolioAccounts(currentBankCount()) };
}

export async function fetchAccount(accountId) {
  return { account: getStaticAccountById(accountId, currentBankCount()) };
}

export async function fetchPortfolio() {
  return {
    accounts: getStaticPortfolioAccounts(currentBankCount()),
    clientCapabilities: getStaticClientCapabilities(),
  };
}

export async function fetchOpportunity(accountId, opportunityId) {
  return { opportunity: getStaticOpportunity(accountId, opportunityId) };
}

export async function fetchNotifications(limit = 20) {
  const payload = getStaticNotifications(getStaticPortfolioAccounts(currentBankCount()));
  return {
    notifications: payload.notifications.slice(0, limit),
    unreadCount: payload.unreadCount,
  };
}

export async function markNotificationsRead() {
  return { ok: true };
}

export async function fetchMe() {
  let profile = {
    id: 'demo-user',
    name: 'Ajay',
    firstName: 'Ajay',
    lastName: '',
    email: 'ajay@accountsignal.ai',
    avatar: 'AJ',
    status: 'active',
    role: 'Sales Director',
    team: 'Strategic Accounts',
    company: 'AccountSignal AI',
    phone: '+91 98765 43210',
    clientId: 'demo-client',
  };
  try {
    const raw = localStorage.getItem('asi-user');
    if (raw) {
      const user = JSON.parse(raw);
      profile = {
        ...profile,
        name: user.name ?? profile.name,
        email: user.email ?? profile.email,
        avatar: user.avatar ?? profile.avatar,
        role: user.role ?? profile.role,
        team: user.team ?? profile.team,
        company: user.company ?? profile.company,
        phone: user.phone ?? profile.phone,
      };
    }
  } catch {
    /* ignore */
  }
  return { profile };
}

export async function fetchTeam() {
  return {
    client: { id: 'demo-client', name: 'AccountSignal Demo' },
    members: [
      {
        id: 'm1',
        name: 'Ajay',
        email: 'ajay@accountsignal.ai',
        role: 'admin',
        avatar: 'AJ',
      },
      {
        id: 'm2',
        name: 'Demo User',
        email: 'demo@accountsignal.ai',
        role: 'member',
        avatar: 'DU',
      },
    ],
    invites: [],
    seats: { limit: 10, used: 2, remaining: 8 },
    currentUserRole: 'admin',
    canInviteMembers: true,
  };
}

export async function createTeamInvite({ email, role, expiresInDays = 7 }) {
  const code = `demo-${Math.random().toString(36).slice(2, 8)}`;
  const expiresAt = new Date(Date.now() + expiresInDays * 86_400_000).toISOString();
  return {
    invite: {
      id: `inv_${code}`,
      inviteCode: code,
      inviteEmail: email ?? null,
      inviteRole: role ?? 'member',
      inviteStatus: 'pending',
      usedCount: 0,
      maxUses: 1,
      expiresAt,
      createdAt: new Date().toISOString(),
      inviteUrl: `${window.location.origin}${import.meta.env.BASE_URL}login?invite=${code}`,
    },
  };
}

export async function fetchPublicInvite(inviteCode) {
  return {
    invite: {
      inviteCode,
      clientName: 'AccountSignal Demo',
      inviteEmail: null,
      inviteRole: 'member',
    },
  };
}

export async function acceptInvite() {
  return {
    ok: true,
    clientId: 'demo-client',
    clientName: 'AccountSignal Demo',
    role: 'member',
  };
}
