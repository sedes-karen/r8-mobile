// Servicios HTTP para la pantalla de detalle de promo (Equipo 3).
// Soportan sesión Bearer (artista autenticado) y recipientToken (guest vía ?token=).

import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { PromoDetail } from '../../types/promos/detail';
import type { ReleaseDetail } from '../../types/releases';

/** GET /promos/:id — promo slim sin tracks; para audio ver getReleaseWithTracks. */
export async function getPromoDetail(
  promoId: string,
  recipientToken?: string
): Promise<PromoDetail> {
  const response = await apiClient(`/promos/${promoId}`, { recipientToken });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el detalle de la promo');
  }
  return response.json() as Promise<PromoDetail>;
}

/** GET /releases/:releaseId — release completo con tracks y audioUrls firmadas. */
export async function getReleaseWithTracks(
  releaseId: string,
  recipientToken?: string
): Promise<ReleaseDetail> {
  const response = await apiClient(`/releases/${releaseId}`, { recipientToken });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el release');
  }
  return response.json() as Promise<ReleaseDetail>;
}

/** POST /promos/:id/dismiss — saca la promo de la bandeja del receptor. */
export async function dismissPromo(
  promoId: string,
  recipientToken?: string
): Promise<void> {
  const response = await apiClient(`/promos/${promoId}/dismiss`, {
    method: 'POST',
    recipientToken,
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo descartar la promo');
  }
}
