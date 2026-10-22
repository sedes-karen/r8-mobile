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
 * PUT /artists/me — requiere sesión artist (Bearer). Todos los campos del
 * UpdateArtistDto son opcionales: solo se envían los presentes en el input.
 * El request pide snake_case para los nombres (first_name, last_name,
 * artist_name) y camelCase para el resto (bio, urls), ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §4.
 */
export async function updateArtistProfile(
  input: UpdateArtistProfileInput,
): Promise<ArtistProfile> {
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar el perfil de artista');
  }
  return response.json() as Promise<ArtistProfile>;
}


export type CreateArtistImageUploadInput = {
  contentType: string;
};

export type CreateArtistImageUploadResponse = {
  uploadUrl: string;
  expiresIn: number;
  path: string;
};

export type ConfirmArtistImageInput = {
  path: string;
};

export async function createArtistImageUpload(
  data: CreateArtistImageUploadInput,
): Promise<CreateArtistImageUploadResponse> {
  const response = await apiClient('/artists/me/profile-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await readApiError(
      response,
      'No se pudo preparar la subida de la imagen',
    );
  }

  return response.json() as Promise<CreateArtistImageUploadResponse>;
}

export async function confirmArtistImage(
  data: ConfirmArtistImageInput,
): Promise<void> {
  const response = await apiClient('/artists/me/profile-image/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await readApiError(
      response,
      'No se pudo confirmar la imagen del artista',
    );
  }
}
