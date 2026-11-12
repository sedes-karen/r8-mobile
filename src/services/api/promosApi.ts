import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import { getPromoDetails } from './promos';
import type { PromoDetailForLabel, PromoForLabelItem } from '../../types/promos';
import type { UpdatePromoBody } from '../../types/promos/updatePromoBody';

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

/**
 * PATCH /promos/:id — edita los campos editables de una promo con `UpdatePromoBody` (todos
 * opcionales). La API admite editar "típicamente solo DRAFT" (docs/REFERENCIA_API_R8.md §3);
 * los docs no traen tabla de transiciones, así que qué estados acepta lo decide la pantalla.
 * No se usa el body de la respuesta: alcanza con que el servidor responda OK.
 */
export async function updatePromo(promoId: string, body: UpdatePromoBody): Promise<void> {
  const response = await apiClient(`/promos/${encodeURIComponent(promoId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar la promo');
  }
}


export async function sendPromo(promoId: string): Promise<void> {
  const response = await apiClient(`/promos/${encodeURIComponent(promoId)}/send`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo enviar la promo');
  }
}

export async function cancelPromo(promoId: string): Promise<void> {
  const response = await apiClient(`/promos/${encodeURIComponent(promoId)}/cancel`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cancelar la promo');
  }
}
