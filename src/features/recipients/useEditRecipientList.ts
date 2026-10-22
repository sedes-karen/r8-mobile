import { useCallback, useState } from 'react';
import { deleteRecipientList, updateRecipientList } from '../../services/api/recipientListsApi';

/**
 * Renombrar y eliminar una lista — las dos acciones de la pantalla Edit.
 * Comparten `loading` y `error` porque nunca corren a la vez: mientras una está en curso la
 * pantalla deshabilita los dos botones.
 * Cada acción devuelve true/false para que la pantalla sepa si puede salir de la edición.
 */
export function useEditRecipientList(listId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rename = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      await updateRecipientList(listId, name);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar la lista');
      return false;
    } finally {
      setLoading(false);
    }
  }, [listId]);

  const remove = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteRecipientList(listId);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar la lista');
      return false;
    } finally {
      setLoading(false);
    }
  }, [listId]);

  return { rename, remove, loading, error };
}
