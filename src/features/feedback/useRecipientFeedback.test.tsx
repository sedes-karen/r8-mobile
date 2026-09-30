import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { useRecipientFeedback } from './useRecipientFeedback';
import { AuthInfoProvider } from '../auth/info';
import * as promosApi from '../../services/api/promos';
import * as releasesApi from '../../services/api/releasesApi';
import * as feedbackApi from '../../services/api/feedbackApi';
import * as likedTracksApi from '../../services/api/likedTracksApi';
import * as userApi from '../../services/api/userApi';
import type { FeedbackEntity } from '../../types/feedback/form';
import type { PromoDetail } from '../../types/promo';
import type { ReleaseDetail } from '../../types/releases';

jest.mock('../../services/api/promos');
jest.mock('../../services/api/releasesApi');
jest.mock('../../services/api/feedbackApi');
jest.mock('../../services/api/likedTracksApi');
jest.mock('../../services/api/userApi');

const PROMO: PromoDetail = {
  id: 'promo-1',
  status: 'SENT',
  isActive: true,
  useCuratedDb: false,
  scheduledAt: null,
  release: {
    id: 'release-1',
    title: 'Rpruebas Test Release',
    artistName: 'Rpruebas Artist',
    labelName: 'Rpruebas Label',
    catalogNumber: null,
    artwork: null,
    releaseDate: null,
    type: 'EP',
    notes: null,
  },
};

const RELEASE: ReleaseDetail = {
  id: 'release-1',
  title: 'Rpruebas Test Release',
  artist: 'Rpruebas Artist',
  catalogNumber: null,
  releaseDate: null,
  type: 'EP',
  notes: null,
  coverUrl: null,
  tracks: [
    { id: 'track-1', title: 'Rpruebas Track 1', trackNumber: 1, duration: 212, audioUrl: null },
    { id: 'track-2', title: 'Rpruebas Track 2', trackNumber: 2, duration: null, audioUrl: null },
  ],
};

function feedbackWith(rating: number | null): FeedbackEntity {
  return {
    id: 'feedback-1',
    releaseId: 'release-1',
    userId: 'user-1',
    rating,
    comment: rating === null ? null : 'Buenísimo',
    willPlay: rating === null ? null : true,
    supported: true,
    trackStats: [
      {
        track_id: 'track-1',
        play_count: 2,
        listening_time: 0,
        liked: false,
        downloaded: false,
      },
    ],
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthInfoProvider>{children}</AuthInfoProvider>;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(promosApi, 'getPromoDetail').mockResolvedValue(PROMO);
  jest.spyOn(releasesApi, 'fetchReleaseDetail').mockResolvedValue(RELEASE);
  jest.spyOn(feedbackApi, 'ensureFeedback').mockResolvedValue(feedbackWith(null));
  jest.spyOn(feedbackApi, 'addTrackPlayStats').mockResolvedValue(feedbackWith(null));
  jest.spyOn(feedbackApi, 'markTracksDownloaded').mockResolvedValue([]);
  jest.spyOn(likedTracksApi, 'setTrackLiked').mockResolvedValue(undefined);
  // El provider arranca sin perfil, así que el hook cae al fallback de GET /users/me.
  jest.spyOn(userApi, 'fetchUsersMe').mockResolvedValue({ id: 'user-1', email: 'artista@r8.audio' });
});

describe('useRecipientFeedback', () => {
  it('carga promo, release y ensure en el orden en que se necesitan', async () => {
    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(promosApi.getPromoDetail).toHaveBeenCalledWith('promo-1');
    expect(releasesApi.fetchReleaseDetail).toHaveBeenCalledWith('release-1');
    expect(feedbackApi.ensureFeedback).toHaveBeenCalledWith('release-1', 'user-1');
    expect(result.current.tracks).toHaveLength(2);
  });

  it('deja el formulario habilitado solo mientras el rating es null', async () => {
    jest.spyOn(feedbackApi, 'ensureFeedback').mockResolvedValue(feedbackWith(4));

    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });

    await waitFor(() => expect(result.current.canSubmitFeedback).toBe(false));
  });

  it('mapea los trackStats del servidor a contadores por pista', async () => {
    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });

    await waitFor(() => expect(result.current.trackStats?.['track-1']).toBeDefined());

    expect(result.current.trackStats?.['track-1']).toEqual({
      playCount: 2,
      liked: false,
      downloaded: false,
    });
    expect(result.current.trackStats?.['track-2']).toEqual({
      playCount: 0,
      liked: false,
      downloaded: false,
    });
  });

  it('sube el play count con un delta y lo baja si la API falla', async () => {
    jest.spyOn(feedbackApi, 'addTrackPlayStats').mockRejectedValue(new Error('No se pudo registrar la reproducción'));

    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });
    await waitFor(() => expect(result.current.trackStats).not.toBeNull());

    await act(async () => {
      await result.current.registerPlay('track-1');
    });

    expect(feedbackApi.addTrackPlayStats).toHaveBeenCalledWith('release-1', 'feedback-1', [
      { track_id: 'track-1', play_count: 1 },
    ]);
    expect(result.current.trackStats?.['track-1'].playCount).toBe(2);
    expect(result.current.statsError).toBe('No se pudo registrar la reproducción');
  });

  it('hace toggle del like con el endpoint de likedTracksApi', async () => {
    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });
    await waitFor(() => expect(result.current.trackStats).not.toBeNull());

    await act(async () => {
      await result.current.toggleLike('track-1');
    });

    expect(likedTracksApi.setTrackLiked).toHaveBeenCalledWith('release-1', 'feedback-1', 'track-1', true);
    expect(result.current.trackStats?.['track-1'].liked).toBe(true);
  });

  it('manda el batch de descargas con user_id y release_id', async () => {
    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });
    await waitFor(() => expect(result.current.trackStats).not.toBeNull());

    await act(async () => {
      await result.current.registerDownload('track-2');
    });

    expect(feedbackApi.markTracksDownloaded).toHaveBeenCalledWith([
      { user_id: 'user-1', release_id: 'release-1', tracks: ['track-2'] },
    ]);
    expect(result.current.trackStats?.['track-2'].downloaded).toBe(true);
  });

  it('propaga el error cuando falla la carga de la promo', async () => {
    jest.spyOn(promosApi, 'getPromoDetail').mockRejectedValue(new Error('No se pudo cargar la promo'));

    const { result } = await renderHook(() => useRecipientFeedback('promo-1'), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));

    const current = result.current;
    if (current.status !== 'error') throw new Error('Se esperaba estado error');
    expect(current.message).toBe('No se pudo cargar la promo');
  });

  it('falla con un mensaje propio cuando la promo no tiene id', async () => {
    const { result } = await renderHook(() => useRecipientFeedback(undefined), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));

    const current = result.current;
    if (current.status !== 'error') throw new Error('Se esperaba estado error');
    expect(current.message).toBe('No se recibió el identificador de la promo');
  });
});
