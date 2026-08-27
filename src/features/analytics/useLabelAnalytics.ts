import { fetchLabelAnalytics } from '../../services/api/analyticsApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/** Estadísticas del label (lectura) — GET /feedback/analytics. */
export function useLabelAnalytics() {
  return useAsyncData(fetchLabelAnalytics);
}
