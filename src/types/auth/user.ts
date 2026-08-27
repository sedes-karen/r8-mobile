/**
 * Subconjunto de GET /users/me relevante para auth y navegación por rol.
 * Verificado contra la respuesta real de stage (2026-08-27, ver DTOs_Y_CUERPOS_HTTP.md):
 * no existe un `labelId` plano, el label activo se deriva de `labels[0]?.id`. El objeto
 * `artist` viene en camelCase, no snake_case (eso es solo del *request* de Create/UpdateArtistDto).
 */
export type UserMeProfile = {
  id?: string;
  email: string;
  labels?: Array<{ id: string; name?: string }>;
  artist?: {
    id: string;
    artistName?: string | null;
    firstName?: string;
    lastName?: string;
  } | null;
};

export type AppRole = 'artist' | 'label';

export type AvailableRoles = {
  label: boolean;
  artist: boolean;
};
