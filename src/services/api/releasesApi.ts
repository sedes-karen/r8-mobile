import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type { ReleaseListItem, ReleaseType, ReleasesListResponse } from '../../types/releases';

/** Subconjunto de CreateReleaseUnderLabelDto que usa la pantalla de alta (sin tracks ni archivos). */
export type CreateReleaseInput = {
  title: string;
  artist: string;
  type: ReleaseType;
  /** Formato `YYYY-MM-DD`; se omite si el usuario no la cargó. */
  releaseDate?: string;
};

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
 * POST /releases — crea el release bajo el label del JWT (el servidor asigna el label).
 * El release queda en DRAFT; artwork y audio se suben después con sus propios endpoints.
 */
export async function createRelease(input: CreateReleaseInput): Promise<ReleaseListItem> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    const created: ReleaseListItem = {
      id: `mock-${Date.now()}`,
      title: input.title,
      artist: input.artist,
      type: input.type,
      releaseDate: input.releaseDate ?? '',
    };
    // Se agrega al mock para que la lista lo muestre al volver, igual que con la API real.
    MOCK_RELEASES.push(created);
    return created;
  }

  const response = await apiClient('/releases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo crear el release');
  }

  return (await response.json()) as ReleaseListItem;
}
