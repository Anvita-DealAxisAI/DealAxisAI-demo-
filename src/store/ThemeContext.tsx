import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../types';
import { isTheme } from './themeOptions';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {} });

function readStoredTheme(): Theme {
  const stored = localStorage.getItem('dealaxis-theme');
  return isTheme(stored) ? stored : 'light';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const setTheme = (t: Theme) => {
    if (!isTheme(t)) return;
    setThemeState(t);
    localStorage.setItem('dealaxis-theme', t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-corporate');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
