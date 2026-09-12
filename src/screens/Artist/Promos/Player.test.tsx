import { render } from '@testing-library/react-native';
import { ArtistPromosPlayerScreen } from './Player';
import * as useArtistPromosModule from '../../../features/artist/useArtistPromos';

jest.mock('../../../features/artist/useArtistPromos');

function mockState(state: Parameters<typeof useArtistPromosModule.useArtistPromos>[0]) {
  jest.spyOn(useArtistPromosModule, 'useArtistPromos').mockReturnValue(state);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ArtistPromosPlayerScreen', () => {
  it('muestra el loading mientras carga', async () => {
    mockState({ status: 'loading', reload: jest.fn() });
    const { toJSON } = await render(<ArtistPromosPlayerScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('muestra error al fallar la carga', async () => {
    mockState({ status: 'error', message: 'No se pudo cargar la bandeja.', reload: jest.fn() });
    const { getByText } = await render(<ArtistPromosPlayerScreen />);
    expect(getByText('No se pudo cargar la bandeja.')).toBeTruthy();
  });

  it('muestra la bandeja de promos cuando hay datos', async () => {
    mockState({
      status: 'success',
      data: {
        inbox: [
          {
            id: 'promo-1',
            release: { title: 'Test Release', artwork: null },
            labelName: 'Test Label',
            status: 'SENT' as const,
            isActive: true,
            sentAt: null,
            expiresAt: null,
            hasFeedback: false,
            labelId: 'label-1',
          } as const,
        ],
        pendingCount: 1,
      },
    } as const);
    const { getByText } = await render(<ArtistPromosPlayerScreen />);
    expect(getByText('Bandeja de promos')).toBeTruthy();
  });

  it('muestra el contador de promos pendientes', async () => {
    mockState({
      status: 'success',
      data: { pendingCount: 2 },
    } as const);
    const { getByText } = await render(<ArtistPromosPlayerScreen />);
    expect(getByText('Tenés 2 promos pendientes de atención')).toBeTruthy();
  });

  it('muestra EmptyState cuando no hay promos', async () => {
    mockState({
      status: 'success',
      data: { inbox: [] },
    } as const);
    const { getByText } = await render(<ArtistPromosPlayerScreen />);
    expect(getByText('No tenés promos en tu bandeja por ahora.')).toBeTruthy();
  });
});