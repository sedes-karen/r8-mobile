import { ActivityIndicator, View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from './AppText';

type LoadingBlockProps = {
  label?: string;
};

/** Estado de carga genérico — el mismo en las 6 pantallas de este batch, no hay motivo para
 * que cada una arme el suyo. */
export function LoadingBlock({ label }: LoadingBlockProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
      <ActivityIndicator color={colors.primary.default} />
      {label ? (
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}
