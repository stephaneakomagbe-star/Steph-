import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, BookOpen, Check, Clock3, MoonStar, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseId, GoalMinutes, Level, Profile } from '../data/coursesData';
import { colors, spacing } from '../theme';

const COURSE_OPTIONS: { id: CourseId; title: string; detail: string; icon: string }[] = [
  { id: 'bible', title: 'Parcours Bible', detail: 'Récits, enseignements et repères bibliques', icon: '✦' },
  { id: 'coran', title: 'Parcours Coran', detail: 'Sourates, repères de lecture et vocabulaire', icon: '☾' },
  { id: 'decouverte', title: 'Découverte', detail: 'Explorer les deux traditions à son rythme', icon: '◎' },
];

const LEVELS: { id: Level; title: string; description: string }[] = [
  { id: 'debutant', title: 'Débutant', description: 'Je découvre les premiers repères' },
  { id: 'intermediaire', title: 'Intermédiaire', description: 'Je connais déjà quelques textes' },
  { id: 'avance', title: 'Avancé', description: 'Je souhaite approfondir mes lectures' },
];

const GOALS: { minutes: GoalMinutes; title: string; description: string }[] = [
  { minutes: 5, title: '5 min', description: 'Tout doux' },
  { minutes: 10, title: '10 min', description: 'Régulier' },
  { minutes: 15, title: '15 min', description: 'Approfondi' },
];

