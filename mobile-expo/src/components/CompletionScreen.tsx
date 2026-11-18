import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, Sparkles } from './icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Lesson } from '../data/coursesData';
import { SoftPress, SuccessPop } from './motion';
import { Palette, sheet } from '../theme';

type Props = {
  lesson: Lesson;
  correct: number;
  total: number;
  xp: number;
  review: boolean;
  onDone: () => void;
};

export function CompletionScreen({ lesson, correct, total, xp, review, onDone }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const allCorrect = correct === total;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <SuccessPop style={styles.art}>
        <View style={styles.orbit} />
        <View style={styles.medal}><CheckCircle2 size={43} color={colors.onPrimary} /></View>
        <View style={[styles.sparkle, styles.sparkleOne]}><Sparkles size={18} color={colors.gold} /></View>
        <View style={[styles.sparkle, styles.sparkleTwo]}><BookOpen size={17} color={colors.primary} /></View>
      </SuccessPop>
      <Text style={styles.eyebrow}>{review ? 'TEMPS DE RÉVISION' : 'ÉTAPE TERMINÉE'}</Text>
      <Text style={styles.title}>{review ? 'Merci pour ce moment.' : allCorrect ? 'Très beau chemin !' : 'Un pas de plus.'}</Text>
      <Text style={styles.subtitle}>{lesson.title}</Text>
      <View style={styles.summary}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{correct}/{total}</Text>
          <Text style={styles.statLabel}>bonnes réponses</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{review ? '—' : `+${xp}`}</Text>
          <Text style={styles.statLabel}>{review ? 'sans score' : 'points XP'}</Text>
        </View>
      </View>
      <Text style={styles.encouragement}>
        {review
          ? 'La révision reste libre : revenez à ces notions aussi souvent que vous le souhaitez.'
          : 'Chaque leçon est une invitation à lire, réfléchir et avancer à votre rythme.'}
      </Text>
      <SoftPress accessibilityRole="button" onPress={onDone} style={styles.button}>
        <Text style={styles.buttonText}>{review ? 'Retour aux révisions' : 'Continuer mon parcours'}</Text>
        <ArrowRight size={18} color={colors.onAccent} />
      </SoftPress>
      <View style={styles.footnote}><RotateCcw size={13} color={colors.muted} /><Text style={styles.footnoteText}>Vous pouvez refaire cette leçon en mode révision, sans pénalité.</Text></View>
    </SafeAreaView>
  );
}

function createStyles(colors: Palette): any {
  return sheet({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 25, backgroundColor: colors.background },
  art: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  orbit: { position: 'absolute', width: 145, height: 145, borderRadius: 73, backgroundColor: colors.primarySoft },
  medal: { width: 88, height: 88, borderRadius: 31, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }] },
  sparkle: { position: 'absolute', width: 37, height: 37, borderRadius: 13, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  sparkleOne: { right: 1, top: 18 },
  sparkleTwo: { left: 3, bottom: 17 },
  eyebrow: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 6 },
  summary: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 19, paddingVertical: 17, marginTop: 24 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statNumber: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  divider: { width: 1, height: 35, backgroundColor: colors.line },
  encouragement: { color: colors.muted, textAlign: 'center', fontSize: 13, lineHeight: 20, marginTop: 18, maxWidth: 300 },
  button: { width: '100%', minHeight: 53, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, backgroundColor: colors.accent, marginTop: 24 },
  buttonText: { color: colors.onAccent, fontWeight: '800', fontSize: 15 },
  footnote: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 16, maxWidth: 290 },
  footnoteText: { color: colors.muted, fontSize: 13, lineHeight: 18, flex: 1 },
});
}
