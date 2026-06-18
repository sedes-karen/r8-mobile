import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { spacing } from '../../constants/design';

type Props = { message?: string };

export function LoadingBlock({ message = 'Cargando…' }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" />
      <AppText muted style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, alignItems: 'center', gap: spacing.md },
  text: { marginTop: spacing.sm },
});
