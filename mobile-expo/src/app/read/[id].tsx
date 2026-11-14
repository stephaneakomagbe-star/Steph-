import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoadingScreen, ReadScreen } from '../../components';
import { useFaithLingo } from '../../context/AppContext';
import { getLessonById } from '../../data/coursesData';
import { colors } from '../../theme';

export default function ReadRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isReady, storageError, retryStorage } = useFaithLingo();

  if (!isReady) return <LoadingScreen error={storageError} onRetry={retryStorage} />;

  const lesson = getLessonById(id ?? '');
  if (!lesson) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" />
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

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 28 },
  message: { color: colors.ink, fontSize: 16, textAlign: 'center' },
  back: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 16 },
});
