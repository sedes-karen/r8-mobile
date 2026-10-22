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

/**
 * Body de PUT /artists/me (UpdateArtistDto, ver docs/DTOs_Y_CUERPOS_HTTP.md §4). Es un update
 * parcial: los campos omitidos quedan sin tocar. Ojo: los nombres van en snake_case acá, a
 * diferencia de la respuesta camelCase de GET /artists/me (son shapes distintos).
 */
export type UpdateArtistProfileInput = {
  first_name?: string;
  last_name?: string;
  artist_name?: string;
  bio?: string | null;
  instagramUrl?: string | null;
  soundcloudUrl?: string | null;
  bandcampUrl?: string | null;
  twitterUrl?: string | null;
};

/** PUT /artists/me — persiste lo que se edita en el formulario de perfil del artista. */
export async function updateArtistMe(input: UpdateArtistProfileInput): Promise<ArtistProfile> {
  const response = await apiClient('/artists/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar el perfil de artista');
  }
  return response.json() as Promise<ArtistProfile>;
}
