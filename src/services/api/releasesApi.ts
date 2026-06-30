import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type { ReleaseListItem, ReleasesListResponse } from '../../types/releases';

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
