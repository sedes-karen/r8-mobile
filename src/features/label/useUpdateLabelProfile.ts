import { useCallback, useState } from 'react';
import { updateLabelProfile } from '../../services/api/labelsApi';
import type { UpdateLabelProfileInput } from '../../types/label';

/**
 * Actualiza el perfil del sello; resuelve true si se guardo bien y false si no.
 */
export function useUpdateLabelProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: UpdateLabelProfileInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await updateLabelProfile(input);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar el perfil');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}
