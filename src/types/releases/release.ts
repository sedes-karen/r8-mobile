export type ReleaseType = 'EP' | 'VA' | 'ALBUM';

export type ReleaseListItem = {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  releaseDate: string;
};

export type ReleasesListResponse = {
  releases: ReleaseListItem[];
  hostingQuota: { used: number };
  releaseAudioQuota?: { maxBytes: number };
};

/**
 * Track de un release con el audio resuelto. Solo aparece en `GET /releases/:releaseId`
 * (`tracks[].audioUrl`), no en los listados ni en el release slim de `GET /promos/:id`.
 */
export type ReleaseTrack = {
  id: string;
  title: string;
  trackNumber: number;
  duration: number | null;
  audioUrl: string | null;
};

/**
 * Detalle de release (`GET /releases/:releaseId`). Para el artista receptor es la única fuente
 * de `tracks[]`: la promo devuelve el release slim, sin pistas (DTOs §6 y CLASE_03 §3.8).
 */
export type ReleaseDetail = {
  id: string;
  title: string;
  artist: string | null;
  catalogNumber: string | null;
  releaseDate: string | null;
  type: ReleaseType;
  notes: string | null;
  coverUrl: string | null;
  tracks: ReleaseTrack[];
};
