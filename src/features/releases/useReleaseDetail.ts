import { fetchReleaseById } from '../../services/api/releasesApi';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { ReleaseDetail } from '../../types/releases';

/**
 * Detalle de un release (lectura).
 *
 * Asume que `releaseId` no cambia mientras la pantalla está montada: `useAsyncData`
 * solo vuelve a pedir datos vía `reload()`, no observa argumentos.
 */
export function useReleaseDetail(releaseId: string) {
  return useAsyncData<ReleaseDetail>(() => fetchReleaseById(releaseId));
}