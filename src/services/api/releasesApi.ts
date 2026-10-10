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
 * GET /releases/:releaseId — detalle de un release (lectura).
 */
export async function fetchReleaseById(releaseId: string): Promise<ReleaseDetail> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    const base = MOCK_RELEASES.find((release) => release.id === releaseId);
    if (!base) {
      throw new Error('No se encontró el release');
    }
    return {
      ...base,
      status: 'CREATED',
      catalogNumber: null,
      coverUrl: null,
      tracks: [
        { id: 'mock-1', title: 'Intro Demo', trackNumber: 1, duration: 183 },
        { id: 'mock-2', title: 'Main Mix', trackNumber: 2, duration: 326 },
      ],
    };
  }

  const response = await apiClient(`/releases/${releaseId}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el release');
  }

  return (await response.json()) as ReleaseDetail;
}