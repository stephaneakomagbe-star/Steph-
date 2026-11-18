import { useMemo } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { ArrowRight, BookOpen, Check, Clock3, RotateCcw } from './icons';
import { useTheme } from '../context/ThemeContext';
import { Lesson } from '../data/coursesData';
import { Palette, sheet, spacing } from '../theme';

type Props = {
  lessons: Lesson[];
  completedLessonIds: string[];
  onRead: (lesson: Lesson) => void;
  onReview: (lesson: Lesson) => void;
};

export function ReviewScreen({ lessons, completedLessonIds, onRead, onReview }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completedLessons = lessons.filter((lesson) => completedLessonIds.includes(lesson.id));
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <View style={styles.icon}><RotateCcw size={21} color={colors.primary} /></View>
        <Text style={styles.title}>Revenir, sans pression.</Text>
        <Text style={styles.subtitle}>Relisez les notions déjà découvertes. Les révisions n’utilisent pas de cœurs et ne donnent pas de score.</Text>
      </View>
      <Text style={styles.sectionTitle}>Leçons à revoir <Text style={styles.count}>{completedLessons.length}</Text></Text>
      {completedLessons.length ? completedLessons.map((lesson) => (
        <View key={lesson.id} style={styles.lesson}>
          <View style={styles.lessonIcon}><BookOpen size={18} color={colors.green} /></View>
          <View style={styles.lessonCopy}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonMeta}><Clock3 size={11} color={colors.muted} /> {lesson.minutes} min · terminée</Text>
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" onPress={() => onRead(lesson)} style={styles.action}>
                <Text style={styles.actionText}>Lire</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => onReview(lesson)} style={[styles.action, styles.actionPrimary]}>
                <Text style={styles.actionPrimaryText}>Exercices</Text>
                <ArrowRight size={13} color={colors.onAccent} />
              </Pressable>
            </View>
          </View>
        </View>
      )) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><BookOpen size={24} color={colors.primary} /></View>
          <Text style={styles.emptyTitle}>Votre espace de révision vous attend</Text>
          <Text style={styles.emptyText}>Terminez une première leçon pour la retrouver ici. Vous pourrez alors revoir ses notions à votre rythme.</Text>
        </View>
      )}
      <View style={styles.note}>
        <Check size={15} color={colors.green} />
        <Text style={styles.noteText}>Pas de compte à rebours, pas de cœurs perdus, pas de série remise en jeu.</Text>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: Palette): any {
  return sheet({
  scroll: { padding: spacing.md, paddingBottom: 28 },
  hero: { padding: 20, borderRadius: 22, backgroundColor: colors.primarySoft },
  icon: { width: 43, height: 43, borderRadius: 15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800', marginTop: 16 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 7 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '900', marginTop: 22, marginBottom: 11 },
  count: { color: colors.primary, fontSize: 13 },
  lesson: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 13, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, marginBottom: 9 },
  lessonIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.greenSoft, marginTop: 2 },
  lessonCopy: { flex: 1, gap: 5 },
  lessonTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  lessonMeta: { color: colors.muted, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  action: { minHeight: 32, paddingHorizontal: 11, borderRadius: 10, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  actionPrimary: { flexDirection: 'row', gap: 5, backgroundColor: colors.accent, borderColor: colors.accent },
  actionPrimaryText: { color: colors.onAccent, fontSize: 13, fontWeight: '800' },
  empty: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 28, borderRadius: 19, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.ink, fontSize: 15, fontWeight: '900', textAlign: 'center', marginTop: 14 },
  emptyText: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 7 },
  note: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 14, padding: 13, borderRadius: 14, backgroundColor: colors.greenSoft },
  noteText: { flex: 1, color: colors.green, fontSize: 13, lineHeight: 18, fontWeight: '700' },
});
}

