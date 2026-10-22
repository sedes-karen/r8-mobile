import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type FeedbackRowProps = {
  title: string;
  /** `null` = el receptor todavía no envió el formulario. */
  rating: number | null;
  comment: string | null;
  supported: boolean;
  willPlay: boolean | null;
  date: string;
};

/**
 * Fila de solo lectura de un feedback recibido. No reusa `RatingSelector` porque ese es un input
 * (botones tocables de 44px); acá el rating es un dato más de la fila.
 */
export function FeedbackRow({ title, rating, comment, supported, willPlay, date }: FeedbackRowProps) {
  const details = [`★ ${rating}/5`];
  if (supported) {
    details.push('Support');
  }
  if (willPlay) {
    details.push('Lo va a pasar');
  }

  return (
    <View
      style={{
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
        gap: spacing.xs,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
        <AppText variant="body-lg" style={{ flex: 1 }} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {date}
        </AppText>
      </View>

      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {rating === null ? 'Sin respuesta todavía' : details.join(' · ')}
      </AppText>

      {comment ? (
        <AppText variant="body-sm" numberOfLines={3}>
          {comment}
        </AppText>
      ) : null}
    </View>
  );
}
