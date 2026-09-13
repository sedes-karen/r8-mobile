// Tipos para GET /releases/:releaseId — incluye pistas con audioUrl firmada.

export type TrackDetail = {
  id: string;
  title: string;
  trackNumber: number;
  duration: number | null;
  audioUrl: string | null;
};

export type ReleaseDetail = {
  id: string;
  title: string;
  artist: string | null;
  coverUrl: string | null;
  releaseDate: string | null;
  tracks: TrackDetail[];
};
