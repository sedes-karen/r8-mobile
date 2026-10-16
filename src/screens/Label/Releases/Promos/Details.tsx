import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StaticScreenProps } from '@react-navigation/native';
import { colors, spacing } from '../../../../constants/design';
import { AppText } from '../../../../components/atoms/AppText';
import { LoadingBlock } from '../../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../../components/molecules/EmptyState';
import { ErrorState } from '../../../../components/molecules/ErrorState';
import { MetaDataRow } from '../../../../components/molecules/MetaDataRow';
import { usePromoDetail } from '../../../../features/promos/usePromoDetail';
import type { PromoStatus } from '../../../../types/promos';

type LabelReleasesPromosDetailsScreenProps = StaticScreenProps<{ promoId: string }>;

// Mismo mapa que PromoRow (molécula del listado); no se exporta de ahí porque es privada del
// componente. Si más pantallas lo necesitan, extraerlo a constants en un PR dedicado.
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
 * Detalle de una promo del label — solo lectura vía GET /promos/:promoId.
 * La edición, el envío manual y la cancelación quedan para las próximas tareas:
 * los flujos de escritura no están en esta pantalla.
 */
export function LabelReleasesPromosDetailsScreen({ route }: LabelReleasesPromosDetailsScreenProps) {
  const state = usePromoDetail(route.params.promoId);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const promo = state.data;
  const recipientLists = promo.recipientLists ?? [];
  const scheduledOn = formatDate(promo.scheduledAt);
  const sentOn = formatDate(promo.sentAt);
  const releaseSubtitle = [promo.release.artistName, promo.release.labelName].filter(Boolean).join(' · ');
  const hasStats = promo.feedbackCount !== undefined || promo.averageRating !== undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="headline-lg">{promo.release.title}</AppText>
          {releaseSubtitle ? (
            <AppText variant="body-sm" color={colors.onSurface.variant}>
              {releaseSubtitle}
            </AppText>
          ) : null}
        </View>

        {promo.errorMessage ? (
          <AppText variant="body-sm" color={colors.error.default}>
            {promo.errorMessage}
          </AppText>
        ) : null}

        <View>
          <MetaDataRow label="Estado" value={STATUS_LABEL[promo.status]} />
          <MetaDataRow label="Programada para" value={scheduledOn ?? 'Sin programar'} />
          <MetaDataRow label="Enviada el" value={sentOn ?? 'Sin enviar'} />
          {promo.release.catalogNumber ? (
            <MetaDataRow label="Catálogo" value={promo.release.catalogNumber} />
          ) : null}
          <MetaDataRow label="Tipo" value={promo.release.type} />
          {promo.release.releaseDate ? (
            <MetaDataRow label="Fecha de lanzamiento" value={formatReleaseDate(promo.release.releaseDate)} />
          ) : null}
          <MetaDataRow label="Creada el" value={formatDate(promo.createdAt) ?? '—'} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="title-md">Listas de destinatarios</AppText>
          {promo.useCuratedDb ? (
            <AppText variant="body-sm" color={colors.onSurface.variant}>
              Incluye la base curada de R8.
            </AppText>
          ) : null}
          {recipientLists.length === 0 ? (
            <EmptyState message="Esta promo no tiene listas de destinatarios." />
          ) : (
            recipientLists.map((list) => (
              <View
                key={list.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: spacing.xs,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.surface.border,
                }}
              >
                <AppText variant="body-lg">{list.name}</AppText>
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  {list.recipientCount === 1 ? '1 destinatario' : `${list.recipientCount} destinatarios`}
                </AppText>
              </View>
            ))
          )}
        </View>

        {hasStats ? (
          <View style={{ gap: spacing.sm }}>
            <AppText variant="title-md">Resultados</AppText>
            <MetaDataRow label="Feedback" value={promo.feedbackCount ?? 0} />
            <MetaDataRow
              label="Rating promedio"
              value={promo.averageRating != null ? String(promo.averageRating) : 'Sin rating'}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
