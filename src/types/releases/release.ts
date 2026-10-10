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

export type ReleaseTrack = {
  id: string;
  title: string;
  trackNumber: number;
  duration?: number | null; // segundos
  audioUrl?: string | null;
};

/** GET /releases/:releaseId — detalle de un release (lectura). */
export type ReleaseDetail = ReleaseListItem & {
  status: string; // 'DRAFT' | 'CREATED' según la API
  catalogNumber?: string | null;
  notes?: string | null;
  coverUrl?: string | null;
  tracks: ReleaseTrack[];
};