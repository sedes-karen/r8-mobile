import { fireEvent, render } from '@testing-library/react-native';
import { ArtistPromosLikedTracksScreen } from './LikedTracks';
import * as useLikedTracksModule from '../../../features/feedback/useLikedTracks';
import type { LikedTracksReleaseItem } from '../../../types/feedback/likedTracks';

jest.mock('../../../features/feedback/useLikedTracks');

const RELEASE: LikedTracksReleaseItem = {
  feedbackId: 'feedback-1',
  releaseId: 'release-1',
  labelId: 'label-1',
  labelName: 'Rpruebas Label',
  title: 'Rpruebas Test Release',
  artistName: 'Rpruebas Artist',
  artwork: 'https://example.com/art.png',
  downloadsEnabled: true,
  promoExpired: false,
  tracks: [{ trackId: 'track-1', title: 'Rpruebas Track 1', duration: 12, url: 'https://example.com/t.mp3', downloaded: false, audioSize: 2410 }],
};

function mockState(overrides: Partial<ReturnType<typeof useLikedTracksModule.useLikedTracks>>) {
  jest.spyOn(useLikedTracksModule, 'useLikedTracks').mockReturnValue({
    status: 'success',
    message: undefined,
    items: [],
    unlikeError: null,
    removingTrackId: null,
    unlikeTrack: jest.fn(),
    reload: jest.fn(),
    ...overrides,
  });
}

describe('ArtistPromosLikedTracksScreen', () => {
  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudieron cargar los tracks favoritos' });
    const { getByText } = await render(<ArtistPromosLikedTracksScreen />);
    expect(getByText('No se pudieron cargar los tracks favoritos')).toBeTruthy();
  });

  it('muestra un EmptyState cuando no hay favoritos', async () => {
    mockState({ items: [] });
    const { getByText } = await render(<ArtistPromosLikedTracksScreen />);
    expect(getByText('Todavía no marcaste ningún track como favorito.')).toBeTruthy();
  });

  it('llama a unlikeTrack con release/feedback/track al tocar Quitar', async () => {
    const unlikeTrack = jest.fn();
    mockState({ items: [RELEASE], unlikeTrack });

    const { getByText } = await render(<ArtistPromosLikedTracksScreen />);
    expect(getByText('Rpruebas Track 1')).toBeTruthy();
    await fireEvent.press(getByText('Quitar'));

    expect(unlikeTrack).toHaveBeenCalledWith('release-1', 'feedback-1', 'track-1');
  });

  it('muestra el error puntual de un unlike fallido', async () => {
    mockState({ items: [RELEASE], unlikeError: 'No se pudo actualizar el favorito' });
    const { getByText } = await render(<ArtistPromosLikedTracksScreen />);
    expect(getByText('No se pudo actualizar el favorito')).toBeTruthy();
  });
});
