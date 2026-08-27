import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type StatCardProps = {
  label: string;
  value: string;
};

/** Tarjeta chica de una métrica — label arriba, valor grande abajo. */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface.container,
        borderRadius: 0,
        padding: spacing.md,
        minWidth: 140,
        gap: spacing.xs,
      }}
    >
      <AppText variant="label-caps" color={colors.onSurface.variant}>
        {label}
      </AppText>
      <AppText variant="headline-lg">{value}</AppText>
    </View>
  );
}
