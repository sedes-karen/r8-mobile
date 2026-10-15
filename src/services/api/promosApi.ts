import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoDetail, PromoForLabelItem } from '../../types/promos';

/** GET /promos/for-label?labelId= — requiere sesión label (Bearer). */
export async function fetchPromosForLabel(labelId: string): Promise<PromoForLabelItem[]> {
  const response = await apiClient(`/promos/for-label?labelId=${encodeURIComponent(labelId)}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las promos');
  }
  return response.json() as Promise<PromoForLabelItem[]>;
}

/** GET /promos/:promoId — detalle slim de una promo (lectura label vía Bearer). */
export async function fetchPromoById(promoId: string): Promise<PromoDetail> {
  const response = await apiClient(`/promos/${encodeURIComponent(promoId)}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el detalle de la promo');
  }
  return response.json() as Promise<PromoDetail>;
}
