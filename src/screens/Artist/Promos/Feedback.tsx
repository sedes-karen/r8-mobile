import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LinkButton } from '../../../components/atoms/LinkButton';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { MetaDataRow } from '../../../components/molecules/MetaDataRow';
import { SuccessNotice } from '../../../components/molecules/SuccessNotice';
import { TrackStatsRow } from '../../../components/molecules/TrackStatsRow';
import { FeedbackForm } from '../../../components/organisms/FeedbackForm';
import { useRecipientFeedback, EMPTY_TRACK_STATS } from '../../../features/feedback/useRecipientFeedback';
import { COMMENT_MAX_LENGTH, useFeedbackForm } from '../../../features/feedback/useFeedbackForm';
import type { PromoStatus } from '../../../types/promo';

/**
 * Mismos textos que usa `PromoRow` (lado label) a propósito: lo ideal sería extraer el mapa a
 * una molécula compartida, pero eso implica tocar en este PR un archivo de otro equipo.
 */
const STATUS_LABEL: Record<PromoStatus, string> = {
  DRAFT: 'Borrador',
  SCHEDULED: 'Programada',
  SENDING: 'Enviando',
  SENT: 'Enviada',
  CANCELLED: 'Cancelada',
  FAILED: 'Falló',
  EXPIRED: 'Expirada',
};

/**
 * Props deliberadamente flojas: el tipo de `route` lo define la navegación estática y las
 * pantallas no reciben params declarados, así que el `promoId` se valida en runtime en vez de
 * asumir que siempre llegó.
 */
type FeedbackScreenProps = {
  route?: { params?: { promoId?: string } };
};

/**
 * Formulario de retroalimentación de una promo (Artist > Promos > Feedback).
 *
 * El flujo tiene un tope que no es de esta pantalla: la API solo guarda el formulario si el
 * `rating` del feedback estaba en `null` (primera entrega). Por eso el ensure se corre al cargar
 * y, si ya hubo un envío, la pantalla muestra lo enviado en solo lectura en vez de un formulario
 * que el servidor iba a ignorar.
 */
export function ArtistPromosFeedbackScreen({ route }: FeedbackScreenProps) {
  const promoId = route?.params?.promoId;
  const data = useRecipientFeedback(promoId);
  const form = useFeedbackForm();

  if (!promoId) {
    return <ErrorState message="No pudimos identificar la promo de este formulario" />;
  }

  if (data.status === 'loading') {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (data.status === 'error') {
    return <ErrorState message={data.message} onRetry={data.reload} />;
  }

  // Recién se desestructura `data.data` porque el narrowing del status no alcanza para las
  // propiedades sueltas que el hook expone (`promo`, `feedback`), que están tipadas como nulleables.
  const { promo, tracks, feedback } = data.data;
  // Después de enviar, la entidad que devuelve el PATCH manda: el `feedback` del ensure todavía
  // dice `rating: null` porque es una copia de antes del envío.
  const currentFeedback = form.submitted ?? feedback;
  const canSubmit = data.canSubmitFeedback && !form.submitted;
  const statsFor = (trackId: string) => data.trackStats?.[trackId] ?? EMPTY_TRACK_STATS;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Primera pantalla del proyecto con formulario largo: sin esto, en Android el teclado
          tapa el botón de envío y los últimos campos. */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? spacing.xl : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppText variant="headline-lg">Feedback</AppText>

          <View style={styles.section}>
            <MetaDataRow label="Release" value={promo.release.title} />
            <MetaDataRow label="Artista" value={promo.release.artistName ?? '—'} />
            <MetaDataRow label="Label" value={promo.release.labelName ?? '—'} />
            <MetaDataRow label="Estado" value={STATUS_LABEL[promo.status] ?? promo.status} />
          </View>

          {canSubmit ? (
            <FeedbackForm
              values={form.values}
              errors={form.errors}
              submitting={form.submitting}
              error={form.error}
              commentMaxLength={COMMENT_MAX_LENGTH}
              onChangeRating={form.setRating}
              onChangeComment={form.setComment}
              onChangeWillPlay={form.setWillPlay}
              onChangeSupported={form.setSupported}
              onSubmit={() => form.submit(currentFeedback.releaseId, currentFeedback.id)}
            />
          ) : (
            <View style={styles.section}>
              {form.submitted ? (
                <SuccessNotice
                  title="Feedback enviado"
                  message="Gracias por responder. El label ya puede leerlo."
                />
              ) : (
                <SuccessNotice
                  title="Ya enviaste tu feedback"
                  message="La API solo guarda una respuesta por promo, así que esto ya no se edita."
                />
              )}
              <MetaDataRow label="Calificación" value={currentFeedback.rating ?? '—'} />
              <MetaDataRow label="Comentario" value={currentFeedback.comment ?? '—'} />
              <MetaDataRow
                label="En playlist"
                value={currentFeedback.willPlay === null ? '—' : currentFeedback.willPlay ? 'Sí' : 'No'}
              />
              <MetaDataRow label="Apoya el release" value={currentFeedback.supported ? 'Sí' : 'No'} />
            </View>
          )}

          <View style={styles.section}>
            <AppText variant="title-md">Consumo de las pistas</AppText>
            {data.statsError ? <ErrorMessage message={data.statsError} /> : null}
            {tracks.length === 0 ? (
              <EmptyState message="Este release no tiene pistas cargadas." />
            ) : (
              tracks.map((track) => (
                <TrackStatsRow
                  key={track.id}
                  track={track}
                  stats={statsFor(track.id)}
                  pendingAction={
                    data.statsPending?.trackId === track.id ? data.statsPending.action : null
                  }
                  onPlay={() => data.registerPlay(track.id)}
                  onToggleLike={() => data.toggleLike(track.id)}
                  onDownload={() => data.registerDownload(track.id)}
                />
              ))
            )}
          </View>

          <LinkButton screen="Player" params={{}}>
            <AppText variant="body-lg" color={colors.primary.default}>
              Volver a la bandeja
            </AppText>
          </LinkButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
});