export function Onboarding({ onFinish }: { onFinish: (profile: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState<CourseId>('bible');
  const [level, setLevel] = useState<Level>('debutant');
  const [goal, setGoal] = useState<GoalMinutes>(5);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(19);

  function continueOnboarding() {
    if (step < 2) setStep(step + 1);
    else onFinish({ course, level, dailyGoal: goal, reminderEnabled, reminderHour, reminderMinute: 0, hideStreak: false });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.logo}><BookOpen size={22} color={colors.white} /></View>
          <Text style={styles.brand}>FaithLingo</Text>
          <View style={styles.stepCount}><Text style={styles.stepCountText}>{step + 1} / 3</Text></View>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((step + 1) / 3) * 100}%` }]} /></View>

        {step === 0 ? (
          <>
            <View style={styles.welcomePill}><Sparkles size={14} color={colors.gold} /><Text style={styles.pillText}>UN MOMENT POUR APPRENDRE</Text></View>
            <Text style={styles.title}>Quel parcours vous appelle ?</Text>
            <Text style={styles.subtitle}>Choisissez votre point de départ. Vous pourrez le modifier à tout moment.</Text>
            <View style={styles.options}>
              {COURSE_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.id}
                  selected={course === option.id}
                  onPress={() => setCourse(option.id)}
                  title={option.title}
                  description={option.detail}
                  icon={option.icon}
                />
              ))}
            </View>
            <View style={styles.respectNote}>
              <MoonStar size={18} color={colors.primary} />
              <Text style={styles.respectText}>Un espace de découverte bienveillant, où les sources et les traditions sont présentées avec respect.</Text>
            </View>
          </>
        ) : step === 1 ? (
          <>
            <View style={styles.welcomePill}><BookOpen size={14} color={colors.gold} /><Text style={styles.pillText}>VOTRE RYTHME</Text></View>
            <Text style={styles.title}>Où en êtes-vous ?</Text>
            <Text style={styles.subtitle}>Ce choix personnalise votre profil. Le premier module reste consacré aux repères essentiels.</Text>
            <View style={styles.options}>
              {LEVELS.map((option, index) => (
                <ChoiceCard
                  key={option.id}
                  selected={level === option.id}
                  onPress={() => setLevel(option.id)}
                  title={option.title}
                  description={option.description}
                  icon={['①', '②', '③'][index]}
                />
              ))}
            </View>
            <Text style={styles.optional}>Vous pourrez changer de niveau plus tard dans votre profil.</Text>
          </>
        ) : (
          <>
            <View style={styles.welcomePill}><Clock3 size={14} color={colors.gold} /><Text style={styles.pillText}>UN PETIT PAS CHAQUE JOUR</Text></View>
            <Text style={styles.title}>Quel objectif vous convient ?</Text>
            <Text style={styles.subtitle}>La régularité reste une invitation, jamais une obligation.</Text>
            <View style={styles.goalRow}>
              {GOALS.map((option) => (
                <Pressable
                  key={option.minutes}
                  accessibilityRole="button"
                  accessibilityState={{ selected: goal === option.minutes }}
                  onPress={() => setGoal(option.minutes)}
                  style={[styles.goalCard, goal === option.minutes && styles.selectedGoal]}
                >
                  <Text style={[styles.goalTitle, goal === option.minutes && styles.selectedText]}>{option.title}</Text>
                  <Text style={[styles.goalDetail, goal === option.minutes && styles.selectedText]}>{option.description}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.reminderCard}>
              <View style={styles.reminderIcon}><Clock3 size={19} color={colors.primary} /></View>
              <View style={styles.reminderCopy}>
                <Text style={styles.cardTitle}>Un rappel doux ?</Text>
                <Text style={styles.cardDescription}>Une notification locale, uniquement si vous l’autorisez.</Text>
              </View>
              {reminderEnabled ? (
                <View style={styles.reminderTimes}>
                  {[8, 13, 19].map((hour) => (
                    <Pressable key={hour} onPress={() => setReminderHour(hour)} style={[styles.timeChoice, reminderHour === hour && styles.selectedTime]}>
                      <Text style={[styles.timeText, reminderHour === hour && styles.selectedTimeText]}>{String(hour).padStart(2, '0')}:00</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: reminderEnabled }}
                onPress={() => setReminderEnabled(!reminderEnabled)}
                style={[styles.toggle, reminderEnabled && styles.toggleOn]}
              >
                <View style={[styles.toggleKnob, reminderEnabled && styles.toggleKnobOn]} />
              </Pressable>
            </View>
            <View style={styles.respectNote}>
              <MoonStar size={18} color={colors.primary} />
              <Text style={styles.respectText}>Aucune série perdue, aucun reproche. Faites une pause quand vous en avez besoin.</Text>
            </View>
          </>
        )}

        <Pressable accessibilityRole="button" onPress={continueOnboarding} style={styles.continueButton}>
          <Text style={styles.continueText}>{step === 2 ? 'Commencer mon parcours' : 'Continuer'}</Text>
          <ArrowRight size={19} color={colors.white} />
        </Pressable>
        {step > 0 ? <Text onPress={() => setStep(step - 1)} style={styles.back}>Retour</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function ChoiceCard({ selected, onPress, title, description, icon }: { selected: boolean; onPress: () => void; title: string; description: string; icon: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.choiceCard, selected && styles.selectedChoice]}>
      <View style={[styles.choiceIcon, selected && styles.choiceIconSelected]}><Text style={styles.choiceIconText}>{icon}</Text></View>
      <View style={styles.choiceCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <Check size={14} color={colors.white} /> : null}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: 15, paddingBottom: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  brand: { flex: 1, color: colors.ink, fontWeight: '900', fontSize: 19, letterSpacing: -0.5 },
  stepCount: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 15, backgroundColor: colors.primarySoft },
  stepCountText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  progressTrack: { height: 5, backgroundColor: colors.line, borderRadius: 8, marginTop: 20, marginBottom: 29, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 8 },
  welcomePill: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', borderRadius: 14, backgroundColor: colors.goldSoft, paddingHorizontal: 11, paddingVertical: 7 },
  pillText: { color: colors.warning, fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  title: { color: colors.ink, fontSize: 30, lineHeight: 36, letterSpacing: -0.8, fontWeight: '900', marginTop: 18 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 9, marginBottom: 21 },
  options: { gap: 11 },
  choiceCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  selectedChoice: { borderColor: colors.primary, backgroundColor: '#F8F7FF' },
  choiceIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  choiceIconSelected: { backgroundColor: colors.primarySoft },
  choiceIconText: { color: colors.primary, fontSize: 23, fontWeight: '700' },
  choiceCopy: { flex: 1, gap: 4 },
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  cardDescription: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  radio: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  respectNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 16, backgroundColor: colors.primarySoft, padding: 14, marginTop: 18 },
  respectText: { flex: 1, color: colors.primaryDark, fontSize: 12, lineHeight: 18 },
  optional: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 17 },
  goalRow: { flexDirection: 'row', gap: 9, marginBottom: 16 },
  goalCard: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderRadius: 17, borderWidth: 1.5, borderColor: colors.line, paddingVertical: 18, gap: 5 },
  selectedGoal: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalTitle: { color: colors.ink, fontSize: 19, fontWeight: '900' },
  goalDetail: { color: colors.muted, fontSize: 10 },
  selectedText: { color: colors.white },
  reminderCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.line },
  reminderIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.primarySoft },
  reminderCopy: { flex: 1, gap: 4 },
  toggle: { width: 46, height: 27, borderRadius: 15, padding: 3, backgroundColor: colors.line, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.primary },
  toggleKnob: { width: 21, height: 21, borderRadius: 11, backgroundColor: colors.white },
  toggleKnobOn: { alignSelf: 'flex-end' },
  reminderTimes: { flexDirection: 'row', gap: 8, marginTop: 10 },
  timeChoice: { flex: 1, alignItems: 'center', paddingVertical: 9, backgroundColor: colors.white, borderRadius: 11, borderWidth: 1, borderColor: colors.line },
  selectedTime: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  timeText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  selectedTimeText: { color: colors.primary },
  continueButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, marginTop: 22 },
  continueText: { color: colors.white, fontSize: 15, fontWeight: '900' },
  back: { textAlign: 'center', color: colors.muted, fontWeight: '700', paddingVertical: 16 },
});
