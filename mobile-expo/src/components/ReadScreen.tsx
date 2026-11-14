import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, BookOpen, Clock3 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lesson } from '../data/coursesData';
import { colors, spacing } from '../theme';

type Props = {
  lesson: Lesson;
  onBack: () => void;
  onPractice: () => void;
};

export function ReadScreen({ lesson, onBack, onPractice }: Props) {
  const sources = [...new Set(lesson.questions.map((question) => question.source))];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={onBack} style={styles.closeButton}>
          <ArrowLeft size={20} color={colors.ink} />
        </Pressable>
        <Text style={styles.topTitle}>Lecture libre</Text>
        <View style={styles.topSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>{lesson.course === 'bible' ? 'BIBLE' : 'CORAN'} · SANS SCORE</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>
        <View style={styles.meta}>
          <Clock3 size={13} color={colors.muted} />
          <Text style={styles.metaText}>{lesson.minutes} min · {lesson.module}</Text>
        </View>
        <View style={styles.note}>
          <BookOpen size={16} color={colors.primary} />
          <Text style={styles.noteText}>Ici, on lit des repères pédagogiques. Ce n’est ni une citation sacrée ni une interprétation unique.</Text>
        </View>
        {lesson.questions.map((question, index) => (
          <View key={question.id} style={styles.card}>
            <Text style={styles.cardLabel}>Repère {index + 1}</Text>
            <Text style={styles.cardTitle}>{question.prompt}</Text>
            <Text style={styles.cardBody}>{question.explanation}</Text>
            <Text style={styles.source}>{question.source}</Text>
          </View>
        ))}
        <View style={styles.sources}>
          <Text style={styles.sourcesTitle}>Sources à consulter</Text>
          {sources.map((source) => (
            <Text key={source} style={styles.sourceLine}>• {source}</Text>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <Pressable accessibilityRole="button" onPress={onPractice} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Revoir en exercices, sans pénalité</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingTop: 10, paddingBottom: 12 },
  closeButton: { width: 35, height: 35, borderRadius: 13, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  topSpacer: { width: 35 },
  body: { paddingHorizontal: spacing.md, paddingBottom: 24 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.9, marginTop: 4 },
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '900', marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 7 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  metaText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  note: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 16, padding: 13, backgroundColor: colors.primarySoft, borderRadius: 15 },
  noteText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  card: { marginTop: 12, padding: 16, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line },
  cardLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  cardTitle: { color: colors.ink, fontSize: 15, lineHeight: 22, fontWeight: '800', marginTop: 7 },
  cardBody: { color: colors.ink, fontSize: 13, lineHeight: 20, marginTop: 8 },
  source: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 8, fontStyle: 'italic' },
  sources: { marginTop: 18, marginBottom: 8 },
  sourcesTitle: { color: colors.ink, fontSize: 14, fontWeight: '900', marginBottom: 8 },
  sourceLine: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 4 },
  bottom: { paddingHorizontal: spacing.md, paddingVertical: 12, paddingBottom: 24, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
  primaryButton: { minHeight: 52, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontWeight: '900', fontSize: 14 },
});
