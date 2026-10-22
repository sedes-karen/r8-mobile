import { useCallback, useRef, useState } from 'react';
import { updateArtistProfile } from '../../services/api/artistApi';
import type { UpdateArtistProfileInput } from '../../types/artist';

/**
 * PUT /artists/me — mismo contrato que useUpdateLabelProfile: `submit` resuelve true si el
 * servidor guardó bien y false si no (en cuyo caso queda el mensaje real del backend en `error`).
 * Un envío simultáneo devuelve false sin iniciar otra solicitud ni alterar loading/error.
 */
export function useUpdateArtistProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const submit = useCallback(async (input: UpdateArtistProfileInput): Promise<boolean> => {
    if (inFlightRef.current) return false;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    try {
      await updateArtistProfile(input);
      return true;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el perfil');
      return false;
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}
