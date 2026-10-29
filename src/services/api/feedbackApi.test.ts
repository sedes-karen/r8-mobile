import { fetchLabelFeedback, fetchPendingFeedbackCount } from './feedbackApi';
import { apiClient } from './apiClient';

jest.mock('./apiClient');

const mockedApiClient = jest.mocked(apiClient);

describe('feedbackApi (ámbito label)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchLabelFeedback', () => {
    it('llama a GET /feedback sin filtros de fecha y devuelve el objeto { feedback, total }', async () => {
      const body = { feedback: [], total: 0 };
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => body,
      } as Response);

      const result = await fetchLabelFeedback();

      expect(mockedApiClient).toHaveBeenCalledWith('/feedback');
      expect(result).toEqual(body);
    });

    it('lanza un error legible si la respuesta no es exitosa', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Error interno' }),
      } as Response);

      await expect(fetchLabelFeedback()).rejects.toThrow('Error interno');
    });
  });

  describe('fetchPendingFeedbackCount', () => {
    it('llama a GET /feedback/pending-count y devuelve { count }', async () => {
      mockedApiClient.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ count: 3 }),
      } as Response);

      const result = await fetchPendingFeedbackCount();

      expect(mockedApiClient).toHaveBeenCalledWith('/feedback/pending-count');
      expect(result).toEqual({ count: 3 });
    });
  });
});
