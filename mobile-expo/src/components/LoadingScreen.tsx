import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Skeleton } from './motion';
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
          <View style={styles.skeleton}>
            <Skeleton width={64} height={64} color={colors.line} />
            <Skeleton width="72%" height={16} color={colors.line} />
            <Skeleton width="48%" height={12} color={colors.line} />
          </View>
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
  skeleton: { width: '100%', maxWidth: 280, alignItems: 'center', gap: 12 },
  message: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 18 },
  retry: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 20 },
});
}

