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

export type ReleaseStatus = 'DRAFT' | 'CREATED';

/**
 * Track de un release con el audio resuelto. Solo aparece en `GET /releases/:releaseId`
 * (`tracks[].audioUrl`), no en los listados ni en el release slim de `GET /promos/:id`.
 */
export type ReleaseTrack = {
  id: string;
  title: string;
  trackNumber: number;
  duration?: number | null; // segundos
  audioUrl?: string | null;
};

/** GET /releases/:releaseId — detalle de un release (lectura). */
export type ReleaseDetail = ReleaseListItem & {
  status: ReleaseStatus;
  catalogNumber?: string | null;
  notes?: string | null;
  coverUrl?: string | null;
  tracks: ReleaseTrack[];
};

/** Cuerpo de PATCH /releases/:releaseId — todos opcionales. */
export type UpdateReleaseBody = Partial<
  Pick<ReleaseDetail, 'title' | 'artist' | 'type' | 'releaseDate'>
>;
