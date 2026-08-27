import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { LabelAnalytics } from '../../types/analytics';

/**
 * GET /feedback/analytics — requiere sesión label (Bearer). Sin dateFrom/dateTo: trae el
 * agregado completo (el filtro por rango de fechas queda fuera del alcance de esta pantalla).
 */
export async function fetchLabelAnalytics(): Promise<LabelAnalytics> {
  const response = await apiClient('/feedback/analytics');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las estadísticas');
  }
  return response.json() as Promise<LabelAnalytics>;
}
