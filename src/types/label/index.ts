/**
 * Respuesta real de GET /labels/me — verificado contra stage (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §3 y dto de GET /users/me.labels[0]).
 * CamelCase, no confundir con UpdateLabelDto de request (PUT /labels/me).
 */
export type LabelProfile = {
  id: string;
  userId: string;
  name: string | null;
  description: string | null;
  profileImagePath: string | null;
  profileImageUrl: string | null;
  bandcampUrl: string | null;
  soundcloudUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

//Input del PUT /labels/me (UpdateLabelDto), todos opcionales
export type UpdateLabelProfileInput = {
  name?: string;
  description?: string;
  bandcampUrl?: string;
  soundcloudUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
};
