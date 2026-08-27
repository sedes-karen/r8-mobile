import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

/** Estado de error de pantalla completa (no confundir con ErrorMessage, que es de un campo). */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg }}>
      <AppText variant="body-lg" color={colors.error.default} style={{ textAlign: 'center' }}>
        {message}
      </AppText>
      {onRetry ? <Button label="Reintentar" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}
