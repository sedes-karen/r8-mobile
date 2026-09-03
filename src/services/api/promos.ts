import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoInboxItem } from '../../types/promo';

/**
 * GET /promos/inbox — bandeja del receptor/artista. Usa sesión Bearer; el
 * `recipientToken?` queda preparado para el flujo guest sin loguear (Equipo 3).
 */
export async function getPromosInbox(recipientToken?: string): Promise<PromoInboxItem[]> {
  const response = await apiClient('/promos/inbox', { recipientToken });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar la bandeja de promos');
  }
  return response.json() as Promise<PromoInboxItem[]>;
}

/**
 * GET /promos/inbox/pending-count — cantidad de promos pendientes de atención.
 */
export async function getPromosPendingCount(recipientToken?: string): Promise<{ count: number }> {
  const response = await apiClient('/promos/inbox/pending-count', { recipientToken });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el contador de pendientes');
  }
  return response.json() as Promise<{ count: number }>;
}
