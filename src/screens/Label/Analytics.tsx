import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../../components/atoms/AppText';
import { LoadingBlock } from '../../components/atoms/LoadingBlock';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ErrorState } from '../../components/molecules/ErrorState';
import { ReleaseStatsRow } from '../../components/molecules/ReleaseStatsRow';
import { StatCard } from '../../components/molecules/StatCard';
import { useLabelAnalytics } from '../../features/analytics/useLabelAnalytics';

/** Estadísticas del label — solo lectura por naturaleza, no hay ningún botón de escritura acá. */
export function LabelAnalyticsScreen() {
  const state = useLabelAnalytics();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando estadísticas..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const { overall, byRelease } = state.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Analytics</AppText>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <StatCard label="Feedback total" value={String(overall.totalFeedback)} />
          <StatCard label="Rating promedio" value={overall.averageRating.toFixed(1)} />
          <StatCard label="Support rate" value={`${overall.supportRate}%`} />
          <StatCard label="Feedback reciente" value={String(overall.recentFeedback)} />
        </View>

        <View>
          <AppText variant="title-md" style={{ marginBottom: spacing.sm }}>
            Por release
          </AppText>
          {byRelease.length === 0 ? (
            <EmptyState message="Todavía no hay feedback para mostrar por release." />
          ) : (
            byRelease.map((release) => (
              <ReleaseStatsRow
                key={release.releaseId}
                title={release.releaseTitle}
                feedbackCount={release.feedbackCount}
                averageRating={release.averageRating}
                supportRate={release.supportRate}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
