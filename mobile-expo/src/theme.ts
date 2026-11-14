export type ThemeMode = 'light' | 'dark';

export type Palette = {
  background: string;
  white: string;
  ink: string;
  muted: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  onPrimary: string;
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
  background: '#F3F0E8',
  white: '#FFFCF7',
  ink: '#1B2340',
  muted: '#5C6478',
  primary: '#4338CA',
  primaryDark: '#312E81',
  primarySoft: '#E7E4FB',
  onPrimary: '#FFFFFF',
  hero: '#1B2340',
  heroText: '#F7F4EE',
  heroMuted: '#C9CEDB',
  heroSoft: '#FFFFFF22',
  green: '#1F7A62',
  greenSoft: '#E3F5ED',
  gold: '#C9842A',
  goldSoft: '#FFF1D6',
  orange: '#E07A24',
  red: '#D14B5A',
  redSoft: '#FDECEE',
  line: '#E3DED2',
  locked: '#A7ADBA',
  warning: '#7A5416',
  warningBg: '#FFF4D8',
};

export const darkColors: Palette = {
  background: '#10131B',
  white: '#1A1F2C',
  ink: '#F4F1EA',
  muted: '#A7AEC0',
  primary: '#A5A0FF',
  primaryDark: '#D9D6FF',
  primarySoft: '#2A2750',
  onPrimary: '#161226',
  hero: '#23283A',
  heroText: '#F7F4EE',
  heroMuted: '#C5CAD8',
  heroSoft: '#FFFFFF18',
  green: '#7DDCB4',
  greenSoft: '#17352C',
  gold: '#E2B15A',
  goldSoft: '#3A2E18',
  orange: '#F0A15A',
  red: '#F08A96',
  redSoft: '#3A2228',
  line: '#2C3344',
  locked: '#6E7588',
  warning: '#F0D7A2',
  warningBg: '#3A2E18',
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 };

export function paletteFor(mode: ThemeMode): Palette {
  return mode === 'dark' ? darkColors : lightColors;
}

export function sheet(styles: Record<string, object>) {
  return styles;
}
