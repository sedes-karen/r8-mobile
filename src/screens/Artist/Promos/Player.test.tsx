import { render } from '@testing-library/react-native';
import { ArtistPromosPlayerScreen } from './Player';
import * as promosApi from '../../../services/api/promos';
import type { PromoInboxItem } from '../../../types/promo';

jest.mock('../../../services/api/promos');

jest.mock('../../../components/atoms/LinkButton', () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => children,
}));

const PROMO: PromoInboxItem = {
  id: 'promo-1',
  labelId: 'label-1',
  labelName: 'Rpruebas Label',
  status: 'SENT',
  isActive: true,
  sentAt: '2026-09-12T10:00:00Z',
  expiresAt: '2026-09-30T23:59:59Z',
  hasFeedback: false,
  release: {
    id: 'release-1',
    title: 'Rpruebas Test Release',
  },
};

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(promosApi, 'getPromosInbox').mockResolvedValue([PROMO]);
  jest.spyOn(promosApi, 'getPromosPendingCount').mockResolvedValue({ count: 1 });
});

describe('ArtistPromosPlayerScreen', () => {
  it('muestra una promo de la bandeja', async () => {
    const { getByText } = await render(<ArtistPromosPlayerScreen />);

    expect(getByText('Rpruebas Test Release')).toBeTruthy();
  });

  it('muestra un EmptyState cuando no hay promos', async () => {
    jest.spyOn(promosApi, 'getPromosInbox').mockResolvedValue([]);
    jest.spyOn(promosApi, 'getPromosPendingCount').mockResolvedValue({ count: 0 });

    const { getByText } = await render(<ArtistPromosPlayerScreen />);

    expect(getByText('No tenés promos en tu bandeja por ahora.')).toBeTruthy();
  });

  it('muestra la cantidad de promos pendientes', async () => {
    jest.spyOn(promosApi, 'getPromosPendingCount').mockResolvedValue({ count: 2 });

    const { getByText } = await render(<ArtistPromosPlayerScreen />);

    expect(getByText('Tenés 2 promos pendientes de atención.')).toBeTruthy();
  });

  it('muestra el error cuando falla la carga', async () => {
    jest
      .spyOn(promosApi, 'getPromosInbox')
      .mockRejectedValue(new Error('No se pudo cargar la bandeja de promos'));

    const { getByText } = await render(<ArtistPromosPlayerScreen />);

    expect(getByText('No se pudo cargar la bandeja de promos')).toBeTruthy();
  });
    
    it('muestra Pendiente cuando la promo está enviada y no tiene feedback', async () => {
        const { getByText } = await render(<ArtistPromosPlayerScreen />);
        
        expect(getByText('Pendiente')).toBeTruthy();
    });

    it('no muestra Pendiente cuando la promo ya tiene feedback', async () => {
        const promoConFeedback = {
            ...PROMO,
            hasFeedback: true,
        };
        
        jest.spyOn(promosApi, 'getPromosInbox').mockResolvedValue([promoConFeedback]);
        jest.spyOn(promosApi, 'getPromosPendingCount').mockResolvedValue({ count: 0 });
        
        const { queryByText } = await render(<ArtistPromosPlayerScreen />);
        
        expect(queryByText('Pendiente')).toBeNull();
    });
});