import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import { getPromoDetails } from './promos';
import type { PromoDetailForLabel, PromoForLabelItem } from '../../types/promos';

/** GET /promos/for-label?labelId= — requiere sesión label (Bearer). */
export async function fetchPromosForLabel(labelId: string): Promise<PromoForLabelItem[]> {
  const response = await apiClient(`/promos/for-label?labelId=${encodeURIComponent(labelId)}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las promos');
  }
  return response.json() as Promise<PromoForLabelItem[]>;
}

/**
 * GET /promos/:promoId — reutiliza `getPromoDetails` de Equipo 3 (mismo endpoint y manejo de
 * errores) en lugar de duplicar el fetch; solo se amplía el tipo de retorno con los campos del
 * DTO que el `PromoDetail` base no declara.
 */
export async function fetchPromoById(promoId: string): Promise<PromoDetailForLabel> {
  return getPromoDetails(promoId);
}
