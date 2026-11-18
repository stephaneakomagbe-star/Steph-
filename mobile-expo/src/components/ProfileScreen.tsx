import { useMemo } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Bell, BookOpen, Flame, Gem, ShieldCheck } from './icons';
import { ThemeSwitch } from './ThemeSwitch';
import { useTheme } from '../context/ThemeContext';
import { CourseId, GoalMinutes, getCourseLabel, getLevelLabel, Level, Profile } from '../data/coursesData';
import { Palette, sheet, spacing } from '../theme';

type Props = {
  profile: Profile;
  reminderEnabled: boolean;
  xp: number;
  streak: number;
  onUpdate: (changes: Partial<Profile>) => void;
  onSetReminder: (enabled: boolean) => void;
  onSetReminderTime: (hour: number) => void;
};

const COURSES: CourseId[] = ['bible', 'coran', 'decouverte'];
const LEVELS: Level[] = ['debutant', 'intermediaire', 'avance'];
const GOALS: GoalMinutes[] = [5, 10, 15];

export function ProfileScreen({ profile, reminderEnabled, xp, streak, onUpdate, onSetReminder, onSetReminderTime }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.profileHero}>
        <View style={styles.avatar}><BookOpen size={25} color={colors.onPrimary} /></View>
        <Text style={styles.title}>Mon espace</Text>
        <Text style={styles.subtitle}>Un parcours qui vous ressemble.</Text>
        <View style={styles.stats}>
          <View style={styles.stat}><Gem size={16} color={colors.accent} /><Text style={styles.statNumber}>{xp}</Text><Text style={styles.statLabel}>XP</Text></View>
          {profile.hideStreak ? null : (
            <View style={styles.stat}><Flame size={16} color={colors.orange} /><Text style={styles.statNumber}>{streak}</Text><Text style={styles.statLabel}>jours de suite</Text></View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        <Text style={styles.label}>Mode d’affichage</Text>
        <ThemeSwitch />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon parcours</Text>
        <Text style={styles.label}>Tradition</Text>
        <View style={styles.choiceRow}>
          {COURSES.map((course) => <Option key={course} label={getCourseLabel(course)} active={profile.course === course} onPress={() => onUpdate({ course })} />)}
        </View>
        <Text style={styles.label}>Niveau</Text>
        <View style={styles.choiceRow}>
          {LEVELS.map((level) => <Option key={level} label={getLevelLabel(level)} active={profile.level === level} onPress={() => onUpdate({ level })} />)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon rythme</Text>
        <Text style={styles.label}>Objectif quotidien</Text>
        <View style={styles.goalRow}>
          {GOALS.map((minutes) => (
            <Pressable key={minutes} onPress={() => onUpdate({ dailyGoal: minutes })} style={[styles.goal, profile.dailyGoal === minutes && styles.goalActive]}>
              <Text style={[styles.goalText, profile.dailyGoal === minutes && styles.goalTextActive]}>{minutes} min</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.reminder}>
          <View style={styles.reminderIcon}><Bell size={18} color={colors.primary} /></View>
          <View style={styles.reminderCopy}>
            <Text style={styles.reminderTitle}>Rappel quotidien</Text>
            <Text style={styles.reminderText}>{reminderEnabled ? `Rappel quotidien à ${String(profile.reminderHour).padStart(2, '0')}:00.` : 'Désactivé — aucune notification envoyée.'}</Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={onSetReminder}
            trackColor={{ false: colors.line, true: colors.primary }}
            thumbColor={colors.onPrimary}
            accessibilityLabel="Activer le rappel quotidien"
          />
        </View>
        <View style={styles.reminder}>
          <View style={styles.reminderIcon}><Flame size={18} color={colors.orange} /></View>
          <View style={styles.reminderCopy}>
            <Text style={styles.reminderTitle}>Masquer la série</Text>
            <Text style={styles.reminderText}>La régularité reste privée. Vous pouvez cacher le compteur de jours.</Text>
          </View>
          <Switch
            value={profile.hideStreak}
            onValueChange={(hideStreak) => onUpdate({ hideStreak })}
            trackColor={{ false: colors.line, true: colors.primary }}
            thumbColor={colors.onPrimary}
            accessibilityLabel="Masquer la série quotidienne"
          />
        </View>
        {reminderEnabled ? (
          <View style={styles.reminderTimes}>
            {[8, 13, 19].map((hour) => (
              <Pressable key={hour} onPress={() => onSetReminderTime(hour)} style={[styles.reminderTime, profile.reminderHour === hour && styles.reminderTimeActive]}>
                <Text style={[styles.reminderTimeText, profile.reminderHour === hour && styles.reminderTimeTextActive]}>{String(hour).padStart(2, '0')}:00</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.respect}>
        <ShieldCheck size={19} color={colors.green} />
        <View style={styles.respectCopy}>
          <Text style={styles.respectTitle}>Un apprentissage à votre rythme</Text>
          <Text style={styles.respectText}>Votre progression reste sur cet appareil. Vos préférences religieuses ne sont pas publiées.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function Option({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.option, active && styles.optionActive]}>
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: Palette): any {
  return sheet({
  scroll: { padding: spacing.md, paddingBottom: 28 },
  profileHero: { alignItems: 'center', padding: 20, backgroundColor: colors.hero, borderRadius: 22 },
  avatar: { width: 55, height: 55, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.heroText, fontSize: 24, fontWeight: '800', marginTop: 10 },
  subtitle: { color: colors.heroMuted, fontSize: 14, marginTop: 4 },
  stats: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 17 },
  stat: { flex: 1, minHeight: 43, backgroundColor: colors.heroSoft, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  statNumber: { color: colors.heroText, fontWeight: '800', fontSize: 15 },
  statLabel: { color: colors.heroMuted, fontSize: 14 },
  section: { backgroundColor: colors.white, borderRadius: 19, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.line },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginBottom: 13 },
  label: { color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 7 },
  choiceRow: { flexDirection: 'row', gap: 7, marginBottom: 13 },
  option: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 37, paddingHorizontal: 5, borderRadius: 11, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line },
  optionActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  optionText: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  optionTextActive: { color: colors.primary },
  goalRow: { flexDirection: 'row', gap: 8 },
  goal: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 11, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line },
  goalActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  goalText: { color: colors.muted, fontSize: 14, fontWeight: '900' },
  goalTextActive: { color: colors.primary },
  reminder: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 17 },
  reminderIcon: { width: 37, height: 37, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  reminderCopy: { flex: 1 },
  reminderTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  reminderText: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 2 },
  reminderTimes: { flexDirection: 'row', gap: 7, marginTop: 12 },
  reminderTime: { flex: 1, alignItems: 'center', paddingVertical: 9, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  reminderTimeActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  reminderTimeText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  reminderTimeTextActive: { color: colors.primary },
  respect: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.greenSoft, marginTop: 14 },
  respectCopy: { flex: 1 },
  respectTitle: { color: colors.green, fontSize: 14, fontWeight: '800' },
  respectText: { color: colors.ink, fontSize: 13, lineHeight: 18, marginTop: 4 },
});
}
