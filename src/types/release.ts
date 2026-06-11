// ejemplo CLASE_03_PRACTICA.md
/** Subconjunto del release para listados (mock y futura API). */
export type ReleaseType = 'EP' | 'ALBUM' | 'REMIX';

export type ReleaseListItem = {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  releaseDate: string; // ISO 8601 (ej: "2026-05-01T00:00:00.000Z")
};