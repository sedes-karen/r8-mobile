import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type ProfileFieldProps = {
  label: string;
  value: string | null | undefined;
};

/**
 * Fila de perfil de solo lectura (label + valor). Genérica a propósito: la va a poder reusar
 * cualquier pantalla de perfil (label o artista) sin reescribirla.
 */
export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <View style={{ gap: spacing.xs / 2 }}>
      <AppText variant="label-caps" color={colors.onSurface.variant}>
        {label}
      </AppText>
      <AppText variant="body-lg">{value || '—'}</AppText>
    </View>
  );
}
