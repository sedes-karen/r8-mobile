import { fetchLabelAnalytics, type LabelAnalyticsDateRange } from '../../services/api/analyticsApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/** Estadísticas del label (lectura) — GET /feedback/analytics, con rango de fechas opcional. */
export function useLabelAnalytics(range?: LabelAnalyticsDateRange) {
  return useAsyncData(() => fetchLabelAnalytics(range));
}
