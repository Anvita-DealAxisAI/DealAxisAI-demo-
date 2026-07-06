import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  name: string; email: string; role: string; team: string;
  avatar: string; company: string; phone: string; timezone: string;
  bankCount?: number; // experimental — number of subscribed banks for demo1..demo10
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const defaultUser: User = {
  name: 'Ajay', email: 'ajay@accountsignal.ai', role: 'Sales Director',
  team: 'Strategic Accounts', company: 'AccountSignal AI',
  phone: '+91 98765 43210', timezone: 'Asia/Kolkata (IST)', avatar: 'AJ',
};

// ── Experimental demo accounts (demo1@ .. demo10@accountsignal.ai) ──
// Official demo@accountsignal.ai is untouched and always resolves to defaultUser.
// These exist ONLY to preview how the Prioritization Matrix looks with
// different numbers of subscribed banks (1 bank up to 8 banks).
const DEMO_BANK_COUNTS: Record<string, number> = {
  'demo1@accountsignal.ai':  1,
  'demo2@accountsignal.ai':  2,
  'demo3@accountsignal.ai':  3,
  'demo4@accountsignal.ai':  4,
  'demo5@accountsignal.ai':  5,
  'demo6@accountsignal.ai':  6,
  'demo7@accountsignal.ai':  7,
  'demo8@accountsignal.ai':  8,
  'demo9@accountsignal.ai':  8,
  'demo10@accountsignal.ai': 8,
};

function buildUserForEmail(email: string): User {
  const normalized = email.trim().toLowerCase();
  if (DEMO_BANK_COUNTS[normalized]) {
    const n = DEMO_BANK_COUNTS[normalized];
    const label = normalized.split('@')[0]; // e.g. "demo3"
    return {
      name: `Demo User ${n}`,
      email: normalized,
      role: 'Sales Director (Experimental)',
      team: 'Strategic Accounts',
      company: 'AccountSignal AI',
      phone: '+91 98765 43210',
      timezone: 'Asia/Kolkata (IST)',
      avatar: label.replace('demo', 'D'),
      bankCount: n,
    };
  }
  // Official demo@accountsignal.ai and any other login → unchanged default behavior
  return defaultUser;
}

const AuthContext = createContext<AuthContextType>({
  user: null, login: async () => false, logout: () => {}, updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem('asi-user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password.length >= 6) {
      const resolvedUser = buildUserForEmail(email);
      setUser(resolvedUser);
      localStorage.setItem('asi-user', JSON.stringify(resolvedUser));
      return true;
    }
    return false;
  };
  const logout = () => { setUser(null); localStorage.removeItem('asi-user'); };
  const updateUser = (u: Partial<User>) => {
    setUser(prev => { if (!prev) return prev; const n = { ...prev, ...u }; localStorage.setItem('asi-user', JSON.stringify(n)); return n; });
  };

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
