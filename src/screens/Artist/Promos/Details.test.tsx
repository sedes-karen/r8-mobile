import { render } from '@testing-library/react-native';
import { ArtistPromosDetailsScreen } from './Details';
import * as usePromoDetailsModule from '../../../features/promos/usePromoDetails';
import type { PromoDetail } from '../../../types/promo';

jest.mock('../../../features/promos/usePromoDetails');
jest.mock('../../../components/atoms/LinkButton', () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => children,
}));

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
    catalogNumber: 'RP-001',
    artwork: null,
    releaseDate: null,
    type: 'EP',
    notes: null,
  },
};

function mockPromo(promo: PromoDetail = PROMO) {
  jest.spyOn(usePromoDetailsModule, 'usePromoDetails').mockReturnValue({
    status: 'success',
    data: promo,
    reload: jest.fn(),
  });
}

describe('ArtistPromosDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra Expirada cuando la promo está vencida', async () => {
    mockPromo({ ...PROMO, status: 'EXPIRED', isActive: false });

    const { getByText } = await render(
      <ArtistPromosDetailsScreen route={{ params: { promoId: 'promo-1' } }} />,
    );

    expect(getByText('Expirada')).toBeTruthy();
  });

  it('no muestra Expirada cuando la promo sigue vigente', async () => {
    mockPromo();

    const { queryByText } = await render(
      <ArtistPromosDetailsScreen route={{ params: { promoId: 'promo-1' } }} />,
    );

    expect(queryByText('Expirada')).toBeNull();
  });

  it('no marca como expirada una promo cancelada', async () => {
    mockPromo({ ...PROMO, status: 'CANCELLED', isActive: false });

    const { queryByText } = await render(
      <ArtistPromosDetailsScreen route={{ params: { promoId: 'promo-1' } }} />,
    );

    expect(queryByText('Expirada')).toBeNull();
  });
});
