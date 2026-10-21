import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StaticScreenProps } from '@react-navigation/native';
import { colors, spacing } from '../../../../constants/design';
import { AppText } from '../../../../components/atoms/AppText';
import { LoadingBlock } from '../../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../../components/molecules/ErrorState';
import { MetaDataRow } from '../../../../components/molecules/MetaDataRow';
import { usePromoDetail } from '../../../../features/promos/usePromoDetail';
import type { PromoStatus } from '../../../../types/promos';

type LabelReleasesPromosEditScreenProps = StaticScreenProps<{ promoId: string }>;

// Mismo mapa que PromoRow y Details (privados de cada pantalla: se duplica acá hasta que se
// extraiga a constants en un PR dedicado).
const STATUS_LABEL: Record<PromoStatus, string> = {
  DRAFT: 'Borrador',
  SCHEDULED: 'Programada',
  SENDING: 'Enviando',
  SENT: 'Enviada',
  CANCELLED: 'Cancelada',
  FAILED: 'Falló',
  EXPIRED: 'Expirada',
};

// Fechas ISO de promo (con hora): se muestra solo el día, igual que en el resto de pantallas.
function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

// La API manda la fecha de release como YYYY-MM-DD. No se pasa por `new Date()` porque en UTC-3
// mostraría el día anterior.
function formatReleaseDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Edición de una promo del label. Por ahora solo lectura (resumen de la promo); el formulario
 * de edición (sendType, scheduledAt, recipientListIds) y las acciones enviar/cancelar quedan
 * para los próximos pasos de esta tarea.
 */
export function LabelReleasesPromosEditScreen({ route }: LabelReleasesPromosEditScreenProps) {
  const state = usePromoDetail(route.params.promoId);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const promo = state.data;
  const releaseSubtitle = [promo.release.artistName, promo.release.labelName].filter(Boolean).join(' · ');
  const scheduledOn = formatDate(promo.scheduledAt);
  const sentOn = formatDate(promo.sentAt);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="headline-lg">Editar promo</AppText>
          <AppText variant="body-lg">{promo.release.title}</AppText>
          {releaseSubtitle ? (
            <AppText variant="body-sm" color={colors.onSurface.variant}>
              {releaseSubtitle}
            </AppText>
          ) : null}
        </View>

        <View>
          <MetaDataRow label="Estado" value={STATUS_LABEL[promo.status]} />
          <MetaDataRow label="Programada para" value={scheduledOn ?? 'Sin programar'} />
          <MetaDataRow label="Enviada el" value={sentOn ?? 'Sin enviar'} />
          {promo.release.catalogNumber ? (
            <MetaDataRow label="Catálogo" value={promo.release.catalogNumber} />
          ) : null}
          <MetaDataRow label="Tipo" value={promo.release.type ?? '—'} />
          {promo.release.releaseDate ? (
            <MetaDataRow label="Fecha de lanzamiento" value={formatReleaseDate(promo.release.releaseDate)} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
