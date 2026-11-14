import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LessonScreen, LoadingScreen } from '../../components';
import { useFaithLingo } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getLessonById } from '../../data/coursesData';
import { Palette, sheet } from '../../theme';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LessonRoute() {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id, review } = useLocalSearchParams<{ id: string; review?: string }>();
  const router = useRouter();
  const { data, isReady, storageError, retryStorage, loseHeart, finishLesson } = useFaithLingo();

  if (!isReady) return <LoadingScreen error={storageError} onRetry={retryStorage} />;
  if (!data.profile) return <View style={styles.center}><Text style={styles.message}>Choisissez d’abord votre parcours.</Text></View>;

  const lesson = getLessonById(id ?? '');
  if (!lesson) {
    return (
      <View style={styles.center}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <Text style={styles.message}>Cette leçon est introuvable.</Text>
        <Text accessibilityRole="button" onPress={() => router.replace('/')} style={styles.back}>Retour au parcours</Text>
      </View>
    );
  }

  return (
    <LessonScreen
      key={`${lesson.id}-${review === 'true' ? 'review' : 'lesson'}`}
      lesson={lesson}
      review={review === 'true' || data.completedLessonIds.includes(lesson.id)}
      hearts={data.hearts}
      onLoseHeart={loseHeart}
      onComplete={(result) => finishLesson(lesson, result)}
      onExit={() => router.canGoBack() ? router.back() : router.replace('/')}
      onDone={() => router.canGoBack() ? router.back() : router.replace('/')}
    />
  );
}

function createStyles(colors: Palette): any {
  return sheet({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 28 },
  message: { color: colors.ink, fontSize: 16, textAlign: 'center' },
  back: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 16 },
});
}

