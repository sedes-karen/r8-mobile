import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { ArtistProfile, UpdateArtistProfileInput } from '../../types/artist';

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

/**
 * PUT /artists/me — recibe los campos de la app en camelCase y convierte los nombres
 * al formato del UpdateArtistDto (ver docs/DTOs_Y_CUERPOS_HTTP.md §4).
 * Los campos undefined se omiten al serializar; null se conserva tal como lo envía el formulario.
 */
export async function updateArtistProfile(input: UpdateArtistProfileInput): Promise<ArtistProfile> {
  const body = {
    first_name: input.firstName,
    last_name: input.lastName,
    artist_name: input.artistName,
    bio: input.bio,
    instagramUrl: input.instagramUrl,
    soundcloudUrl: input.soundcloudUrl,
    bandcampUrl: input.bandcampUrl,
    twitterUrl: input.twitterUrl,
  };

  const response = await apiClient('/artists/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar el perfil de artista');
  }
  return response.json() as Promise<ArtistProfile>;
}
