import { fetchLabelAnalytics } from '../../services/api/analyticsApi';
import { fetchLabelFeedback, fetchPendingFeedbackCount } from '../../services/api/feedbackApi';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { LabelAnalytics } from '../../types/analytics';
import type { LabelFeedbackListResponse, PendingFeedbackCount } from '../../types/feedback/labelFeedback';

export type LabelFeedbackData = {
  list: LabelFeedbackListResponse;
  pending: PendingFeedbackCount;
  analytics: LabelAnalytics;
};

/**
 * Feedback recibido por el label + métricas (lectura). Son tres endpoints independientes, así que
 * van en paralelo. Analytics se pide sin rango de fechas para que el promedio y el support rate
 * se calculen sobre el mismo universo que el `total` del listado.
 */
export function useLabelFeedback() {
  return useAsyncData<LabelFeedbackData>(async () => {
    const [list, pending, analytics] = await Promise.all([
      fetchLabelFeedback(),
      fetchPendingFeedbackCount(),
      fetchLabelAnalytics(),
    ]);
    return { list, pending, analytics };
  });
}
