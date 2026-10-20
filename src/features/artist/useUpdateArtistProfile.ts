import { useCallback, useState } from 'react';
import { updateArtistMe, type UpdateArtistProfileInput } from '../../services/api/artistApi';

/**
 * PUT /artists/me — mismo contrato que useUpdateLabelProfile: `submit` resuelve true si el
 * servidor guardó bien y false si no (en cuyo caso queda el mensaje real del backend en `error`).
 */
export function useUpdateArtistProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: UpdateArtistProfileInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await updateArtistMe(input);
      return true;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el perfil');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}
