import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { spacing } from '../../constants/design';

type Props = { message: string; onRetry?: () => void };

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">Algo salió mal</AppText>
      <AppText muted style={styles.msg}>
        {message}
      </AppText>
      {onRetry ? (
        <PrimaryButton title="Reintentar" onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.md },
  msg: { marginBottom: spacing.sm },
});
