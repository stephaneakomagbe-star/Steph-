export type ThemeMode = 'light' | 'dark';

export type Palette = {
  stage: string;
  background: string;
  white: string;
  ink: string;
  muted: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  hero: string;
  heroText: string;
  heroMuted: string;
  heroSoft: string;
  green: string;
  greenSoft: string;
  gold: string;
  goldSoft: string;
  orange: string;
  red: string;
  redSoft: string;
  line: string;
  locked: string;
  warning: string;
  warningBg: string;
};

export const lightColors: Palette = {
  stage: '#EBE6DC',
  background: '#F7F5F0',
  white: '#FFFFFF',
  ink: '#1E1B4B',
  muted: '#514C6B',
  primary: '#2E236F',
  primaryDark: '#1E1B4B',
  primarySoft: '#E8E4F6',
  onPrimary: '#FFFFFF',
  accent: '#D97706',
  onAccent: '#1E1B4B',
  accentSoft: '#FEF3C7',
  hero: '#1E1B4B',
  heroText: '#F7F5F0',
  heroMuted: '#D5D0E4',
  heroSoft: '#FFFFFF1F',
  green: '#0F766E',
  greenSoft: '#D1FAE5',
  gold: '#D97706',
  goldSoft: '#FEF3C7',
  orange: '#F59E0B',
  red: '#BE123C',
  redSoft: '#FDE8EE',
  line: '#E6E0D4',
  locked: '#9A94A8',
  warning: '#92400E',
  warningBg: '#FEF3C7',
};

export const darkColors: Palette = {
  stage: '#0B0A12',
  background: '#141225',
  white: '#1E1A33',
  ink: '#F7F5F0',
  muted: '#C8C2DC',
  primary: '#C4B5FD',
  primaryDark: '#EDE9FE',
  primarySoft: '#2C2654',
  onPrimary: '#1E1B4B',
  accent: '#F59E0B',
  onAccent: '#1E1B4B',
  accentSoft: '#3B2A12',
  hero: '#2E236F',
  heroText: '#F7F5F0',
  heroMuted: '#DDD7F0',
  heroSoft: '#FFFFFF18',
  green: '#6EE7B7',
  greenSoft: '#14352C',
  gold: '#F59E0B',
  goldSoft: '#3B2A12',
  orange: '#FBBF24',
  red: '#FB7185',
  redSoft: '#3A1D28',
  line: '#312B4A',
  locked: '#8B84A3',
  warning: '#FCD34D',
  warningBg: '#3B2A12',
};

export const fontFamily = 'PlusJakartaSans';

let brandFontReady = false;

export function enableBrandFont() {
  brandFontReady = true;
}

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 };

export function paletteFor(mode: ThemeMode): Palette {
  return mode === 'dark' ? darkColors : lightColors;
}

export function sheet(styles: Record<string, object>) {
  if (!brandFontReady) return styles;
  const next: Record<string, object> = {};
  for (const [key, value] of Object.entries(styles)) {
    const style = value as { fontSize?: number; fontWeight?: string | number };
    if (style && (style.fontSize != null || style.fontWeight != null)) {
      const weight = style.fontWeight === '900' || style.fontWeight === 900 ? '800' : style.fontWeight;
      next[key] = { ...style, fontFamily, fontWeight: weight };
    } else {
      next[key] = value;
    }
  }
  return next;
}
