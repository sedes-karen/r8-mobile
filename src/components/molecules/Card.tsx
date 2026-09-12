import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { colors, spacing } from '../../constants/design';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export function Card({ title, subtitle, onPress }: Props) {
  const content = (
    <View style={styles.infoContainer}>
      <AppText variant="body-lg" numberOfLines={1}>
        {title}
      </AppText>

      {subtitle ? (
        <AppText variant="body-sm" color={colors.onSurface.variant} style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );

  if (!onPress) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.default,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardPressed: {
    backgroundColor: colors.surface.containerHigh,
  },
  infoContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});