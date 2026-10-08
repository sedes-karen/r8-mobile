import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useArtistPromos } from './useArtistPromos';
import * as promosApi from '../../services/api/promos';
import type { PromoInboxItem } from '../../types/promo';

jest.mock('../../services/api/promos');

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

describe('useArtistPromos', () => {
  it('combina la bandeja y el contador en un solo estado de éxito', async () => {
    const { result } = await renderHook(() => useArtistPromos());

    await waitFor(() => expect(result.current.status).toBe('success'));

    const current = result.current;
    if (current.status !== 'success') throw new Error('Se esperaba estado success');
    expect(current.data.inbox).toEqual([PROMO]);
    expect(current.data.pendingCount).toBe(1);
    expect(promosApi.getPromosInbox).toHaveBeenCalledTimes(1);
    expect(promosApi.getPromosPendingCount).toHaveBeenCalledTimes(1);
  });

  it('propaga el error cuando falla la carga', async () => {
    jest.spyOn(promosApi, 'getPromosInbox').mockRejectedValue(new Error('No se pudo cargar la bandeja de promos'));

    const { result } = await renderHook(() => useArtistPromos());

    await waitFor(() => expect(result.current.status).toBe('error'));

    const current = result.current;
    if (current.status !== 'error') throw new Error('Se esperaba estado error');
    expect(current.message).toBe('No se pudo cargar la bandeja de promos');
  });

  it('reload vuelve a pedir los datos a la API', async () => {
    const { result } = await renderHook(() => useArtistPromos());

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(promosApi.getPromosInbox).toHaveBeenCalledTimes(1);

    const current = result.current;
    if (current.status !== 'success') throw new Error('Se esperaba estado success');
    await act(async () => {
      current.reload();
    });

    await waitFor(() => expect(promosApi.getPromosInbox).toHaveBeenCalledTimes(2));
    expect(promosApi.getPromosPendingCount).toHaveBeenCalledTimes(2);
  });
});
