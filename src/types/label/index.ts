/**
 * Respuesta de GET /labels/me — Label primario (camelCase en la respuesta, ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §3). Stub inicial: lo definir en detalle quien lo tenga
 * asignado; acá ya está el shape que consume Edit/View.
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
