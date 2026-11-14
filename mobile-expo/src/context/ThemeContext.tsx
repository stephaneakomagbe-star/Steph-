import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Palette, ThemeMode, paletteFor } from '../theme';

const STORAGE_KEY = 'faithlingo.theme.v1';

type ThemeValue = {
  mode: ThemeMode;
  colors: Palette;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'dark' || value === 'light') setModeState(value);
    }).catch(() => undefined);
  }, []);

  const value = useMemo<ThemeValue>(() => ({
    mode,
    colors: paletteFor(mode),
    setMode: (next) => {
      setModeState(next);
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
    },
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme doit être utilisé dans ThemeProvider.');
  return theme;
}
