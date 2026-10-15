import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoForLabelItem } from '../../types/promos';

export type CreatePromoBody = {
  releaseId: string;
  sendType: 'IMMEDIATE' | 'SCHEDULED';
  recipientListIds: string[];
  scheduledAt?: string;
};

/** GET /promos/for-label?labelId= — requiere sesión label (Bearer). */
export async function fetchPromosForLabel(labelId: string): Promise<PromoForLabelItem[]> {
  const response = await apiClient(`/promos/for-label?labelId=${encodeURIComponent(labelId)}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las promos');
  }
  return response.json() as Promise<PromoForLabelItem[]>;
}

/** POST /promos — crea una promo para un release y sus listas de destinatarios. */
export async function createPromo(body: CreatePromoBody): Promise<void> {
  const response = await apiClient('/promos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo crear la promo');
  }
}
