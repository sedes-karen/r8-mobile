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
 * Input del PUT /artists/me (UpdateArtistDto), todos opcionales (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §4). Campos editables de texto/redes en camelCase
 * como en el resto de la app; el mapeo a snake_case del request (first_name,
 * last_name, artist_name) lo hace artistApi. No incluye profileImagePath:
 * la imagen se gestiona vía flujo presign de /artists/me/profile-image.
 * Bio y redes conservan null como ya lo enviaba el formulario del #99;
 * su aceptación para borrar campos en el PUT requiere validación con backend.
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
