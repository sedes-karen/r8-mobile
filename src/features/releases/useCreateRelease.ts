import { useCallback, useState } from 'react';
import { createRelease, type CreateReleaseInput } from '../../services/api/releasesApi';

/** Alta de release — POST /releases. `submit` resuelve true si se creó, false si falló (ver `error`). */
export function useCreateRelease() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: CreateReleaseInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await createRelease(input);
      return true;
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Error inesperado');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}
