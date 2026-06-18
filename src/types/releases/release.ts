export type ReleaseType = 'EP' | 'ALBUM' | 'REMIX';

export type ReleaseStatus = 'DRAFT' | 'PUBLISHED';

export type ReleaseTrack = {
  id: string;
  title: string;
  trackNumber: number;
  duration?: number;
  artist?: string;
  audioUrl?: string | null;
};

export type ReleaseLink = {
  id: string;
  title: string;
  url: string;
  position?: number;
};

export type ReleaseListItem = {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  releaseDate: string;
  catalogNumber?: string | null;
  status?: ReleaseStatus;
  coverUrl?: string | null;
};

export type ReleaseDetail = ReleaseListItem & {
  notes?: string | null;
  tracks: ReleaseTrack[];
  releaseLinks?: ReleaseLink[];
};
