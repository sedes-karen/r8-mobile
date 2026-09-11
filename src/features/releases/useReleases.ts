import { fetchReleases } from '../../services/api/releasesApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/** Releases del label (lectura) — GET /releases (con mock local cuando EXPO_PUBLIC_USE_MOCK=true). */
export function useReleases() {
  return useAsyncData(fetchReleases);
}