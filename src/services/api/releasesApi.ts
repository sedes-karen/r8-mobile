import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type { ReleaseDetail, ReleaseListItem, ReleasesListResponse } from '../../types/releases';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /releases — requiere sesión label (Bearer + perfil revalidado).
 * Ejemplo canónico de request autenticado: no llama fetch suelto; usa apiClient.
 *
 * Las pantallas deben consumirlo vía hook (useReleases) en la práctica; este módulo no se invoca desde Login.
 */
export async function fetchReleases(): Promise<ReleaseListItem[]> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    return [...MOCK_RELEASES];
  }

  const response = await apiClient('/releases');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar releases');
  }

  const data = (await response.json()) as ReleasesListResponse | ReleaseListItem[];
  if (Array.isArray(data)) {
    return data;
  }
  return data.releases ?? [];
}

/**
 * GET /releases/:releaseId — detalle con `coverUrl` y `tracks[].audioUrl`.
 *
 * Para el artista receptor es la única fuente de las pistas: `GET /promos/:id` devuelve el
 * release slim, sin tracks (ver DTOs §6 y CLASE_03 §3.8). El `?token=` del flujo guest queda
 * disponible por si el equipo lo activa después.
 */
export async function fetchReleaseDetail(releaseId: string, recipientToken?: string): Promise<ReleaseDetail> {
  const response = await apiClient(`/releases/${encodeURIComponent(releaseId)}`, { recipientToken });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el release de la promo');
  }
  return response.json() as Promise<ReleaseDetail>;
}
