import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('dealaxis-theme') as Theme) || 'light';
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('dealaxis-theme', t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-corporate');
    if (theme === 'dark') root.classList.add('theme-dark');
    if (theme === 'corporate') root.classList.add('theme-corporate');
    if (theme === 'light') root.classList.add('theme-light');
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
