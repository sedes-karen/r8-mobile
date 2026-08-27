import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoForLabelItem } from '../../types/promos';

/** GET /promos/for-label?labelId= — requiere sesión label (Bearer). */
export async function fetchPromosForLabel(labelId: string): Promise<PromoForLabelItem[]> {
  const response = await apiClient(`/promos/for-label?labelId=${encodeURIComponent(labelId)}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las promos');
  }
  return response.json() as Promise<PromoForLabelItem[]>;
}
