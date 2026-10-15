import { act, renderHook } from '@testing-library/react-native';
import { useEditRecipientList } from './useEditRecipientList';
import * as apiClientModule from '../../services/api/apiClient';

jest.mock('../../services/api/apiClient');

function mockResponse(status: number, body?: unknown) {
  jest.spyOn(apiClientModule, 'apiClient').mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), { status }),
  );
}

describe('useEditRecipientList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renombra la lista mandando PUT con el nombre nuevo', async () => {
    mockResponse(200, { id: 'list-1', name: 'Prensa' });
    const { result } = await renderHook(() => useEditRecipientList('list-1'));

    let ok = false;
    await act(async () => {
      ok = await result.current.rename('Prensa');
    });

    expect(ok).toBe(true);
    expect(result.current.error).toBeNull();
    expect(apiClientModule.apiClient).toHaveBeenCalledWith('/recipient-lists/list-1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Prensa' }),
    });
  });

  it('elimina la lista cuando la API responde 204', async () => {
    mockResponse(204);
    const { result } = await renderHook(() => useEditRecipientList('list-1'));

    let ok = false;
    await act(async () => {
      ok = await result.current.remove();
    });

    expect(ok).toBe(true);
    expect(apiClientModule.apiClient).toHaveBeenCalledWith('/recipient-lists/list-1', {
      method: 'DELETE',
    });
  });

  it('traduce el 409 a un mensaje entendible en vez del error de la API', async () => {
    mockResponse(409, { message: 'DELETE_DEPENDENCY_ERROR' });
    const { result } = await renderHook(() => useEditRecipientList('list-1'));

    let ok = true;
    await act(async () => {
      ok = await result.current.remove();
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe('No se puede eliminar: la lista está siendo usada por una promo.');
  });

  it('muestra el mensaje de la API en otros errores', async () => {
    mockResponse(400, { message: 'name must be a string' });
    const { result } = await renderHook(() => useEditRecipientList('list-1'));

    await act(async () => {
      await result.current.rename('');
    });

    expect(result.current.error).toBe('name must be a string');
  });
});
