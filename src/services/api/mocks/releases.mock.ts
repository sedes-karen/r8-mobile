import type { ReleaseDetail } from '../../../types/releases';

export const MOCK_RELEASES: ReleaseDetail[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    title: 'EP Demo',
    artist: 'Artista X',
    type: 'EP',
    releaseDate: '2026-05-01T00:00:00.000Z',
    catalogNumber: 'R8-001',
    status: 'PUBLISHED',
    coverUrl: null,
    notes: 'Release mock para desarrollar la lista y el detalle sin stage.',
    tracks: [
      {
        id: '21111111-1111-4111-8111-111111111101',
        title: 'Intro Demo',
        trackNumber: 1,
        duration: 183,
        artist: 'Artista X',
        audioUrl: null,
      },
      {
        id: '21111111-1111-4111-8111-111111111102',
        title: 'Main Mix',
        trackNumber: 2,
        duration: 326,
        artist: 'Artista X',
        audioUrl: null,
      },
    ],
    releaseLinks: [
      {
        id: '31111111-1111-4111-8111-111111111101',
        title: 'Bandcamp',
        url: 'https://example.com/r8-demo-ep',
        position: 1,
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    title: 'Album Demo',
    artist: 'Artista Y',
    type: 'ALBUM',
    releaseDate: '2025-11-15T00:00:00.000Z',
    catalogNumber: 'R8-002',
    status: 'DRAFT',
    coverUrl: null,
    notes: 'Segundo release mock para probar estados draft y listados.',
    tracks: [
      {
        id: '21111111-1111-4111-8111-111111111201',
        title: 'Primer Track',
        trackNumber: 1,
        duration: 245,
        artist: 'Artista Y',
        audioUrl: null,
      },
    ],
    releaseLinks: [],
  },
];
