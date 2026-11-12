import { act, renderHook } from '@testing-library/react-native';
import { useUpdateArtistProfile } from './useUpdateArtistProfile';
import { updateArtistProfile } from '../../services/api/artistApi';
import type { ArtistProfile } from '../../types/artist';

jest.mock('../../services/api/artistApi');

const mockedUpdate = jest.mocked(updateArtistProfile);
const profile = { id: 'artist-1' } as ArtistProfile;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useUpdateArtistProfile', () => {
  it('preserves successful submission and resets loading', async () => {
    mockedUpdate.mockResolvedValueOnce(profile);
    const { result } = await renderHook(() => useUpdateArtistProfile());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      expect(await result.current.submit({ artistName: 'Artist' })).toBe(true);
    });

    expect(mockedUpdate).toHaveBeenCalledWith({ artistName: 'Artist' });
    expect(mockedUpdate).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('rejects a simultaneous submit without sending another request or ending loading', async () => {
    let resolve!: (value: ArtistProfile) => void;
    mockedUpdate.mockReturnValue(new Promise<ArtistProfile>((done) => { resolve = done; }));
    const { result } = await renderHook(() => useUpdateArtistProfile());
    let pending!: Promise<boolean>;
    let duplicate!: Promise<boolean>;

    await act(async () => {
      pending = result.current.submit({ artistName: 'First' });
      duplicate = result.current.submit({ artistName: 'Second' });
    });

    expect(mockedUpdate).toHaveBeenCalledTimes(1);
    await expect(duplicate).resolves.toBe(false);
    expect(mockedUpdate).toHaveBeenCalledWith({ artistName: 'First' });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolve(profile);
      expect(await pending).toBe(true);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockedUpdate).toHaveBeenCalledTimes(1);
  });

  it('preserves backend errors and permits retry after failure', async () => {
    mockedUpdate.mockRejectedValueOnce(new Error('Nombre inválido')).mockResolvedValueOnce(profile);
    const { result } = await renderHook(() => useUpdateArtistProfile());

    await act(async () => {
      expect(await result.current.submit({ artistName: 'Invalid' })).toBe(false);
    });
    expect(result.current.error).toBe('Nombre inválido');
    expect(result.current.loading).toBe(false);

    await act(async () => {
      expect(await result.current.submit({ artistName: 'Artist' })).toBe(true);
    });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockedUpdate).toHaveBeenCalledTimes(2);
  });

  it('preserves the fallback message for non-Error failures', async () => {
    mockedUpdate.mockRejectedValueOnce('failure');
    const { result } = await renderHook(() => useUpdateArtistProfile());

    await act(async () => {
      expect(await result.current.submit({})).toBe(false);
    });
    expect(result.current.error).toBe('No se pudo actualizar el perfil');
    expect(result.current.loading).toBe(false);
    expect(mockedUpdate).toHaveBeenCalledTimes(1);
  });
});
