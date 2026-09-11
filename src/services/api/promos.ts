
import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoInboxItem, PromoDetail } from '../../types/promo';

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
 * GET /promos/:id — detalle de una promo.
 */
export async function getPromoDetails(
  promoId: string,
): Promise<PromoDetail> {
  const response = await apiClient(`/promos/${promoId}`);

  if (!response.ok) {
    throw await readApiError(
      response,
      'No se pudo cargar el detalle de la promo',
    );
  }

  return response.json() as Promise<PromoDetail>;
}

