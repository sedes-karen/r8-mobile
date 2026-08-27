import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type ReleaseStatsRowProps = {
  title: string;
  feedbackCount: number;
  averageRating: number;
  supportRate: number;
};

/** Fila de estadísticas por release, dentro de la pantalla de Analytics. */
export function ReleaseStatsRow({ title, feedbackCount, averageRating, supportRate }: ReleaseStatsRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
      }}
    >
      <AppText variant="body-lg" style={{ flex: 1 }} numberOfLines={1}>
        {title}
      </AppText>
      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {feedbackCount} feedback · ★{averageRating.toFixed(1)} · {supportRate}% support
      </AppText>
    </View>
  );
}
