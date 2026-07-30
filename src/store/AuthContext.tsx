import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  name: string; email: string; role: string; team: string;
  avatar: string; company: string; phone: string; timezone: string;
  bankCount?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  workspaceLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    inviteCode?: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const defaultUser: User = {
  name: 'Ajay', email: 'ajay@accountsignal.ai', role: 'Sales Director',
  team: 'Strategic Accounts', company: 'AccountSignal AI',
  phone: '+91 98765 43210', timezone: 'Asia/Kolkata (IST)', avatar: 'AJ',
};

const DEMO_BANK_COUNTS: Record<string, number> = {
  'demo1@accountsignal.ai': 1,
  'demo2@accountsignal.ai': 2,
  'demo3@accountsignal.ai': 3,
  'demo4@accountsignal.ai': 4,
  'demo5@accountsignal.ai': 5,
  'demo6@accountsignal.ai': 6,
  'demo7@accountsignal.ai': 7,
  'demo8@accountsignal.ai': 8,
  'demo9@accountsignal.ai': 8,
  'demo10@accountsignal.ai': 8,
};

function buildUserForEmail(email: string, nameHint?: string): User {
  const normalized = email.trim().toLowerCase();
  if (DEMO_BANK_COUNTS[normalized]) {
    const n = DEMO_BANK_COUNTS[normalized];
    const label = normalized.split('@')[0];
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
  if (nameHint) {
    return { ...defaultUser, name: nameHint, email: normalized, avatar: nameHint.slice(0, 2).toUpperCase() };
  }
  return { ...defaultUser, email: normalized || defaultUser.email };
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  workspaceLoading: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('asi-user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const persist = (next: User | null) => {
    setUser(next);
    if (next) localStorage.setItem('asi-user', JSON.stringify(next));
    else localStorage.removeItem('asi-user');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password.length >= 6) {
      persist(buildUserForEmail(email));
      return true;
    }
    return false;
  };

  const signup = async (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    inviteCode?: string;
  }): Promise<boolean> => {
    if (!input.email || input.password.length < 6) return false;
    const name = [input.firstName, input.lastName].filter(Boolean).join(' ') || 'Demo User';
    persist({
      ...buildUserForEmail(input.email, name),
      role: input.title || 'Sales Director',
    });
    return true;
  };

  const logout = () => persist(null);

  const updateUser = (u: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...u };
      localStorage.setItem('asi-user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: false,
        workspaceLoading: false,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
