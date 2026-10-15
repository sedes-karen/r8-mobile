import { useCallback, useState } from 'react';
import { createRecipientList } from '../../services/api/recipientListsApi';

/** Alta de una lista de destinatarios. */
export function useCreateRecipientList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      await createRecipientList(name);
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo crear la lista',
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}