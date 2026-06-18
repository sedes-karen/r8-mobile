import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { colors, spacing } from '../../constants/design';

interface ListRowCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export const ListRowCard = ({ title, subtitle, onPress }: ListRowCardProps) => {
  const content = (
    <View style={styles.infoContainer}>
      <AppText variant="body">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" muted style={styles.subtitle}>
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
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.85 },
      ]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});