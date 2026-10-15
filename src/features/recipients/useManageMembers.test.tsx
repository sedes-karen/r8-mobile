import { act, renderHook } from '@testing-library/react-native';
import { useManageMembers } from './useManageMembers';
import * as recipientListsApi from '../../services/api/recipientListsApi';
import type { RecipientListMember, RecipientPoolItem } from '../../types/recipients';

jest.mock('../../services/api/recipientListsApi');

const mockedApi = jest.mocked(recipientListsApi);

const EXISTING_MEMBERS: RecipientListMember[] = [
  { id: 'rec-1', email: 'existente@ejemplo.com', status: 'VALID', display_name: 'Existente' },
];

describe('useManageMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addByEmail', () => {
    it('falla con error si el email está vacío sin llamar a la API', async () => {
      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addByEmail('   ');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('El email no puede estar vacío');
      expect(mockedApi.addRecipientToListByEmail).not.toHaveBeenCalled();
    });

    it('falla con error si el formato del email es inválido', async () => {
      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addByEmail('correo-invalido');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('El formato del email no es válido');
      expect(mockedApi.addRecipientToListByEmail).not.toHaveBeenCalled();
    });

    it('detecta duplicados comparando con existingMembers (case-insensitive) sin llamar a la API', async () => {
      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addByEmail('EXISTENTE@ejemplo.com');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('El destinatario ya pertenece a esta lista');
      expect(mockedApi.addRecipientToListByEmail).not.toHaveBeenCalled();
    });

    it('llama a la API con el email válido y ejecuta onMutated en éxito', async () => {
      const onMutated = jest.fn();
      mockedApi.addRecipientToListByEmail.mockResolvedValueOnce({ recipientId: 'rec-nuevo' });

      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS, onMutated }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addByEmail('nuevo@ejemplo.com');
      });

      expect(success).toBe(true);
      expect(mockedApi.addRecipientToListByEmail).toHaveBeenCalledWith('list-1', 'nuevo@ejemplo.com');
      expect(onMutated).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBeNull();
      expect(result.current.isAdding).toBe(false);
    });

    it('guarda el error y no llama a onMutated cuando la API falla', async () => {
      const onMutated = jest.fn();
      mockedApi.addRecipientToListByEmail.mockRejectedValueOnce(new Error('Fallo del servidor'));

      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS, onMutated }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addByEmail('valido@ejemplo.com');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Fallo del servidor');
      expect(result.current.isAdding).toBe(false);
      expect(onMutated).not.toHaveBeenCalled();
    });

    it('evita llamadas concurrentes duplicadas si se invoca dos veces rápidamente', async () => {
      let resolveApi!: (value: { recipientId: string }) => void;
      mockedApi.addRecipientToListByEmail.mockImplementation(
        () => new Promise((resolve) => { resolveApi = resolve; }),
      );

      const { result } = await renderHook(() => useManageMembers('list-1'));

      let firstPromise!: Promise<boolean>;
      let secondPromise!: Promise<boolean>;

      await act(async () => {
        firstPromise = result.current.addByEmail('primero@ejemplo.com');
        secondPromise = result.current.addByEmail('segundo@ejemplo.com');
      });

      const secondResult = await secondPromise;
      expect(secondResult).toBe(false);
      expect(mockedApi.addRecipientToListByEmail).toHaveBeenCalledTimes(1);
      expect(mockedApi.addRecipientToListByEmail).toHaveBeenCalledWith('list-1', 'primero@ejemplo.com');
      expect(result.current.isAdding).toBe(true);

      await act(async () => {
        resolveApi({ recipientId: 'rec-1' });
      });

      const firstResult = await firstPromise;
      expect(firstResult).toBe(true);
      expect(result.current.isAdding).toBe(false);
    });
  });

  describe('addFromPool', () => {
    it('detecta si el recipientId ya está en existingMembers sin llamar a la API', async () => {
      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addFromPool('rec-1');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('El destinatario ya pertenece a esta lista');
      expect(mockedApi.addRecipientToListById).not.toHaveBeenCalled();
    });

    it('llama a la API con recipientId y ejecuta onMutated en éxito', async () => {
      const onMutated = jest.fn();
      mockedApi.addRecipientToListById.mockResolvedValueOnce({ recipientId: 'rec-pool-1' });

      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS, onMutated }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addFromPool('rec-pool-1');
      });

      expect(success).toBe(true);
      expect(mockedApi.addRecipientToListById).toHaveBeenCalledWith('list-1', 'rec-pool-1');
      expect(onMutated).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBeNull();
      expect(result.current.isAdding).toBe(false);
    });

    it('guarda el error y no llama a onMutated cuando la API falla', async () => {
      const onMutated = jest.fn();
      mockedApi.addRecipientToListById.mockRejectedValueOnce(new Error('Destinatario no encontrado'));

      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS, onMutated }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.addFromPool('rec-pool-error');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Destinatario no encontrado');
      expect(result.current.isAdding).toBe(false);
      expect(onMutated).not.toHaveBeenCalled();
    });

    it('evita llamadas concurrentes duplicadas si se invoca dos veces rápidamente', async () => {
      let resolveApi!: (value: { recipientId: string }) => void;
      mockedApi.addRecipientToListById.mockImplementation(
        () => new Promise((resolve) => { resolveApi = resolve; }),
      );

      const { result } = await renderHook(() => useManageMembers('list-1'));

      let firstPromise!: Promise<boolean>;
      let secondPromise!: Promise<boolean>;

      await act(async () => {
        firstPromise = result.current.addFromPool('rec-1');
        secondPromise = result.current.addFromPool('rec-2');
      });

      const secondResult = await secondPromise;
      expect(secondResult).toBe(false);
      expect(mockedApi.addRecipientToListById).toHaveBeenCalledTimes(1);
      expect(mockedApi.addRecipientToListById).toHaveBeenCalledWith('list-1', 'rec-1');
      expect(result.current.isAdding).toBe(true);

      await act(async () => {
        resolveApi({ recipientId: 'rec-1' });
      });

      const firstResult = await firstPromise;
      expect(firstResult).toBe(true);
      expect(result.current.isAdding).toBe(false);
    });
  });

  describe('removeMember', () => {
    it('llama a removeRecipientFromList con listId y recipientId, seteando removingId y llamando a onMutated', async () => {
      const onMutated = jest.fn();
      mockedApi.removeRecipientFromList.mockResolvedValueOnce();

      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS, onMutated }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.removeMember('rec-1');
      });

      expect(success).toBe(true);
      expect(mockedApi.removeRecipientFromList).toHaveBeenCalledWith('list-1', 'rec-1');
      expect(onMutated).toHaveBeenCalledTimes(1);
      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removingId).toBeNull();
    });

    it('maneja el error, resetea removingId y no llama a onMutated si la API falla', async () => {
      const onMutated = jest.fn();
      mockedApi.removeRecipientFromList.mockRejectedValueOnce(new Error('Conflicto 409'));

      const { result } = await renderHook(() =>
        useManageMembers('list-1', { existingMembers: EXISTING_MEMBERS, onMutated }),
      );

      let success = false;
      await act(async () => {
        success = await result.current.removeMember('rec-1');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Conflicto 409');
      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removingId).toBeNull();
      expect(onMutated).not.toHaveBeenCalled();
    });

    it('evita llamadas concurrentes duplicadas y preserva removingId si se invoca dos veces rápidamente', async () => {
      let resolveApi!: () => void;
      mockedApi.removeRecipientFromList.mockImplementation(
        () => new Promise((resolve) => { resolveApi = resolve; }),
      );

      const { result } = await renderHook(() => useManageMembers('list-1'));

      let firstPromise!: Promise<boolean>;
      let secondPromise!: Promise<boolean>;

      await act(async () => {
        firstPromise = result.current.removeMember('rec-1');
        secondPromise = result.current.removeMember('rec-2');
      });

      const secondResult = await secondPromise;
      expect(secondResult).toBe(false);

      expect(mockedApi.removeRecipientFromList).toHaveBeenCalledTimes(1);
      expect(mockedApi.removeRecipientFromList).toHaveBeenCalledWith('list-1', 'rec-1');
      expect(result.current.isRemoving).toBe(true);
      expect(result.current.removingId).toBe('rec-1');

      await act(async () => {
        resolveApi();
      });

      const firstResult = await firstPromise;
      expect(firstResult).toBe(true);
      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removingId).toBeNull();
    });
  });

  describe('loadPool', () => {
    it('carga el pool de contactos y actualiza el estado', async () => {
      const poolMock: RecipientPoolItem[] = [
        { id: 'p-1', email: 'pool1@test.com', display_name: 'Pool 1' },
      ];
      mockedApi.fetchRecipientPool.mockResolvedValueOnce(poolMock);

      const { result } = await renderHook(() => useManageMembers('list-1'));

      await act(async () => {
        await result.current.loadPool();
      });

      expect(mockedApi.fetchRecipientPool).toHaveBeenCalledTimes(1);
      expect(result.current.pool).toEqual(poolMock);
      expect(result.current.isPoolLoading).toBe(false);
      expect(result.current.poolError).toBeNull();
    });

    it('captura errores al cargar el pool', async () => {
      mockedApi.fetchRecipientPool.mockRejectedValueOnce(new Error('Error de red'));

      const { result } = await renderHook(() => useManageMembers('list-1'));

      await act(async () => {
        await result.current.loadPool();
      });

      expect(result.current.pool).toBeNull();
      expect(result.current.poolError).toBe('Error de red');
      expect(result.current.isPoolLoading).toBe(false);
    });

    it('evita llamadas concurrentes duplicadas a fetchRecipientPool si ya se está cargando', async () => {
      let resolveApi!: (data: RecipientPoolItem[]) => void;
      mockedApi.fetchRecipientPool.mockImplementation(
        () => new Promise((resolve) => { resolveApi = resolve; }),
      );

      const { result } = await renderHook(() => useManageMembers('list-1'));

      await act(async () => {
        result.current.loadPool();
        result.current.loadPool();
      });

      expect(mockedApi.fetchRecipientPool).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolveApi([]);
      });

      expect(result.current.isPoolLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('limpia el error actual', async () => {
      const { result } = await renderHook(() => useManageMembers('list-1'));

      await act(async () => {
        await result.current.addByEmail('');
      });

      expect(result.current.error).toBeTruthy();

      await act(async () => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
