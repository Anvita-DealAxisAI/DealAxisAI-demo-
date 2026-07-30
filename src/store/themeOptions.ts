import type { Theme } from '../types';

export type ThemeOption = {
  value: Theme;
  label: string;
  shortLabel: string;
  desc: string;
  colors: string[];
};

/** Single source of truth for theme pickers (top bar + Settings). */
export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    shortLabel: 'Light',
    desc: 'Clean white canvas — ideal for daytime presentations',
    colors: ['#ffffff', '#f1f5f9', '#0a1628'],
  },
  {
    value: 'corporate',
    label: 'Corp',
    shortLabel: 'Corp',
    desc: 'Deep navy branding — executive board-ready',
    colors: ['#ffffff', '#e8edf5', '#1a3560'],
  },
];

export const THEME_VALUES = THEME_OPTIONS.map((option) => option.value);

export function isTheme(value: string | null | undefined): value is Theme {
  return THEME_VALUES.includes(value as Theme);
}
