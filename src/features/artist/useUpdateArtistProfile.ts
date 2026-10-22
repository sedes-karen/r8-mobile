import { useCallback, useRef, useState } from 'react';
import { updateArtistProfile } from '../../services/api/artistApi';
import type { UpdateArtistProfileInput } from '../../types/artist';

/**
 * Guardado del perfil de artista — PUT /artists/me.
 * Firma acordada (igual que useUpdateLabelProfile): resuelve true si se guardó
 * bien, false si no, y expone loading/error. El error viene interpretado con
 * readApiError en la capa de servicios; acá solo se expone su mensaje.
 */
export function useUpdateArtistProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const submit = useCallback(
    async (input: UpdateArtistProfileInput): Promise<boolean> => {
      if (inFlightRef.current) {
        return false;
      }
      inFlightRef.current = true;
      setLoading(true);
      setError(null);
      try {
        await updateArtistProfile(input);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo actualizar el perfil');
        return false;
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  return { submit, loading, error };
}
