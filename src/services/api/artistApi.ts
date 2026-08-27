import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { ArtistProfile } from '../../types/artist';

/**
 * GET /artists/me — requiere sesión artist (Bearer). Ya trae profileImageUrl resuelto, no
 * hace falta el call aparte a /artists/me/profile-image para una pantalla de solo lectura.
 */
export async function fetchArtistMe(): Promise<ArtistProfile> {
  const response = await apiClient('/artists/me');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el perfil de artista');
  }
  return response.json() as Promise<ArtistProfile>;
}
