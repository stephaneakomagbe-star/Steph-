import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, BookOpen, Check, Clock3, Flame, Heart, Lock, Sparkles } from 'lucide-react-native';
import { CourseId, getCourseLabel, getCourseLessons, getLevelLabel, GoalMinutes, Lesson, Level } from '../data/coursesData';
import { colors, spacing } from '../theme';

type Props = {
  course: CourseId;
  level: Level;
  dailyGoal: GoalMinutes;
  hearts: number;
  completedLessonIds: string[];
  onCourseChange: (course: CourseId) => void;
  onStart: (lesson: Lesson, review: boolean) => void;
  onRead: (lesson: Lesson) => void;
};

const COURSE_CHOICES: CourseId[] = ['bible', 'coran', 'decouverte'];

export function PathMap({ course, level, dailyGoal, hearts, completedLessonIds, onCourseChange, onStart, onRead }: Props) {
  const lessons = getCourseLessons(course);
  const completed = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const nextLesson = lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  const progress = lessons.length ? completed / lessons.length : 0;

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroPill}><Sparkles size={13} color={colors.gold} /><Text style={styles.heroPillText}>VOTRE ESPACE D’APPRENTISSAGE</Text></View>
          <View style={styles.streak}><Flame size={15} color={colors.orange} /><Text style={styles.streakText}>{dailyGoal} min / jour</Text></View>
        </View>
        <Text style={styles.heroTitle}>Un moment pour{'\n'}nourrir sa curiosité.</Text>
        <Text style={styles.heroBody}>Des leçons courtes, des textes sourcés et un rythme qui vous ressemble.</Text>
        <View style={styles.progressLine}>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
          <Text style={styles.progressLabel}>{completed}/{lessons.length} leçons</Text>
        </View>
        {nextLesson ? (
          hearts > 0 ? (
            <Pressable accessibilityRole="button" onPress={() => onStart(nextLesson, false)} style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Continuer · {nextLesson.title}</Text>
              <ArrowRight size={16} color={colors.ink} />
            </Pressable>
          ) : (
            <Pressable accessibilityRole="button" onPress={() => onRead(nextLesson)} style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Lire sans exercice · {nextLesson.title}</Text>
              <ArrowRight size={16} color={colors.ink} />
            </Pressable>
          )
        ) : (
          <View style={styles.heroDone}><Text style={styles.heroDoneText}>Module terminé. Relisez à votre rythme.</Text></View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Choisir un parcours</Text>
      <View style={styles.courseRow}>
        {COURSE_CHOICES.map((option) => (
          <Pressable key={option} onPress={() => onCourseChange(option)} style={[styles.courseChip, course === option && styles.activeCourseChip]}>
            <Text style={[styles.courseChipText, course === option && styles.activeCourseChipText]}>{getCourseLabel(option)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.moduleHeader}>
        <View>
          <Text style={styles.moduleEyebrow}>{getCourseLabel(course).toUpperCase()} · {getLevelLabel(level).toUpperCase()}</Text>
          <Text style={styles.moduleTitle}>Premiers repères</Text>
        </View>
        <View style={styles.moduleIcon}><BookOpen size={19} color={colors.primary} /></View>
      </View>
      <Text style={styles.moduleDescription}>Avancez dans l’ordre recommandé ; chaque étape s’ouvre après la précédente.</Text>

      <View style={styles.lessonPath}>
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isUnlocked = index === 0 || completedLessonIds.includes(lessons[index - 1].id);
          const isCurrent = !isCompleted && lesson.id === nextLesson?.id;
          const canPractice = isCompleted || (isUnlocked && hearts > 0);
          const canRead = isUnlocked && !canPractice;
          const available = canPractice || canRead;
          return (
            <View key={lesson.id} style={[styles.lessonRow, index % 2 === 0 ? styles.rowLeft : styles.rowRight]}>
              <Pressable
                disabled={!available}
                accessibilityRole="button"
                accessibilityState={{ disabled: !available }}
                onPress={() => (canPractice ? onStart(lesson, isCompleted) : onRead(lesson))}
                style={[styles.lessonCard, isCurrent && styles.currentCard, !isUnlocked && styles.lockedCard]}
              >
                <View style={[styles.node, isCompleted && styles.nodeDone, isCurrent && styles.nodeCurrent, !isUnlocked && styles.nodeLocked]}>
                  {isCompleted ? <Check size={19} color={colors.white} /> : !isUnlocked ? <Lock size={16} color={colors.locked} /> : <Text style={[styles.nodeNumber, isCurrent && styles.nodeNumberCurrent]}>{index + 1}</Text>}
                </View>
                <View style={styles.lessonCopy}>
                  <View style={styles.lessonMeta}>
                    <Text style={[styles.lessonEyebrow, isCurrent && styles.currentEyebrow]}>{isCompleted ? 'TERMINÉE' : isCurrent ? 'À SUIVRE' : isUnlocked ? 'LEÇON' : 'VERROUILLÉE'}</Text>
                    <View style={styles.duration}><Clock3 size={11} color={colors.muted} /><Text style={styles.durationText}>{lesson.minutes} min</Text></View>
                  </View>
                  <Text style={[styles.lessonTitle, !isUnlocked && styles.lockedText]}>{lesson.title}</Text>
                  <Text numberOfLines={2} style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                </View>
                {isCurrent ? <ArrowRight size={17} color={colors.primary} /> : null}
              </Pressable>
            </View>
          );
        })}
      </View>

      {hearts === 0 ? (
        <View style={styles.heartNotice}>
          <Heart size={18} color={colors.red} />
          <Text style={styles.heartText}>Vos cœurs se rechargent avec le temps. Vous pourrez reprendre une leçon bientôt, ou relire vos révisions librement.</Text>
        </View>
      ) : null}

      <View style={styles.sourceNote}>
        <BookOpen size={15} color={colors.muted} />
        <Text style={styles.sourceText}>Les activités sont des repères pédagogiques, pas des citations. Les références sont indiquées dans chaque leçon.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 28 },
  hero: { backgroundColor: colors.ink, borderRadius: 24, padding: 21, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF1A', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 13 },
  heroPillText: { color: '#F7E5C5', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { color: '#F4D59D', fontWeight: '800', fontSize: 11 },
  heroTitle: { color: colors.white, fontSize: 25, lineHeight: 30, fontWeight: '900', letterSpacing: -0.5, marginTop: 19 },
  heroBody: { color: '#D3D5E2', fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 285 },
  progressLine: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  progressTrack: { height: 6, flex: 1, borderRadius: 6, backgroundColor: '#FFFFFF2B', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#F0BC63', borderRadius: 6 },
  progressLabel: { color: colors.white, fontSize: 10, fontWeight: '800' },
  heroCta: { marginTop: 16, minHeight: 46, borderRadius: 14, backgroundColor: '#F0BC63', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 },
  heroCtaText: { color: colors.ink, fontSize: 13, fontWeight: '900', flexShrink: 1 },
  heroDone: { marginTop: 16, paddingVertical: 10 },
  heroDoneText: { color: '#F7E5C5', fontSize: 12, fontWeight: '700' },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '900', marginTop: 22, marginBottom: 11 },
  courseRow: { flexDirection: 'row', gap: 8 },
  courseChip: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 13, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  activeCourseChip: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  courseChipText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  activeCourseChipText: { color: colors.primary },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 },
  moduleEyebrow: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  moduleTitle: { color: colors.ink, fontSize: 21, fontWeight: '900', marginTop: 4 },
  moduleIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  moduleDescription: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  lessonPath: { marginTop: 13, gap: 10 },
  lessonRow: { width: '100%' },
  rowLeft: { alignItems: 'flex-start' },
  rowRight: { alignItems: 'flex-end' },
  lessonCard: { width: '93%', minHeight: 83, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  currentCard: { borderColor: colors.primary, backgroundColor: '#FBFAFF' },
  lockedCard: { opacity: 0.66 },
  node: { width: 37, height: 37, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.green },
  nodeCurrent: { backgroundColor: colors.primary },
  nodeLocked: { backgroundColor: colors.background },
  nodeNumber: { color: colors.primary, fontSize: 15, fontWeight: '900' },
  nodeNumberCurrent: { color: colors.white },
  lessonCopy: { flex: 1 },
  lessonMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  lessonEyebrow: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  currentEyebrow: { color: colors.primary },
  duration: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  durationText: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  lessonTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  lessonSubtitle: { color: colors.muted, fontSize: 10, marginTop: 3 },
  lockedText: { color: colors.muted },
  heartNotice: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 16, padding: 13, backgroundColor: colors.redSoft, borderRadius: 15 },
  heartText: { flex: 1, color: colors.ink, fontSize: 11, lineHeight: 17 },
  sourceNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 18, paddingHorizontal: 2 },
  sourceText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
});
