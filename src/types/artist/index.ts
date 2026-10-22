/**
 * Respuesta real de GET /artists/me — verificado contra stage 2026-08-27 (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §4). CamelCase, no confundir con el body de
 * Create/UpdateArtistDto (snake_case, es de request).
 */
export type ArtistProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  artistName: string | null;
  bio: string | null;
  profileImagePath: string | null;
  profileImageUrl: string | null;
  instagramUrl: string | null;
  soundcloudUrl: string | null;
  bandcampUrl: string | null;
  twitterUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Campos editables del perfil en camelCase; artistApi convierte los nombres a snake_case.
 * Se conserva null para bio y redes como ya lo envía el formulario de edición;
 * la respuesta nullable del GET no garantiza que el PUT permita borrarlos con null.
 */
export type UpdateArtistProfileInput = {
  firstName?: string;
  lastName?: string;
  artistName?: string;
  bio?: string | null;
  instagramUrl?: string | null;
  soundcloudUrl?: string | null;
  bandcampUrl?: string | null;
  twitterUrl?: string | null;
};
