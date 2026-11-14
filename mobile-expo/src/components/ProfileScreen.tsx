import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Bell, BookOpen, Flame, ShieldCheck, Sparkles } from 'lucide-react-native';
import { CourseId, GoalMinutes, getCourseLabel, getLevelLabel, Level, Profile } from '../data/coursesData';
import { colors, spacing } from '../theme';

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
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.profileHero}>
        <View style={styles.avatar}><BookOpen size={25} color={colors.white} /></View>
        <Text style={styles.title}>Mon espace</Text>
        <Text style={styles.subtitle}>Un parcours qui vous ressemble.</Text>
        <View style={styles.stats}>
          <View style={styles.stat}><Sparkles size={16} color={colors.gold} /><Text style={styles.statNumber}>{xp}</Text><Text style={styles.statLabel}>XP</Text></View>
          {profile.hideStreak ? null : (
            <View style={styles.stat}><Flame size={16} color={colors.orange} /><Text style={styles.statNumber}>{streak}</Text><Text style={styles.statLabel}>jours de suite</Text></View>
          )}
        </View>
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
            thumbColor={colors.white}
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
            thumbColor={colors.white}
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
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.option, active && styles.optionActive]}>
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: 28 },
  profileHero: { alignItems: 'center', padding: 20, backgroundColor: colors.ink, borderRadius: 22 },
  avatar: { width: 55, height: 55, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.white, fontSize: 22, fontWeight: '900', marginTop: 10 },
  subtitle: { color: '#D3D5E2', fontSize: 12, marginTop: 4 },
  stats: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 17 },
  stat: { flex: 1, minHeight: 43, backgroundColor: '#FFFFFF1A', borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  statNumber: { color: colors.white, fontWeight: '900', fontSize: 14 },
  statLabel: { color: '#D3D5E2', fontSize: 10 },
  section: { backgroundColor: colors.white, borderRadius: 19, padding: 16, marginTop: 14, borderWidth: 1, borderColor: colors.line },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '900', marginBottom: 13 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '800', marginBottom: 7 },
  choiceRow: { flexDirection: 'row', gap: 7, marginBottom: 13 },
  option: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 37, paddingHorizontal: 5, borderRadius: 11, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line },
  optionActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  optionText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  optionTextActive: { color: colors.primary },
  goalRow: { flexDirection: 'row', gap: 8 },
  goal: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 11, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line },
  goalActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalText: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  goalTextActive: { color: colors.white },
  reminder: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 17 },
  reminderIcon: { width: 37, height: 37, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  reminderCopy: { flex: 1 },
  reminderTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  reminderText: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 2 },
  reminderTimes: { flexDirection: 'row', gap: 7, marginTop: 12 },
  reminderTime: { flex: 1, alignItems: 'center', paddingVertical: 9, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  reminderTimeActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  reminderTimeText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  reminderTimeTextActive: { color: colors.primary },
  respect: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.greenSoft, marginTop: 14 },
  respectCopy: { flex: 1 },
  respectTitle: { color: colors.green, fontSize: 12, fontWeight: '900' },
  respectText: { color: colors.ink, fontSize: 10, lineHeight: 15, marginTop: 4 },
});
