import { act, renderHook } from '@testing-library/react-native';
import { useUpdateLabelProfile } from './useUpdateLabelProfile';
import { updateLabelProfile } from '../../services/api/labelsApi';
import type { LabelProfile, UpdateLabelProfileInput } from '../../types/label';

jest.mock('../../services/api/labelsApi', () => ({
  ...jest.requireActual('../../services/api/labelsApi'),
  updateLabelProfile: jest.fn(),
}));

const mockedUpdate = jest.mocked(updateLabelProfile);
const input: UpdateLabelProfileInput = {
  name: 'Test Label',
  description: 'Independent label',
  instagramUrl: 'https://instagram.com/testlabel',
  soundcloudUrl: 'https://soundcloud.com/testlabel',
  bandcampUrl: 'https://testlabel.bandcamp.com',
  twitterUrl: 'https://twitter.com/testlabel',
};
const profile: LabelProfile = {
  id: 'label-1',
  userId: 'user-1',
  name: 'Test Label',
  description: null,
  profileImagePath: null,
  profileImageUrl: null,
  bandcampUrl: null,
  soundcloudUrl: null,
  instagramUrl: null,
  twitterUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useUpdateLabelProfile', () => {
  it('returns true and sends the input to the service on success', async () => {
    mockedUpdate.mockResolvedValueOnce(profile);
    const { result } = await renderHook(() => useUpdateLabelProfile());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      expect(await result.current.submit(input)).toBe(true);
    });

    expect(mockedUpdate).toHaveBeenCalledTimes(1);
    expect(mockedUpdate).toHaveBeenCalledWith(input);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns false and stores the Error message on failure', async () => {
    mockedUpdate.mockRejectedValueOnce(new Error('Nombre inválido'));
    const { result } = await renderHook(() => useUpdateLabelProfile());

    await act(async () => {
      expect(await result.current.submit(input)).toBe(false);
    });

    expect(result.current.error).toBe('Nombre inválido');
    expect(result.current.loading).toBe(false);
  });

  it('uses the fallback message for a non-Error failure', async () => {
    mockedUpdate.mockRejectedValueOnce('failure');
    const { result } = await renderHook(() => useUpdateLabelProfile());

    await act(async () => {
      expect(await result.current.submit(input)).toBe(false);
    });

    expect(result.current.error).toBe('No se pudo actualizar el perfil');
    expect(result.current.loading).toBe(false);
  });

  it.each(['success', 'failure'] as const)(
    'keeps loading true while pending and resets it after %s',
    async (outcome) => {
      let resolve!: (value: LabelProfile) => void;
      let reject!: (reason: Error) => void;
      mockedUpdate.mockReturnValueOnce(new Promise<LabelProfile>((done, fail) => {
        resolve = done;
        reject = fail;
      }));
      const { result } = await renderHook(() => useUpdateLabelProfile());
      let pending!: Promise<boolean>;

      await act(async () => {
        pending = result.current.submit(input);
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        if (outcome === 'success') {
          resolve(profile);
        } else {
          reject(new Error('No se pudo guardar'));
        }
        expect(await pending).toBe(outcome === 'success');
      });

      expect(result.current.loading).toBe(false);
    },
  );

  it('clears the previous error when a new request starts', async () => {
    mockedUpdate.mockRejectedValueOnce(new Error('Nombre inválido'));
    const { result } = await renderHook(() => useUpdateLabelProfile());

    await act(async () => {
      expect(await result.current.submit(input)).toBe(false);
    });
    expect(result.current.error).toBe('Nombre inválido');

    let resolve!: (value: LabelProfile) => void;
    mockedUpdate.mockReturnValueOnce(new Promise<LabelProfile>((done) => {
      resolve = done;
    }));
    let pending!: Promise<boolean>;

    await act(async () => {
      pending = result.current.submit(input);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve(profile);
      expect(await pending).toBe(true);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockedUpdate).toHaveBeenCalledTimes(2);
  });
});
