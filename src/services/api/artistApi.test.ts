import { fetchArtistMe, updateArtistProfile } from './artistApi';
import { apiClient } from './apiClient';

jest.mock('./apiClient');

const mockedApiClient = jest.mocked(apiClient);
const profile = { id: 'artist-1', artistName: 'Updated artist' };

beforeEach(() => {
  jest.resetAllMocks();
});

describe('artistApi', () => {
  it('preserves GET /artists/me and returns the profile', async () => {
    mockedApiClient.mockResolvedValueOnce({ ok: true, json: async () => profile } as Response);

    await expect(fetchArtistMe()).resolves.toEqual(profile);
    expect(mockedApiClient).toHaveBeenCalledTimes(1);
    expect(mockedApiClient).toHaveBeenCalledWith('/artists/me');
  });

  it('preserves backend errors from GET /artists/me', async () => {
    mockedApiClient.mockResolvedValueOnce({
      ok: false, status: 403, json: async () => ({ message: 'Acceso denegado' }),
    } as Response);

    await expect(fetchArtistMe()).rejects.toThrow('Acceso denegado');
    expect(mockedApiClient).toHaveBeenCalledTimes(1);
  });

  it('maps camelCase names to the exact PUT body, omitting undefined fields', async () => {
    mockedApiClient.mockResolvedValueOnce({ ok: true, json: async () => profile } as Response);

    await expect(updateArtistProfile({
      firstName: 'Ada', lastName: 'Lovelace', artistName: 'Updated artist',
      bio: 'Biography', instagramUrl: 'https://instagram.com/artist',
      soundcloudUrl: undefined, bandcampUrl: '', twitterUrl: null,
    })).resolves.toEqual(profile);
    expect(mockedApiClient).toHaveBeenCalledTimes(1);
    expect(mockedApiClient).toHaveBeenCalledWith('/artists/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Ada', last_name: 'Lovelace', artist_name: 'Updated artist',
        bio: 'Biography', instagramUrl: 'https://instagram.com/artist',
        bandcampUrl: '', twitterUrl: null,
      }),
    });
  });

  it('preserves null values already sent by the edit screen', async () => {
    mockedApiClient.mockResolvedValueOnce({ ok: true, json: async () => profile } as Response);

    await updateArtistProfile({
      bio: null, instagramUrl: null, soundcloudUrl: null, bandcampUrl: null, twitterUrl: null,
    });

    expect(mockedApiClient).toHaveBeenCalledWith('/artists/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: null, instagramUrl: null, soundcloudUrl: null, bandcampUrl: null, twitterUrl: null,
      }),
    });
  });

  it('preserves backend errors from PUT /artists/me', async () => {
    mockedApiClient.mockResolvedValueOnce({
      ok: false, status: 400, json: async () => ({ message: 'Nombre inválido' }),
    } as Response);

    await expect(updateArtistProfile({ artistName: 'Invalid' })).rejects.toThrow('Nombre inválido');
    expect(mockedApiClient).toHaveBeenCalledTimes(1);
  });
});
