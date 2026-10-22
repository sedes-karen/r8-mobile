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
