import { fetchArtistMe } from '../../services/api/artistApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/** Perfil de artista (lectura) — GET /artists/me. */
export function useArtistProfile() {
  return useAsyncData(fetchArtistMe);
}
