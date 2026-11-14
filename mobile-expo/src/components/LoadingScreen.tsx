import { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Palette, sheet } from '../theme';

export function LoadingScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.title}>Progression indisponible</Text>
          <Text style={styles.message}>{error}</Text>
          <Text accessibilityRole="button" onPress={onRetry} style={styles.retry}>Réessayer</Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>Préparation de votre parcours…</Text>
        </>
      )}
    </View>
  );
}

function createStyles(colors: Palette): any {
  return sheet({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: colors.background },
  title: { color: colors.ink, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 11 },
  retry: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 20 },
});
}

