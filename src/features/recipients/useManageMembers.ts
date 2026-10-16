import { useCallback, useRef, useState } from 'react';
import {
  addRecipientToListByEmail,
  addRecipientToListById,
  fetchRecipientPool,
  removeRecipientFromList,
} from '../../services/api/recipientListsApi';
import type { RecipientListMember, RecipientPoolItem } from '../../types/recipients';

export type UseManageMembersOptions = {
  existingMembers?: RecipientListMember[];
  onMutated?: () => void;
};

// Validación básica de formato de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hook para gestionar miembros de una lista de destinatarios (altas y bajas).
 * Centraliza validaciones previas (duplicados, formato), estados de carga y errores.
 */
export function useManageMembers(
  listId: string,
  options: UseManageMembersOptions = {},
) {
  const { existingMembers = [], onMutated } = options;

  const existingMembersRef = useRef(existingMembers);
  existingMembersRef.current = existingMembers;

  const onMutatedRef = useRef(onMutated);
  onMutatedRef.current = onMutated;

  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Candados con refs para protección síncrona contra pulsaciones rápidas consecutivas
  const isAddingRef = useRef(false);
  const isRemovingRef = useRef(false);
  const isPoolLoadingRef = useRef(false);

  // Pool de contactos (carga bajo demanda)
  const [pool, setPool] = useState<RecipientPoolItem[] | null>(null);
  const [isPoolLoading, setIsPoolLoading] = useState(false);
  const [poolError, setPoolError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPool = useCallback(async () => {
    if (isPoolLoadingRef.current) {
      return;
    }

    isPoolLoadingRef.current = true;
    setIsPoolLoading(true);
    setPoolError(null);
    try {
      const data = await fetchRecipientPool();
      setPool(data);
    } catch (e) {
      setPoolError(e instanceof Error ? e.message : 'No se pudo cargar el pool de destinatarios');
    } finally {
      isPoolLoadingRef.current = false;
      setIsPoolLoading(false);
    }
  }, []);

  const addByEmail = useCallback(
    async (email: string): Promise<boolean> => {
      if (isAddingRef.current) {
        return false;
      }

      const trimmed = email.trim();
      if (!trimmed) {
        setError('El email no puede estar vacío');
        return false;
      }

      if (!EMAIL_REGEX.test(trimmed)) {
        setError('El formato del email no es válido');
        return false;
      }

      const normalized = trimmed.toLowerCase();
      const isDuplicate = (existingMembersRef.current ?? []).some(
        (member) => member.email.trim().toLowerCase() === normalized,
      );

      if (isDuplicate) {
        setError('El destinatario ya pertenece a esta lista');
        return false;
      }

      isAddingRef.current = true;
      setIsAdding(true);
      setError(null);

      try {
        await addRecipientToListByEmail(listId, trimmed);
        onMutatedRef.current?.();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo agregar el destinatario');
        return false;
      } finally {
        isAddingRef.current = false;
        setIsAdding(false);
      }
    },
    [listId],
  );

  const addFromPool = useCallback(
    async (recipientId: string): Promise<boolean> => {
      if (isAddingRef.current) {
        return false;
      }

      const isDuplicate = (existingMembersRef.current ?? []).some(
        (member) => member.id === recipientId,
      );

      if (isDuplicate) {
        setError('El destinatario ya pertenece a esta lista');
        return false;
      }

      isAddingRef.current = true;
      setIsAdding(true);
      setError(null);

      try {
        await addRecipientToListById(listId, recipientId);
        onMutatedRef.current?.();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo agregar el destinatario');
        return false;
      } finally {
        isAddingRef.current = false;
        setIsAdding(false);
      }
    },
    [listId],
  );

  const removeMember = useCallback(
    async (recipientId: string): Promise<boolean> => {
      if (isRemovingRef.current) {
        return false;
      }

      isRemovingRef.current = true;
      setIsRemoving(true);
      setRemovingId(recipientId);
      setError(null);

      try {
        await removeRecipientFromList(listId, recipientId);
        onMutatedRef.current?.();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo quitar el destinatario');
        return false;
      } finally {
        isRemovingRef.current = false;
        setIsRemoving(false);
        setRemovingId(null);
      }
    },
    [listId],
  );

  return {
    isAdding,
    isRemoving,
    removingId,
    error,
    clearError,
    pool,
    isPoolLoading,
    poolError,
    loadPool,
    addByEmail,
    addFromPool,
    removeMember,
  };
}
