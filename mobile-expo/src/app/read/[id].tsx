import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoadingScreen, ReadScreen } from '../../components';
import { useFaithLingo } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getLessonById } from '../../data/coursesData';
import { Palette, sheet } from '../../theme';

export default function ReadRoute() {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isReady, storageError, retryStorage } = useFaithLingo();

  if (!isReady) return <LoadingScreen error={storageError} onRetry={retryStorage} />;

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
    <ReadScreen
      lesson={lesson}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/review'))}
      onPractice={() => router.replace({ pathname: '/lesson/[id]', params: { id: lesson.id, review: 'true' } })}
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
