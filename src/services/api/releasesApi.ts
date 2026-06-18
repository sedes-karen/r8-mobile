import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type { ReleaseListItem } from '../../types/releases/release';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simula GET /releases del label autenticado (tenant por JWT en producción). */
export async function fetchReleases(): Promise<ReleaseListItem[]> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    // Descomentar en clase para practicar pantalla de error:
    // throw new Error('Error de red simulado');
    return [...MOCK_RELEASES];
  }

  const res = await fetch(`${apiConfig.baseUrl}/releases`, {
    headers: { Accept: 'application/json' },
    // Authorization: Bearer … en clase posterior
  });
  if (!res.ok) {
    throw new Error(`releases: ${res.status}`);
  }
  return res.json() as Promise<ReleaseListItem[]>;
}
