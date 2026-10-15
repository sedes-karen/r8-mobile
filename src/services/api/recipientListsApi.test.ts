import {
  fetchRecipientLists,
  fetchRecipientListById,
  fetchRecipientListMembers,
  fetchRecipientPool,
  addRecipientToListByEmail,
  addRecipientToListById,
  removeRecipientFromList,
} from './recipientListsApi';
import { apiClient } from './apiClient';
import * as apiErrorsModule from './apiErrors';

jest.mock('./apiClient');

const mockedApiClient = jest.mocked(apiClient);

describe('recipientListsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRecipientPool', () => {
    it('llama a GET /recipient-lists/recipients y devuelve el pool', async () => {
      const mockPool = [
        { id: 'rec-1', email: 'promo1@example.com', display_name: 'DJ Test', status: 'VALID' },
      ];
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPool,
      } as Response);

      const result = await fetchRecipientPool();

      expect(mockedApiClient).toHaveBeenCalledWith('/recipient-lists/recipients');
      expect(result).toEqual(mockPool);
    });

    it('lanza un error legible si la respuesta no es exitosa', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Error interno' }),
      } as Response);

      await expect(fetchRecipientPool()).rejects.toThrow('Error interno');
    });
  });

  describe('addRecipientToListByEmail', () => {
    it('envía POST con exactamente { email } en el body y encodea listId', async () => {
      const mockResponse = { recipientId: 'new-rec-id' };
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await addRecipientToListByEmail('list 123', 'nuevo@ejemplo.com');

      expect(mockedApiClient).toHaveBeenCalledWith('/recipient-lists/list%20123/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nuevo@ejemplo.com' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('lanza error si el POST falla', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Email no válido' }),
      } as Response);

      await expect(addRecipientToListByEmail('list-1', 'invalido')).rejects.toThrow('Email no válido');
    });
  });

  describe('addRecipientToListById', () => {
    it('envía POST con exactamente { recipientId } en el body y nunca envía email', async () => {
      const mockResponse = { recipientId: 'rec-456' };
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await addRecipientToListById('list-1', 'rec-456');

      expect(mockedApiClient).toHaveBeenCalledWith('/recipient-lists/list-1/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: 'rec-456' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('lanza error si la agregación por ID falla', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Destinatario no encontrado' }),
      } as Response);

      await expect(addRecipientToListById('list-1', 'rec-inexistente')).rejects.toThrow(
        'Destinatario no encontrado',
      );
    });
  });

  describe('removeRecipientFromList', () => {
    it('envía DELETE a /recipient-lists/:listId/recipients/:recipientId y maneja 204 No Content sin llamar a json()', async () => {
      const jsonSpy = jest.fn();
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: jsonSpy,
      } as unknown as Response);

      await expect(removeRecipientFromList('list 1', 'rec 2')).resolves.toBeUndefined();

      expect(mockedApiClient).toHaveBeenCalledWith(
        '/recipient-lists/list%201/recipients/rec%202',
        {
          method: 'DELETE',
        },
      );
      expect(jsonSpy).not.toHaveBeenCalled();
    });

    it('lanza error si el DELETE falla', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'No se puede quitar el destinatario' }),
      } as Response);

      await expect(removeRecipientFromList('list-1', 'rec-1')).rejects.toThrow(
        'No se puede quitar el destinatario',
      );
    });
  });

  describe('lectura existente (regresión)', () => {
    it('fetchRecipientLists llama a /recipient-lists', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ lists: [], total: 0 }),
      } as unknown as Response);

      await fetchRecipientLists();
      expect(mockedApiClient).toHaveBeenCalledWith('/recipient-lists');
    });

    it('fetchRecipientListById llama a /recipient-lists/:listId', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'list-1', name: 'Lista 1' }),
      } as unknown as Response);

      await fetchRecipientListById('list-1');
      expect(mockedApiClient).toHaveBeenCalledWith('/recipient-lists/list-1');
    });

    it('fetchRecipientListMembers llama a /recipient-lists/:listId/recipients', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      } as unknown as Response);

      await fetchRecipientListMembers('list-1');
      expect(mockedApiClient).toHaveBeenCalledWith('/recipient-lists/list-1/recipients');
    });
  });
});
