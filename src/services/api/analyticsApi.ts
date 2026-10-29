import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { LabelAnalytics } from '../../types/analytics';

export type LabelAnalyticsDateRange = {
  dateFrom: string;
  dateTo: string;
};

/**
 * GET /feedback/analytics — requiere sesión label (Bearer). Con `range` filtra el agregado por
 * fecha (siempre manda `dateFrom` y `dateTo` juntos); sin `range` trae el agregado completo.
 */
export async function fetchLabelAnalytics(range?: LabelAnalyticsDateRange): Promise<LabelAnalytics> {
  const query =
    range?.dateFrom && range.dateTo
      ? `?dateFrom=${encodeURIComponent(range.dateFrom)}&dateTo=${encodeURIComponent(range.dateTo)}`
      : '';
  const response = await apiClient(`/feedback/analytics${query}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las estadísticas');
  }
  return response.json() as Promise<LabelAnalytics>;
}
