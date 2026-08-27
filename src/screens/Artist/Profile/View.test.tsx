import { fireEvent, render } from '@testing-library/react-native';
import { ArtistProfileViewScreen } from './View';
import * as useArtistProfileModule from '../../../features/artist/useArtistProfile';
import * as authInfoModule from '../../../features/auth/info';
import type { ArtistProfile } from '../../../types/artist';

jest.mock('../../../features/artist/useArtistProfile');
jest.mock('../../../features/auth/info');

const ARTIST: ArtistProfile = {
  id: 'artist-1',
  userId: 'user-1',
  firstName: 'R',
  lastName: 'Pruebas',
  artistName: 'Rpruebas Artist',
  bio: 'Bio de prueba',
  profileImagePath: null,
  profileImageUrl: null,
  instagramUrl: null,
  soundcloudUrl: null,
  bandcampUrl: null,
  twitterUrl: null,
  createdAt: '2026-08-27T00:00:00.000Z',
  updatedAt: '2026-08-27T00:00:00.000Z',
};

function mockState(state: ReturnType<typeof useArtistProfileModule.useArtistProfile>) {
  jest.spyOn(useArtistProfileModule, 'useArtistProfile').mockReturnValue(state);
}

const logout = jest.fn();

beforeEach(() => {
  logout.mockClear();
  jest.spyOn(authInfoModule, 'useAuthActions').mockReturnValue({
    logout,
    loginDev: jest.fn(),
    applySession: jest.fn(),
  });
});

describe('ArtistProfileViewScreen', () => {
  it('muestra el loading mientras carga', async () => {
    mockState({ status: 'loading', reload: jest.fn() });
    const { queryByText } = await render(<ArtistProfileViewScreen />);
    expect(queryByText('Cargando perfil...')).toBeTruthy();
  });

  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudo cargar el perfil de artista', reload: jest.fn() });
    const { getByText } = await render(<ArtistProfileViewScreen />);
    expect(getByText('No se pudo cargar el perfil de artista')).toBeTruthy();
  });

  it('muestra el nombre y la bio del artista', async () => {
    mockState({ status: 'success', data: ARTIST, reload: jest.fn() });
    const { getByText } = await render(<ArtistProfileViewScreen />);
    expect(getByText('Rpruebas Artist')).toBeTruthy();
    expect(getByText('Bio de prueba')).toBeTruthy();
  });

  it('llama a logout al tocar Cerrar sesión', async () => {
    mockState({ status: 'success', data: ARTIST, reload: jest.fn() });
    const { getByText } = await render(<ArtistProfileViewScreen />);
    await fireEvent.press(getByText('Cerrar sesión'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
