import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Moon, Sun } from './icons';
import { useTheme } from '../context/ThemeContext';

export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, colors } = useTheme();
  const options = [
    { id: 'light' as const, label: 'Clair', Icon: Sun },
    { id: 'dark' as const, label: 'Sombre', Icon: Moon },
  ];

  return (
    <View style={[styles.row, { backgroundColor: colors.background, borderColor: colors.line }]}>
      {options.map(({ id, label, Icon }) => {
        const active = mode === id;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            onPress={() => setMode(id)}
            style={[styles.choice, active && { backgroundColor: colors.primary }]}
          >
            <Icon size={16} color={active ? colors.onPrimary : colors.muted} />
            {compact ? null : <Text style={[styles.label, { color: active ? colors.onPrimary : colors.ink }]}>{label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 3, gap: 3 },
  choice: { flex: 1, minHeight: 36, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 8 },
  label: { fontSize: 13, fontWeight: '800' },
});
