import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { colors, spacing } from '../../constants/design';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export function ListRowCard({ title, subtitle, onPress }: Props) {
  const content = (
    <View style={styles.row}>
      <AppText variant="body-lg">{title}</AppText>
      {subtitle ? (
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface.container,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
});