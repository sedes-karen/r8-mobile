export type ReleaseType = 'EP' | 'ALBUM' | 'REMIX';

export type Track = {
    id: string;
    title: string;
    trackNumber: number;
    duration?: number;
    artist?: string;
    audioUrl?: string | null;
};

export type ReleaseListItem = {
    id: string;
    title: string;
    artist: string;
    type: ReleaseType;
    releaseDate: string;
    coverUrl?: string | null;
};

export type ReleaseDetail = ReleaseListItem & {
    catalogNumber?: string | null;
    notes?: string | null;
    status?: 'DRAFT' | 'PUBLISHED';
    tracks: Track[];
    releaseLinks?: {
        id: string;
        title: string;
        url: string;
        position?: number;
    }[];
};
