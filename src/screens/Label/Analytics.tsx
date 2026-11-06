import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../../components/atoms/AppText';
import { Button } from '../../components/atoms/Button';
import { ErrorMessage } from '../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../components/atoms/LoadingBlock';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ErrorState } from '../../components/molecules/ErrorState';
import { LabeledInput } from '../../components/molecules/LabeledInput';
import { ReleaseStatsRow } from '../../components/molecules/ReleaseStatsRow';
import { StatCard } from '../../components/molecules/StatCard';
import { useLabelAnalytics } from '../../features/analytics/useLabelAnalytics';
import type { LabelAnalyticsDateRange } from '../../services/api/analyticsApi';

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

/** Valida formato YYYY-MM-DD y que la fecha exista (Date normaliza días inválidos, por eso se compara). */
function isValidDate(value: string): boolean {
  if (!DATE_FORMAT.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateRange(dateFrom: string, dateTo: string): string | null {
  if (!dateFrom || !dateTo) {
    return 'Completá ambas fechas (Desde y Hasta).';
  }
  if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
    return 'Usá el formato YYYY-MM-DD para ambas fechas.';
  }
  if (dateFrom > dateTo) {
    return 'La fecha "Desde" no puede ser posterior a la fecha "Hasta".';
  }
  return null;
}

/** Estadísticas del label — solo lectura por naturaleza, no hay ningún botón de escritura acá. */
export function LabelAnalyticsScreen() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [appliedRange, setAppliedRange] = useState<LabelAnalyticsDateRange | undefined>(undefined);
  const [validationError, setValidationError] = useState<string | null>(null);
  const state = useLabelAnalytics(appliedRange);

  const handleApply = () => {
    const from = dateFrom.trim();
    const to = dateTo.trim();
    const error = validateRange(from, to);
    setValidationError(error);
    if (error) return;

    setAppliedRange({ dateFrom: from, dateTo: to });
    state.reload();
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    setValidationError(null);
    setAppliedRange(undefined);
    state.reload();
  };

  const analytics = state.status === 'success' ? state.data : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Analytics</AppText>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="title-md">Filtrar por fecha</AppText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Desde"
                accessibilityLabel="Desde"
                value={dateFrom}
                onChangeText={setDateFrom}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={10}
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Hasta"
                accessibilityLabel="Hasta"
                value={dateTo}
                onChangeText={setDateTo}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={10}
              />
            </View>
          </View>
          {validationError ? <ErrorMessage message={validationError} /> : null}
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Aplicar" onPress={handleApply} />
            <Button label="Limpiar" variant="secondary" onPress={handleClear} />
          </View>
        </View>

        {state.status === 'loading' ? (
          <LoadingBlock label="Cargando estadísticas..." />
        ) : state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={state.reload} />
        ) : null}

        {analytics ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <StatCard label="Feedback total" value={String(analytics.overall.totalFeedback)} />
              <StatCard label="Rating promedio" value={analytics.overall.averageRating.toFixed(1)} />
              <StatCard label="Support rate" value={`${analytics.overall.supportRate}%`} />
              <StatCard label="Feedback reciente" value={String(analytics.overall.recentFeedback)} />
            </View>

            <View>
              <AppText variant="title-md" style={{ marginBottom: spacing.sm }}>
                Por release
              </AppText>
              {analytics.byRelease.length === 0 ? (
                <EmptyState message="Todavía no hay feedback para mostrar por release." />
              ) : (
                analytics.byRelease.map((release) => (
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
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
