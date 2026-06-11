import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { spacing } from '../../constants/design';

type Props = { title: string; description?: string };

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{title}</AppText>
      {description ? (
        <AppText muted style={styles.desc}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg },
  desc: { marginTop: spacing.sm },
});
