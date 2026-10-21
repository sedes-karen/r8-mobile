import { renderHook, waitFor } from '@testing-library/react-native';
import { getPromoDetails } from '../../services/api/promos';
import { usePromoDetails } from './usePromoDetails';
import type { PromoDetail } from '../../types/promo';

jest.mock('../../services/api/promos', () => ({
  getPromoDetails: jest.fn(),
}));

const mockGetPromoDetails = jest.mocked(getPromoDetails);

describe('usePromoDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obtiene los detalles de la promo cuando recibe un promoId', async () => {
    const promoId = 'promo-123';
    const promo = { id: promoId } as PromoDetail;

    mockGetPromoDetails.mockResolvedValue(promo);

    const { result } = await renderHook(() => usePromoDetails(promoId));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(mockGetPromoDetails).toHaveBeenCalledWith(promoId);
    expect(result.current).toEqual({
      status: 'success',
      data: promo,
      reload: expect.any(Function),
    });
  });

  it('devuelve un error cuando no recibe un promoId', async () => {
    const { result } = await renderHook(() => usePromoDetails());

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(mockGetPromoDetails).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({
      status: 'error',
      message: 'No se encontró la promo.',
    });
  });

  it('devuelve un error cuando falla la petición a la API', async () => {
    mockGetPromoDetails.mockRejectedValue(new Error('Error de conexión'));

    const { result } = await renderHook(() =>
      usePromoDetails('promo-123'),
    );

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current).toMatchObject({
      status: 'error',
      message: 'Error de conexión',
    });
  });
});
