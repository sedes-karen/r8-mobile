/** Subconjunto de GET /users/me relevante para auth y navegación por rol. */
export type UserMeProfile = {
  id?: string;
  email: string;
  labelId?: string;
  labels?: Array<{ id: string; name?: string }>;
  artist?: {
    id: string;
    artistName?: string;
    first_name?: string;
    last_name?: string;
  } | null;
};

export type AppRole = 'artist' | 'label';

export type AvailableRoles = {
  label: boolean;
  artist: boolean;
};
