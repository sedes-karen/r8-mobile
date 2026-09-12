import * as useArtistPromosModule from './useArtistPromos';

jest.mock('./useArtistPromos');

describe('useArtistPromos', () => {
  it('retorna loading al montar', () => {
    jest.spyOn(useArtistPromosModule, 'useArtistPromos').mockReturnValue({
      status: 'loading',
      reload: jest.fn(),
    } as const);
    const result = useArtistPromosModule.useArtistPromos();
    expect(result.status).toBe('loading');
    // @ts-expect-error - data no existe en loading
    expect(result.data).toBeUndefined();
  });

  it('retorna error al fallar', () => {
    jest.spyOn(useArtistPromosModule, 'useArtistPromos').mockReturnValue({
      status: 'error',
      message: 'Error inesperado',
      reload: jest.fn(),
    } as const);
    const result = useArtistPromosModule.useArtistPromos();
    expect(result.status).toBe('error');
    // @ts-expect-error - data no existe en error
    expect(result.data).toBeUndefined();
  });

  it('retorna éxito con datos', () => {
    jest.spyOn(useArtistPromosModule, 'useArtistPromos').mockReturnValue({
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
      reload: jest.fn(),
    } as const);
    const result = useArtistPromosModule.useArtistPromos();
    expect(result.status).toBe('success');
    expect(result.data?.inbox).toBeDefined();
    expect(result.data?.pendingCount).toBe(1);
  });
});