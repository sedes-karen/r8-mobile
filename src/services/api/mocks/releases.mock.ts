import type { ReleaseListItem } from '../../../types/releases/release';

export const MOCK_RELEASES: ReleaseListItem[] = [
    {
        id: '11111111-1111-4111-8111-111111111101',
        title: 'EP Demo',
        artist: 'Artista X',
        type: 'EP',
        releaseDate: '2026-05-01T00:00:00.000Z',
    },
    {
        id: '11111111-1111-4111-8111-111111111102',
        title: 'Album Demo',
        artist: 'Artista Y',
        type: 'ALBUM',
        releaseDate: '2025-11-15T00:00:00.000Z',
    },
];