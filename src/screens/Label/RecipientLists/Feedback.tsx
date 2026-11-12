import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { FeedbackRow } from '../../../components/molecules/FeedbackRow';
import { StatCard } from '../../../components/molecules/StatCard';
import { useLabelFeedback } from '../../../features/feedback/useLabelFeedback';

/** Feedback que recibió el label: métricas arriba y listado abajo. Solo lectura. */
export function LabelRecipientListsFeedbackScreen() {
  const state = useLabelFeedback();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando feedback..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const { list, pending, analytics } = state.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Feedback</AppText>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <StatCard label="Feedback total" value={String(list.total)} />
          <StatCard label="Pendientes" value={String(pending.count)} />
          <StatCard label="Rating promedio" value={analytics.overall.averageRating.toFixed(1)} />
          <StatCard label="Support rate" value={`${analytics.overall.supportRate}%`} />
        </View>

        <View>
          <AppText variant="title-md" style={{ marginBottom: spacing.sm }}>
            Recibido
          </AppText>
          {list.feedback.length === 0 ? (
            <EmptyState message="Todavía no recibiste feedback de ninguna promo." />
          ) : (
            list.feedback.map((item) => (
              <FeedbackRow
                key={item.id}
                title={item.release?.title ?? 'Release sin título'}
                rating={item.rating}
                comment={item.comment}
                supported={item.supported}
                willPlay={item.willPlay}
                date={new Date(item.createdAt).toLocaleDateString()}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
