import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type EmptyStateProps = {
  message: string;
};

/** "Sin datos todavía" — distinto de ErrorState, no es una falla, es una lista vacía real. */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
      <AppText variant="body-lg" color={colors.onSurface.variant} style={{ textAlign: 'center' }}>
        {message}
      </AppText>
    </View>
  );
}
