import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type {
  ReleaseDetail,
  ReleaseListItem,
  ReleaseType,
  ReleasesListResponse,
  UpdateReleaseBody,
} from '../../types/releases';

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

/**
 * PATCH /releases/:releaseId — solo campos editables del release (title, artist, type, releaseDate).
 * Requiere sesión label (Bearer + perfil revalidado).
 */
export async function updateRelease(
  releaseId: string,
  body: UpdateReleaseBody,
): Promise<ReleaseDetail> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    const found = MOCK_RELEASES.find((release) => release.id === releaseId);
    if (!found) {
      throw new Error('No se encontró el release');
    }
    return { ...found, ...body, status: 'CREATED', tracks: [] };
  }

  const response = await apiClient(`/releases/${releaseId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar el release');
  }

  return (await response.json()) as ReleaseDetail;
}
