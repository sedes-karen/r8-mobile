import { useCallback, useState } from 'react';
import { updateRelease } from '../../services/api/releasesApi';
import type { UpdateReleaseBody } from '../../types/releases';

/**
 * Guarda cambios de un release (PATCH /releases/:releaseId). Resuelve true si se guardó bien,
 * false si no, y expone loading/error — mismo contrato que useUpdateLabelProfile.
 */
export function useUpdateRelease(releaseId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (body: UpdateReleaseBody): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await updateRelease(releaseId, body);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo actualizar el release');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [releaseId],
  );

  return { submit, loading, error };
}
