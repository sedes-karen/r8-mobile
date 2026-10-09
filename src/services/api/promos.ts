
import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoDetail, PromoInboxItem } from '../../types/promo';

/**
 * GET /promos/inbox — bandeja del receptor/artista.
 */
export async function getPromosInbox(
  recipientToken?: string,
): Promise<PromoInboxItem[]> {
  const response = await apiClient('/promos/inbox', { recipientToken });

  if (!response.ok) {
    throw await readApiError(
      response,
      'No se pudo cargar la bandeja de promos',
    );
  }

  return response.json() as Promise<PromoInboxItem[]>;
}

/**
 * GET /promos/inbox/pending-count — cantidad de promos pendientes.
 */
export async function getPromosPendingCount(
  recipientToken?: string,
): Promise<{ count: number }> {
  const response = await apiClient('/promos/inbox/pending-count', {
    recipientToken,
  });

  if (!response.ok) {
    throw await readApiError(
      response,
      'No se pudo cargar el contador de pendientes',
    );
  }

  return response.json() as Promise<{ count: number }>;
}

/**
 * GET /promos/:id — detalle de la promo, que la pantalla de feedback usa para el contexto
 * (release, estado, label). El release viene slim: los tracks hay que pedirlos con
 * `fetchReleaseDetail` usando el `release.id` que viene acá.
 */
export async function getPromoDetails(promoId: string, recipientToken?: string): Promise<PromoDetail> {
  const response = await apiClient(`/promos/${encodeURIComponent(promoId)}`, { recipientToken });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el detalle de la promo');
  }
  return response.json() as Promise<PromoDetail>;
}
