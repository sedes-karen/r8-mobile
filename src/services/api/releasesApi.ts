import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type { ReleaseDetail, ReleaseListItem } from '../../types/releases';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildApiUrl(path: string) {
  if (!apiConfig.baseUrl) {
    throw new Error('Falta configurar EXPO_PUBLIC_API_URL para consumir la API real.');
  }

  return `${apiConfig.baseUrl.replace(/\/$/, '')}${path}`;
}

function getJsonHeaders() {
  return {
    Accept: 'application/json',
    // Cuando Equipo 1 exponga el token, sumar aca: Authorization: `Bearer ${token}`.
  };
}

async function getErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: unknown; error?: unknown };

    if (typeof data.message === 'string') {
      return data.message;
    }

    if (typeof data.error === 'string') {
      return data.error;
    }
  } catch {
    // Si el backend no devuelve JSON, mantenemos un mensaje generico por status.
  }

  return `HTTP ${response.status}`;
}

async function requestJson<T>(path: string) {
  const response = await fetch(buildApiUrl(path), {
    headers: getJsonHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

function cloneRelease(release: ReleaseDetail): ReleaseDetail {
  return {
    ...release,
    tracks: release.tracks.map((track) => ({ ...track })),
    releaseLinks: release.releaseLinks?.map((link) => ({ ...link })),
  };
}

function toListItem(release: ReleaseDetail): ReleaseListItem {
  const {
    id,
    title,
    artist,
    type,
    releaseDate,
    catalogNumber,
    status,
    coverUrl,
  } = release;

  return {
    id,
    title,
    artist,
    type,
    releaseDate,
    catalogNumber,
    status,
    coverUrl,
  };
}

/** Obtiene los releases del label autenticado via GET /releases. */
export async function fetchReleases(): Promise<ReleaseListItem[]> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    return MOCK_RELEASES.map(toListItem);
  }

  return requestJson<ReleaseListItem[]>('/releases');
}

/** Obtiene el detalle de un release especifico via GET /releases/:releaseId. */
export async function fetchReleaseById(id: string): Promise<ReleaseDetail> {
  const releaseId = id.trim();

  if (!releaseId) {
    throw new Error('El id del release es obligatorio.');
  }

  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);

    const release = MOCK_RELEASES.find((item) => item.id === releaseId);

    if (!release) {
      throw new Error(`No se encontro el release con id ${releaseId}.`);
    }

    return cloneRelease(release);
  }

  return requestJson<ReleaseDetail>(`/releases/${encodeURIComponent(releaseId)}`);
}
