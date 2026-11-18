import { ReactNode, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Flame, Gem, Heart, Moon, RotateCcw, Sun, UserRound } from './icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoftPress } from './motion';
import { Palette, sheet, spacing } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useFaithLingo } from '../context/AppContext';

type Tab = 'parcours' | 'revisions' | 'profil';

export function MainShell({ activeTab, children }: { activeTab: Tab; children: ReactNode }) {
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, storageError } = useFaithLingo();
  const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date());

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.brandLine}>
          <View style={styles.brandMark}><BookOpen size={19} color={colors.onPrimary} /></View>
          <View>
            <Text style={styles.brand}>FaithLingo</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
        <SoftPress
          accessibilityRole="button"
          accessibilityLabel={mode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          style={styles.themeButton}
        >
          {mode === 'dark' ? <Sun size={18} color={colors.gold} /> : <Moon size={18} color={colors.primary} />}
        </SoftPress>
        <View style={styles.stats}>
          {data.profile?.hideStreak ? null : <Stat icon={<Flame size={18} color={colors.orange} />} value={data.streak} />}
          <Stat icon={<Gem size={18} color={colors.accent} />} value={data.xp} />
          <Stat icon={<Heart size={18} color={colors.red} />} value={data.hearts} />
        </View>
        </View>
      </View>
      {storageError ? <Text accessibilityRole="alert" style={styles.error}>Sauvegarde locale indisponible : {storageError}</Text> : null}
      <View style={styles.content}>{children}</View>
      <View style={styles.tabBar}>
        <TabButton label="Parcours" icon={BookOpen} active={activeTab === 'parcours'} onPress={() => router.replace('/')} />
        <TabButton label="Révisions" icon={RotateCcw} active={activeTab === 'revisions'} onPress={() => router.replace('/review')} />
        <TabButton label="Profil" icon={UserRound} active={activeTab === 'profil'} onPress={() => router.replace('/profile')} />
      </View>
    </View>
  );
}

function Stat({ icon, value }: { icon: ReactNode; value: number }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.stat}>{icon}<Text style={styles.statText}>{value}</Text></View>;
}

function TabButton({ label, icon: Icon, active, onPress }: { label: string; icon: typeof BookOpen; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <SoftPress accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Icon size={22} color={active ? colors.primary : colors.locked} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </SoftPress>
  );
}

function createStyles(colors: Palette): any {
  return sheet({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: spacing.md, paddingTop: 12, paddingBottom: 12, backgroundColor: colors.background },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  brandMark: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  themeButton: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  brand: { color: colors.primaryDark, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  date: { color: colors.muted, fontSize: 13, textTransform: 'capitalize', marginTop: 1 },
  stats: { flexDirection: 'row', gap: 6 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 7, backgroundColor: colors.background, borderRadius: 13 },
  statText: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  error: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.warningBg, color: colors.warning, fontSize: 13 },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 8, paddingBottom: 8, paddingHorizontal: 10, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
  tab: { minWidth: 96, minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 6 },
  tabActive: { backgroundColor: colors.primarySoft },
  tabText: { color: colors.locked, fontSize: 12, fontWeight: '700' },
  activeTabText: { color: colors.primary },
});
}

