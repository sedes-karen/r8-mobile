import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import type { PromoForLabelItem } from '../../types/promos';

const STATUS_LABEL: Record<PromoForLabelItem['status'], string> = {
  DRAFT: 'Borrador',
  SCHEDULED: 'Programada',
  SENDING: 'Enviando',
  SENT: 'Enviada',
  CANCELLED: 'Cancelada',
  FAILED: 'Falló',
  EXPIRED: 'Expirada',
};

type PromoRowProps = {
  promo: PromoForLabelItem;
};

/** Fila de una promo en el listado del label: release, estado, y fecha de envío/programación. */
export function PromoRow({ promo }: PromoRowProps) {
  const date = promo.sentAt ?? promo.scheduledAt;

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
      <View style={{ flex: 1 }}>
        <AppText variant="body-lg" numberOfLines={1}>
          {promo.release.title}
        </AppText>
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {STATUS_LABEL[promo.status]}
          {date ? ` · ${new Date(date).toLocaleDateString()}` : ''}
        </AppText>
      </View>
      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {promo.feedbackCount} feedback
      </AppText>
    </View>
  );
}
