import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Flame, Heart, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { useFaithLingo } from '../context/AppContext';

type Tab = 'parcours' | 'revisions' | 'profil';

export function MainShell({ activeTab, children }: { activeTab: Tab; children: ReactNode }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, storageError } = useFaithLingo();
  const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.brandLine}>
          <View style={styles.brandMark}><BookOpen size={19} color={colors.white} /></View>
          <View>
            <Text style={styles.brand}>FaithLingo</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          {data.profile?.hideStreak ? null : <Stat icon={<Flame size={15} color={colors.orange} />} value={data.streak} />}
          <Stat icon={<Sparkles size={15} color={colors.gold} />} value={data.xp} />
          <Stat icon={<Heart size={15} color={colors.red} fill={colors.red} />} value={data.hearts} />
        </View>
      </View>
      {storageError ? <Text accessibilityRole="alert" style={styles.error}>Sauvegarde locale indisponible : {storageError}</Text> : null}
      <View style={styles.content}>{children}</View>
      <View style={styles.tabBar}>
        <TabButton label="Parcours" icon={BookOpen} active={activeTab === 'parcours'} onPress={() => router.replace('/')} />
        <TabButton label="Révisions" icon={BookOpen} active={activeTab === 'revisions'} onPress={() => router.replace('/review')} />
        <TabButton label="Profil" icon={Heart} active={activeTab === 'profil'} onPress={() => router.replace('/profile')} />
      </View>
    </View>
  );
}

function Stat({ icon, value }: { icon: ReactNode; value: number }) {
  return <View style={styles.stat}>{icon}<Text style={styles.statText}>{value}</Text></View>;
}

function TabButton({ label, icon: Icon, active, onPress }: { label: string; icon: typeof BookOpen; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={styles.tab}>
      <Icon size={19} color={active ? colors.primary : colors.muted} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingTop: 9, paddingBottom: 13, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  brand: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  date: { color: colors.muted, fontSize: 10, textTransform: 'capitalize', marginTop: 1 },
  stats: { flexDirection: 'row', gap: 6 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 6, backgroundColor: colors.background, borderRadius: 13 },
  statText: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  error: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.warningBg, color: colors.warning, fontSize: 11 },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 8, paddingBottom: 8, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
  tab: { minWidth: 82, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 3 },
  tabText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  activeTabText: { color: colors.primary },
});

